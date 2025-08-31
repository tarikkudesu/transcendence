'use client';

import { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import client from '../axios/client';
import { Friend, FriendRequest, PongError } from '../schema';
import { friendsContext } from './FriendContext';

function useGETF<T = unknown>({ url }: { url: string }) {
	const controller = useMemo(() => new AbortController(), []);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<T | null>(null);

	const fetchData = useCallback(
		async (signal: AbortSignal) => {
			try {
				setIsLoading(true);
				const response: AxiosResponse<T> = await client.get(url, { signal: signal });
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
		},
		[url]
	);

	useEffect(() => {
		fetchData(controller.signal);
		return () => controller.abort();
	}, [controller, fetchData, url]);

	const refetch = useCallback(() => {
		fetchData(controller.signal);
	}, [controller.signal, fetchData]);

	return { isLoading, error, data, refetch };
}

function useGETR<T = unknown>({ url }: { url: string }) {
	const controller = useMemo(() => new AbortController(), []);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<PongError | null>(null);
	const [data, setData] = useState<T | null>(null);

	const fetchData = useCallback(
		async (signal: AbortSignal) => {
			try {
				setIsLoading(true);
				const response: AxiosResponse<T> = await client.get(url, { signal: signal });
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
		},
		[url]
	);

	useEffect(() => {
		fetchData(controller.signal);
		return () => controller.abort();
	}, [controller, fetchData, url]);

	const refetch = useCallback(() => {
		fetchData(controller.signal);
	}, [controller.signal, fetchData]);

	return { isLoading, error, data, refetch };
}

interface FriendsProviderProps {
	children: React.ReactNode;
}

const FriendsProvider: React.FC<FriendsProviderProps> = ({ children }) => {
	const { data: friends, refetch: friendsRefetch } = useGETF<Friend[]>({ url: `/friends` });
	const { data: requests, refetch: requestsRefetch } = useGETR<FriendRequest[]>({ url: `/friends/request` });

	const friend = useCallback(
		(username: string): Friend | null => {
			if (!friends) return null;
			const f = friends.find((ele) => ele.username === username);
			if (f) return f;
			return null;
		},
		[friends]
	);

	const request = useCallback(
		(username: string): FriendRequest | null => {
			if (!requests) return null;
			const f = requests.find((ele) => ele.username === username);
			if (f) return f;
			return null;
		},
		[requests]
	);

	const refetch = useCallback(() => {
		friendsRefetch();
		requestsRefetch();
	}, [friendsRefetch, requestsRefetch]);

	return (
		<friendsContext.Provider
			value={{
				requests: requests ? requests : [],
				friends: friends ? friends : [],
				friend,
				request,
				refetch,
			}}
		>
			{children}
		</friendsContext.Provider>
	);
};

export default FriendsProvider;
