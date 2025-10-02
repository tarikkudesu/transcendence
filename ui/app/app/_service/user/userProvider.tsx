'use client';

import LoadingIndicator from '@/app/_components/mini/Loading';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import client from '../axios/client';
import { UserProfile } from '../schema';
import { userContext } from './userContext';

const contextClass = {
	success: 'bg-dark-900 border-l-accent-300',
	error: 'bg-dark-900 border-l-red-600',
	info: 'bg-dark-900 border-l-blue-500',
	warning: 'bg-dark-900 border-l-orange-600',
	default: 'bg-dark-900 border-l-accent-300',
	dark: 'bg-dark-900 border-l-accent-300',
};

const UserProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const router = useRouter();
	const fetchData = (): Promise<UserProfile> => client.get(`/users/me`).then((response) => response.data);
	const { data: user, error: userError, isPending: userLoading } = useQuery({
		queryKey: ['usersme'],
		queryFn: fetchData,
		staleTime: 0,
	});

	useEffect(() => {
		if (userError) router.push('/login');
	}, [router, userError]);

	if (userLoading) return <LoadingIndicator />;
	if (userError || !user) return null;

	return (
		<userContext.Provider value={{ ...user }}>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar
				closeOnClick
				rtl={false}
				draggable
				pauseOnFocusLoss
				pauseOnHover
				theme="dark"
				toastClassName={(context) =>
					contextClass[context?.type || 'default'] +
					' py-8 px-4 mt-1 rounded-md w-[500px] text-left border border-dark-500 border-l-4 border-l-accent-300 flex justify-start'
				}
				closeButton={false}
			/>
			{children}
		</userContext.Provider>
	);
};

export default UserProvider;
