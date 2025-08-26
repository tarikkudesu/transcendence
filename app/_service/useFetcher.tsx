'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { useCallback, useEffect, useState } from 'react';
import { MutateResponse } from './user/schema';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const client = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	timeout: 1000,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosRetry(axios, {
	retries: 3,
	retryDelay(retryCount) {
		console.log(`retry attempt ${retryCount}`);
		return 1000;
	},
	retryCondition(error) {
		return error.response?.status === 401;
	},
});

client.interceptors.response.use(undefined, (error) => {
	if (error instanceof AxiosError && error.response && error.response.status === 401) {
		console.log('refreshing token');
		try {
			client.post('/auth/refresh', undefined);
		} catch (err) {
			if (err instanceof AxiosError && err.response) {
				console.log({
					error: err.response.statusText,
					statusCode: err.response.status,
					message: err.response.data.message,
				});
			} else {
				console.log({
					error: 'Unknown Error',
					statusCode: 520,
					message: 'Something went wrong, Please try again later',
				});
			}
		}
	}
});

export interface PongError {
	error: string;
	message: string;
	statusCode: number;
}

export function useMutate<TBody = unknown>() {
	const [data, setData] = useState<MutateResponse | null>(null);
	const [error, setError] = useState<PongError | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const reset = useCallback(() => {
		setIsLoading(false);
		setError(null);
		setData(null);
	}, []);

	const fetchData = useCallback(
		async ({
			url,
			body,
			signal,
			method,
		}: {
			url: string;
			body: TBody | undefined;
			signal?: AbortSignal;
			method: 'POST' | 'PUT' | 'DELETE';
		}) => {
			reset();
			setIsLoading(true);
			try {
				switch (method) {
					case 'POST': {
						const response: AxiosResponse<MutateResponse> = await client.post(url, { ...body });
						setData(response.data);
						break;
					}
					case 'DELETE': {
						const response: AxiosResponse<MutateResponse> = await client.delete(url, { signal });
						setData(response.data);
						break;
					}
					case 'PUT': {
						const response: AxiosResponse<MutateResponse> = await client.put(url, { ...body });
						setData(response.data);
						break;
					}
				}
			} catch (err) {
				if (err instanceof AxiosError && err.response) {
					console.log({
						error: err.response.statusText,
						statusCode: err.response.status,
						message: err.response.data.message,
					})
					setError({
						error: err.response.statusText,
						statusCode: err.response.status,
						message: err.response.data.message,
					});
				} else {
					console.log({
						error: 'Unknown Error',
						statusCode: 520,
						message: 'Something went wrong, Please try again later',
					})
					setError({
						error: 'Unknown Error',
						statusCode: 520,
						message: 'Something went wrong, Please try again later',
					});
				}
			} finally {
				setIsLoading(false);
			}
		},
		[reset]
	);

	return { data, error, isLoading, fetchData, reset };
}

interface useGETProps {
	url: string;
	signal?: AbortSignal;
}
export function useGET<T = unknown>({
	url,
	signal,
}: useGETProps): { data: T | null; isLoading: boolean; error: PongError | null; refetch: () => void; reset: () => void } {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<PongError | null>(null);

	const reset = useCallback(() => {
		setIsLoading(false);
		setError(null);
		setData(null);
	}, []);

	const fetchData = useCallback(async () => {
		reset();
		setIsLoading(true);
		try {
			const response: AxiosResponse<T> = await client.get(url, { signal });
			setData(response.data);
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.response) {
				setError({
					error: err.response.statusText,
					statusCode: err.response.status,
					message: err.response.data.message,
				});
			} else {
				setError({
					error: 'Unknown Error',
					statusCode: 520,
					message: 'Something went wrong, Please try again later',
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, [reset, signal, url]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, isLoading, error, refetch: fetchData, reset };
}
