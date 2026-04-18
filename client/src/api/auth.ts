import { request, tokenStore } from './http';

type AuthResponse = {
	access: string;
	refresh: string;
};

type Credentials = {
	username: string;
	password: string;
};

export async function register(credentials: Credentials): Promise<void> {
	const data = await request<AuthResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(credentials),
	});
	tokenStore.setTokens(data.access, data.refresh);
}

export async function login(credentials: Credentials): Promise<void> {
	const data = await request<AuthResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify(credentials),
	});
	tokenStore.setTokens(data.access, data.refresh);
}

export function logout(): void {
	tokenStore.clear();
}
