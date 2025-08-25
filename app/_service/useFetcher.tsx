import { useCallback, useEffect, useState } from 'react';
import { MutateResponse } from './user/schema';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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

	const fetchData = async ({
		url,
		body,
		signal,
		method,
	}: {
		url: string;
		body: TBody;
		signal?: AbortSignal;
		method: 'POST' | 'PUT' | 'DELETE';
	}) => {
		reset();
		setIsLoading(true);
		try {
			// await new Promise((resolve) => setTimeout(resolve, 10000));
			const res = await fetch(`${API_BASE}${url}`, {
				method: method,
				credentials: 'include',
				headers: body ? { 'Content-Type': 'application/json' } : undefined,
				body: JSON.stringify(body),
				signal,
			});
			if (!res.ok) setError((await res.json()) as PongError);
			else setData((await res.json()) as MutateResponse);
		} catch (err) {
			setError({
				message: err instanceof Error ? err.message : 'Something went wrong, Please try again later...',
				error: 'Unknown Error',
				statusCode: 300,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return { data, error, isLoading, fetchData, reset };
}

interface useGETProps {
	url: string;
	revalidate?: number;
	signal?: AbortSignal;
}
export function useGET<T = unknown>({
	url,
	signal,
	revalidate,
}: useGETProps): { data: T | null; isLoading: boolean; error: PongError | null; refetch: () => void } {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [error, setError] = useState<PongError | null>(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			// await new Promise(resolve => setTimeout(resolve, 10000));
			const res = await fetch(`${API_BASE}${url}`, { credentials: 'include', signal, next: { revalidate: revalidate } });
			if (isMounted) {
				if (!res.ok) setError((await res.json()) as PongError);
				else setData((await res.json()) as T);
			}
		} catch (err: unknown) {
			if (isMounted)
				setError({
					message: err instanceof Error ? err.message : 'Something went wrong, Please try again later...',
					error: 'Unknown Error',
					statusCode: 300,
				});
		} finally {
			if (isMounted) setIsLoading(false);
		}
	}, [isMounted, revalidate, signal, url]);

	useEffect(() => {
		setIsMounted(true);
		fetchData();
		return () => setIsMounted(false);
	}, [fetchData]);

	return { data, isLoading, error, refetch: fetchData };
}
