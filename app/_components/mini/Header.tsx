'use client';

import { useLogoutCall } from '@/app/_service/auth/Fetchers';
import { Flex } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { PongButton } from '../buttons/ServerButtons';
import Logo from './Logo';
import { useNotification } from './useNotify';

const Header: React.FC = ({}) => {
	const router = useRouter();
	const { notify } = useNotification();
	const { data, error, isLoading, logoutcall } = useLogoutCall();

	useEffect(() => {
		if (data) {
			notify({ message: data.message, success: true });
			router.push('/login');
		}
		if (error) {
			notify({ message: error.message, error: true });
		}
	}, [data, error, notify]);

	return (
		<header>
			<Flex justify="between" align="center" height="80px" mx="100px">
				<Logo />
				<PongButton
					onClick={() => logoutcall()}
					loading={isLoading}
					className="bg-dark-700 text-dark-200 hover:bg-accent-300 hover:text-black"
				>
					Log Out
				</PongButton>
			</Flex>
		</header>
	);
};

export default Header;
