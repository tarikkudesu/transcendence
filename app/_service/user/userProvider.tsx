'use client';

import LoadingIndicator from '@/app/_components/mini/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../auth/authContext';
import { useGET } from '../useFetcher';
import { UserProfile } from './schema';
import { userContext } from './userContext';

interface UserProviderProps {
	children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const { data: auth, isLoading: authLoading, error: authError, refreshtokencall } = useAuth();
	const { data: user, isLoading: userLoading, error: userError } = useGET<UserProfile>({ url: `/auth/me` });
	const router = useRouter();

	useEffect(() => {
		if (userError && authError) {
			router.push('/login');
		} else if (userError) {
			refreshtokencall();
		}
	}, [authError, refreshtokencall, userError]);

	if (userLoading) return <LoadingIndicator size="md" />;
	if (!user) return null;

	const contextClass = {
		success: 'bg-dark-900 border-l-accent-300',
		error: 'bg-dark-900 border-l-red-600',
		info: 'bg-dark-900 border-l-blue-500',
		warning: 'bg-dark-900 border-l-golden-500',
		default: 'bg-dark-900 border-l-accent-300',
		dark: 'bg-dark-900 border-l-accent-300',
	};

	return (
		<userContext.Provider value={user}>
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
