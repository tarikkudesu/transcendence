import { createContext, useContext } from 'react';

export const UserProfileInitialState = {
	created_at: '',
	username: '',
	avatar: '',
	email: '',
	bio: '',
};

export const userContext = createContext(UserProfileInitialState);

export function useUser() {
	return useContext(userContext);
}
