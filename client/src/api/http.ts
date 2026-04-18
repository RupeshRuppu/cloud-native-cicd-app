const API_BASE = import.meta.env.API_BASE;

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

	const response = await fetch(`${API_BASE}${path}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(await parseError(response));
	}

	if (response.status === 204) {
		return {} as T;
	}

	return response.json() as Promise<T>;
}
