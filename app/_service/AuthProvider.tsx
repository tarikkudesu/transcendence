'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import LoadingIndicator from '../_components/mini/Loading';
import { authContext } from './AuthContext';
import { useGET } from './useFetcher';
import { UserProfile } from './user/schema';

interface AuthProviderProps {
	children: React.ReactNode;
}

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost/api/v1';

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { data: user, error, isLoading } = useGET<UserProfile>({ url: `${API_BASE}/auth/me` });
	const router = useRouter();
	useEffect(() => {
		if (!isLoading && (!user || error)) router.push('/login');
	}, [error, isLoading, router, user]);
	if (isLoading || !user) return <LoadingIndicator size="md" />;
	const contextClass = {
		success: 'bg-dark-900 border-l-accent-300',
		error: 'bg-dark-900 border-l-red-600',
		info: 'bg-dark-900 border-l-blue-500',
		warning: 'bg-dark-900 border-l-golden-500',
		default: 'bg-dark-900 border-l-accent-300',
		dark: 'bg-dark-900 border-l-accent-300',
	};
	return (
		<authContext.Provider value={user}>
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
					' py-8 px-4 mt-1 rounded-md min-w-[300px] text-left border border-dark-500 border-l-4 border-l-accent-300 flex justify-start items-center'
				}
				closeButton={false}
			/>
			{children}
		</authContext.Provider>
	);
};

export default AuthProvider;
