'use client';

import { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import client from '../axios/client';
import { PongError } from '../useFetcher';
import { UserProfile } from '../schema';

export function useGetMe() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<UserProfile | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<UserProfile> = await client.get('/users/me');
			setData(response.data);
		} catch (err) {
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
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { isLoading, error, data };
}

export function useGetUser(username: string) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<UserProfile | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const response: AxiosResponse<UserProfile> = await client.get(`/users/${username}`);
			setData(response.data);
		} catch (err) {
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
	}, [username]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { isLoading, error, data };
}
