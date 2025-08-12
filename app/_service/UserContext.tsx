'use client';

import { createContext } from 'react';
import { UserProfile } from './user/schema';

export const UserProfileInitialState = {
	username: '',
	email: '',
	bio: '',
	created_at: '',
	avatar: '',
};

interface UserProfileContextType {
	user: UserProfile;
	setUsername: (user: string) => void;
}

const UserProfileContext = createContext<UserProfileContextType>({
	user: UserProfileInitialState,
	setUsername: (user: string) => void user,
});

export default UserProfileContext;
