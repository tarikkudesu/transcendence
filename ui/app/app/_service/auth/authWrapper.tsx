'use client';

import LoadingIndicator from '@/app/_components/mini/Loading';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const AuthWrapper: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [authenticated, setAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`${API_BASE}/users/me`, {
					method: 'GET',
					credentials: 'include',
				});
				if (!res.ok) throw new Error('Something went wrong');
				setAuthenticated(true);
				router.push('/');
			} catch (error: unknown) {
				void error;
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [router]);

	if (isLoading) return <LoadingIndicator />;

	if (authenticated) return null;

	return children;
};

export default AuthWrapper;
