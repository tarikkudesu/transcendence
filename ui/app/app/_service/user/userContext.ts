

import { createContext, useContext } from 'react';
import { UserProfile } from '../schema';

export const UserProfileInitialState = {
	created_at: '',
	username: '',
	avatar: '',
	email: '',
	bio: '',
};

export const userContext = createContext<UserProfile>(UserProfileInitialState);

export function useUser() {
	return useContext(userContext);
}
