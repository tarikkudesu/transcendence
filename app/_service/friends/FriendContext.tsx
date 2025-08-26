'use client';

import { createContext, useContext } from 'react';
import { Friend, FriendRequest } from './schema';

class FriendsState {
	friends: Friend[] = [];
	requests: FriendRequest[] = [];

	refetch: () => void = () => true;
	friend: (u: string) => Friend | null = (u: string) => null;
	request: (u: string) => FriendRequest | null = (u: string) => null;
}

export const friendsContext = createContext(new FriendsState());

export function useFriends() {
	return useContext(friendsContext);
}
