'use client';

import type { UpdatePasswordRequest, UpdateUsernameRequest, UpdateBioRequest, UpdateAvatarRequest } from './schema';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost/api/v1';

export interface RequestResult {
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: any;
}

async function request<T>(method: 'PUT' | 'DELETE' | 'GET', endpoint: string, body?: T): Promise<RequestResult> {
	try {
		const res = await fetch(`${API_BASE}${endpoint}`, {
			method,
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: body ? JSON.stringify(body) : undefined,
		});
		const json = await res.json();
		if (!res.ok) return { message: json.message ?? 'Please try again', result: undefined };
		return { message: 'success', result: json };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return { message: error.message ?? 'Please try again', result: undefined };
	}
}

export async function updateAvatar(username: string, data: UpdateAvatarRequest): Promise<RequestResult> {
	return request('PUT', `/users/profile/avatar/${username}`, data);
}

export async function updatePassword(username: string, data: UpdatePasswordRequest): Promise<RequestResult> {
	return request('PUT', `/users/profile/password/${username}`, data);
}

export async function updateUsername(username: string, data: UpdateUsernameRequest): Promise<RequestResult> {
	return request('PUT', `/users/profile/username/${username}`, data);
}

export async function updateBio(username: string, data: UpdateBioRequest): Promise<RequestResult> {
	return request('PUT', `/users/profile/bio/${username}`, data);
}

export async function deleteUser(username: string): Promise<RequestResult> {
	return request('DELETE', `/users/${username}`);
}

export async function getUser(username: string): Promise<RequestResult> {
	return request('GET', `/users/${username}`);
}
