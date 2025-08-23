'use client';

import { useCallback } from 'react';
import { useGET, useMutate } from '../useFetcher';
import { friendsContext } from './FriendContext';
import { Friend, FriendActionResponse, FriendRequest } from './schema';

interface FriendsProviderProps {
	children: React.ReactNode;
}

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const FriendsProvider: React.FC<FriendsProviderProps> = ({ children }) => {
	const { data: friends, refetch: friendsRefetch } = useGET<Friend[]>({ url: `${API_BASE}/friends` });
	const { data: requests, refetch: requestsRefetch } = useGET<FriendRequest[]>({ url: `${API_BASE}/friends/request` });
	const { isLoading, fetchData } = useMutate<FriendActionResponse>();

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

	const addCall = useCallback(
		async (username: string) => {
			await fetchData({ url: `${API_BASE}/friends/add`, method: 'POST', body: { to: username } });
			refetch();
		},
		[fetchData, refetch]
	);

	const acceptCall = useCallback(
		async (username: string) => {
			await fetchData({ url: `${API_BASE}/friends/accept`, method: 'PUT', body: { to: username } });
			refetch();
		},
		[fetchData, refetch]
	);

	const declineCall = useCallback(
		async (username: string) => {
			await fetchData({ url: `${API_BASE}/friends/remove`, method: 'DELETE', body: { to: username } });
			refetch();
		},
		[fetchData, refetch]
	);

	const blockCall = useCallback(
		async (username: string) => {
			await fetchData({ url: `${API_BASE}/friends/block`, method: 'PUT', body: { to: username } });
			refetch();
		},
		[fetchData, refetch]
	);

	return (
		<friendsContext.Provider
			value={{
				requests: requests ? requests : [],
				friends: friends ? friends : [],
				friend,
				request,
				refetch,
				isLoading,
				acceptCall,
				declineCall,
				blockCall,
				addCall,
			}}
		>
			{children}
		</friendsContext.Provider>
	);
};

export default FriendsProvider;
