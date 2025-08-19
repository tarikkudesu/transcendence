'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface UserCalloutProps {
	children: React.ReactNode;
	className?: string;
	username: string;
}

const UserCallout: React.FC<UserCalloutProps> = ({ children, username, className }) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const updateQuery = () => {
		if (username) {
			const params = new URLSearchParams(searchParams.toString());
			params.set('profile', username);
			router.push(`?${params.toString()}`);
		}
	};

	return (
		<div onClick={updateQuery} className={`cursor-pointer inline-block ${className}`}>
			{children}
		</div>
	);
};

export default UserCallout;
