'use client';

import LoadingIndicator from '@/app/_components/mini/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useGetMe } from './getUser';
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
	const router = useRouter();
	const { data: user, isLoading: userLoading, error: userError } = useGetMe();

	useEffect(() => {
		if (userError) router.push('/login');
	}, [router, userError]);

	if (userLoading) return <LoadingIndicator size="md" />;
	if (!user) return null;

	return (
		<userContext.Provider value={{ ...user }}>
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
