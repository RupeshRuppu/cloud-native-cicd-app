const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const tokenStore = {
	getAccess: () => localStorage.getItem(ACCESS_KEY),
	getRefresh: () => localStorage.getItem(REFRESH_KEY),
	setTokens: (access: string, refresh: string) => {
		localStorage.setItem(ACCESS_KEY, access);
		localStorage.setItem(REFRESH_KEY, refresh);
	},
	clear: () => {
		localStorage.removeItem(ACCESS_KEY);
		localStorage.removeItem(REFRESH_KEY);
	},
};

type RequestOptions = RequestInit & {
	auth?: boolean;
};

type ErrorBody = {
	detail?: string;
	[key: string]: unknown;
};

const isExpiredTokenError = (status: number, message: string): boolean => {
	if (status !== 401) return false;
	const normalized = message.toLowerCase();
	return normalized.includes('token') && normalized.includes('expired');
};

const parseError = async (res: Response): Promise<string> => {
	try {
		const data = (await res.json()) as ErrorBody;
		if (typeof data.detail === 'string') {
			return data.detail;
		}
		return JSON.stringify(data);
	} catch {
		return res.statusText || 'Request failed';
	}
};

export async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const headers = new Headers(options.headers || {});
	headers.set('Content-Type', 'application/json');

	if (options.auth) {
		const token = tokenStore.getAccess();
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
	}

	const endpoint =
		import.meta.env.IS_PROD === 'TRUE' ? path : 'http://127.0.0.1:8000';

	const response = await fetch(`${endpoint}${path}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const errorMessage = await parseError(response);
		if (isExpiredTokenError(response.status, errorMessage)) {
			tokenStore.clear();
			window.location.replace('/auth');
		}
		throw new Error(errorMessage);
	}

	if (response.status === 204) {
		return {} as T;
	}

	return response.json() as Promise<T>;
}
