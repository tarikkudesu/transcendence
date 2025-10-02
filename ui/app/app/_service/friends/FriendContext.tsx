'use client';

import { createContext, useContext } from 'react';
import { BlockedFriend, Friend, FriendRequest } from '../schema';

class FriendsState {
	friends: Friend[] = [];
	blocked: BlockedFriend[] = [];
	requests: FriendRequest[] = [];

	refetch: () => void = () => true;
	friend: (u: string) => Friend | null = (u: string) => {
		void u;
		return null;
	};
	request: (u: string) => FriendRequest | null = (u: string) => {
		void u;
		return null;
	};
}

export const friendsContext = createContext(new FriendsState());

export function useFriends() {
	return useContext(friendsContext);
}
