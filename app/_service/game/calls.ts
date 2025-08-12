'use client';

export interface RequestResult {
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: any;
}

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

async function getRequest<T>(endpoint: string): Promise<RequestResult> {
	try {
		const res = await fetch(`${API_BASE}${endpoint}`, {
			method: 'GET',
			credentials: 'include',
		});
		const json = await res.json();
		if (!res.ok) return { message: json.message ?? 'Please try again', result: undefined };
		return { message: 'success', result: json };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return { message: error.message ?? 'Please try again', result: undefined };
	}
}

export async function fetchPongHistory(username: string): Promise<RequestResult> {
	return getRequest(`/game/pong/history/${username}`);
}

export async function fetchDoomHistory(username: string): Promise<RequestResult> {
	return getRequest(`/game/doom/history/${username}`);
}

export async function fetchPongLeaderboard(): Promise<RequestResult> {
	return getRequest('/game/pong/leaderboard');
}

export async function fetchDoomLeaderboard(): Promise<RequestResult> {
	return getRequest('/game/doom/leaderboard');
}

export async function fetchPongSummary(username: string): Promise<RequestResult> {
	return getRequest(`/game/pong/summary/${username}`);
}

export async function fetchDoomSummary(username: string): Promise<RequestResult> {
	return getRequest(`/game/doom/summary/${username}`);
}

export async function fetchTournament(name: string): Promise<RequestResult> {
	return getRequest(`/game/tournament/${name}`);
}

export async function fetchTournamentHistory(): Promise<RequestResult> {
	return getRequest('/game/tournament/history');
}
