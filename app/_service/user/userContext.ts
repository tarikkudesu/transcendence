

import { createContext, useContext } from 'react';

export interface UserProfileState {
	created_at: string;
	username: string;
	avatar: string;
	email: string;
	bio: string;
}
export const UserProfileInitialState = {
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
