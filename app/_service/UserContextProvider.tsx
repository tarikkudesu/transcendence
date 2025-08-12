'use client';

import { useCallback, useEffect, useState } from 'react';
import UserProfileContext, { UserProfileInitialState } from './UserContext';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfile } from './user/schema';
import { getUser, RequestResult } from './user/calls';
import { useNotification } from '../_components/useNotify';
import { routes } from './consts';
export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	// const { notify } = useNotification();

	const [username_, setUsername_] = useState<string>('');
	const [user, setUserState] = useState<UserProfile>(UserProfileInitialState);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hydrated, setHydrated] = useState<boolean>(false);

	// Load username from localStorage once
	useEffect(() => {
		const saved = localStorage.getItem('user_profile');
		if (saved) setUsername_(saved);
		setHydrated(true);
	}, []);

	// Save username to localStorage when it changes
	useEffect(() => {
		if (hydrated) localStorage.setItem('user_profile', username_);
	}, [username_, hydrated]);

	// Fetch user profile when username changes
	useEffect(() => {
		if (!hydrated) return; // Wait until localStorage is read

		if (!username_) {
			if (!routes.includes(pathname)) router.push('/login');
			setIsLoading(false);
			return;
		}

		const fetchUser = async () => {
			try {
				setIsLoading(true);
				const result: RequestResult = await getUser(username_);
				if (result.message === 'success') {
					setUserState(result.result as UserProfile);
					if (routes.includes(pathname)) router.push('/dash');
				} else if (!routes.includes(pathname)) {
					router.push('/login');
				}
			} catch {
				if (!routes.includes(pathname)) router.push('/login');
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, [username_, pathname, hydrated]);

	// Function to update username
	const setUsername = useCallback((username: string) => {
		setUsername_(username);
	}, []);

	return <UserProfileContext.Provider value={{ user, setUsername }}>{isLoading ? 'Loading...' : children}</UserProfileContext.Provider>;
};
