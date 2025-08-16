'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authContext } from './AuthContext';
import { getMe, RequestResult } from './user/calls';
import { UserProfile } from './user/schema';
import LoadingIndicator from '../_components/Loading';

interface AuthProviderProps {
	children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		// setUser({
		// 	avatar: '',
		// 	bio: '',
		// 	created_at: 'yesterday',
		// 	email: '',
		// 	username: 'rick',
		// });
		// return;
		setIsLoading(true);
		async function fetchMe() {
			try {
				const res: RequestResult = await getMe();
				if (res.message === 'success') setUser(res.result);
				else throw new Error('failed');
			} catch (err) {
				void err;
				router.push('/login');
			} finally {
				setIsLoading(false);
			}
		}
		fetchMe();
	}, []);

	if (isLoading || !user) return <LoadingIndicator size="md" />;
	return <authContext.Provider value={user}>{children}</authContext.Provider>;
};

export default AuthProvider;
