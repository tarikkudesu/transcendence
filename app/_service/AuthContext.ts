import { createContext, useContext } from 'react';

export const UserProfileInitialState = {
	created_at: '',
	username: '',
	avatar: '',
	email: '',
	bio: '',
};

export const authContext = createContext(UserProfileInitialState);

export function useAuth() {
	return useContext(authContext);
}
