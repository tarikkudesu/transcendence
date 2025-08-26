'use client';

import LoadingIndicator from '@/app/_components/mini/Loading';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { protectedroutes } from '../consts';
import { useGET } from '../useFetcher';
import { UserProfile } from './schema';
import { userContext } from './userContext';

const contextClass = {
	success: 'bg-dark-900 border-l-accent-300',
	error: 'bg-dark-900 border-l-red-600',
	info: 'bg-dark-900 border-l-blue-500',
	warning: 'bg-dark-900 border-l-golden-500',
	default: 'bg-dark-900 border-l-accent-300',
	dark: 'bg-dark-900 border-l-accent-300',
};

const UserProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { data, isLoading: userLoading, error: userError } = useGET<UserProfile>({ url: `/users/me` });
	const [user, setUser] = useState<UserProfile>({ created_at: '', username: '', avatar: '', email: '', bio: '' });
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const pathname = usePathname();
	const router = useRouter();

	console.log(user);

	const setAuth = useCallback(() => {
		setAuthenticated(true);
	}, []);

	const reset = useCallback(() => {
		setUser({ created_at: '', username: '', avatar: '', email: '', bio: '' });
		setAuthenticated(false);
	}, []);

	useEffect(() => {
		if (protectedroutes.some((ele) => ele === pathname) && !authenticated) router.push('/login');
		// else if (!protectedroutes.some((ele) => ele === pathname) && authenticated) router.push('/main');
	}, [pathname, router, authenticated]);

	useEffect(() => {
		if (userError) router.push('/login');
		else if (data) setUser({ ...data });
	}, [data, reset, router, userError]);

	if (userLoading) return <LoadingIndicator size="md" />;

	return (
		<userContext.Provider value={{ ...user, reset, setAuthenticated: setAuth }}>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				toastClassName={(context) =>
					contextClass[context?.type || 'default'] +
					' py-8 px-4 mt-1 rounded-md w-[300px] text-left border border-dark-500 border-l-4 border-l-accent-300 flex justify-start'
				}
				closeButton={false}
			/>
			{children}
		</userContext.Provider>
	);
};

export default UserProvider;
