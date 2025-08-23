import { useCallback, useEffect, useState } from 'react';

export function useMutate<TResponse = unknown, TBody = unknown>() {
	const [data, setData] = useState<TResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

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
		setIsLoading(true);
		setError(null);
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const res = await fetch(url, {
				method: method,
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
				signal,
			});
			if (!res.ok) throw new Error(await res.text());
			const result = (await res.json()) as TResponse;
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setIsLoading(false);
		}
	};
	return { data, error, isLoading, fetchData };
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
}: useGETProps): { data: T | null; isLoading: boolean; error: string | null; refetch: () => void } {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch(url, { credentials: 'include', signal, next: { revalidate: revalidate } });
			if (!res.ok) throw new Error(await res.text());
			const json: T = await res.json();
			if (isMounted) {
				setData(json);
				setError(null);
			}
		} catch (err: unknown) {
			if (isMounted) setError(err instanceof Error ? err.message : 'Something went wrong');
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
