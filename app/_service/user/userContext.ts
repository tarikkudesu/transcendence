import { createContext, useContext } from 'react';

export interface UserProfileState {
	setAuthenticated: () => void;
	reset: () => void;
	created_at: string;
	username: string;
	avatar: string;
	email: string;
	bio: string;
}
export const UserProfileInitialState = {
	setAuthenticated: () => confirm,
	reset: () => confirm,
	created_at: '',
	username: '',
	avatar: '',
	email: '',
	bio: '',
};

export const userContext = createContext<UserProfileState>(UserProfileInitialState);

export function useUser() {
	return useContext(userContext);
}
