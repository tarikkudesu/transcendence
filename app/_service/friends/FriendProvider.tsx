'use client';

import { useCallback } from 'react';
import { useGET } from '../useFetcher';
import { friendsContext } from './FriendContext';
import { Friend, FriendRequest } from '../schema';

interface FriendsProviderProps {
	children: React.ReactNode;
}

const FriendsProvider: React.FC<FriendsProviderProps> = ({ children }) => {
	const { data: friends, refetch: friendsRefetch } = useGET<Friend[]>({ url: `/friends` });
	const { data: requests, refetch: requestsRefetch } = useGET<FriendRequest[]>({ url: `/friends/request` });

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
