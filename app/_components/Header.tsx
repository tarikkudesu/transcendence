'use client';
import { Button, Flex } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { logout, RequestResult } from '../_service/auth/calls';
import Logo from './Logo';
import { useNotification } from './useNotify';

const Header: React.FC = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { notify } = useNotification();
	const router = useRouter();

	const logoutCall = useCallback(async () => {
		setIsLoading(true);
		const result: RequestResult = await logout();
		if (result.message === 'success') {
			notify({ message: 'Success', success: true });
			router.push('/login');
		}
		setIsLoading(false);
	}, []);

	return (
		<header>
			<Flex justify="between" align="center" height="80px" mx="100px">
				<Logo />
				<Button
					variant="solid"
					onClick={logoutCall}
					loading={isLoading}
					className="py-3 px-4 text-center bg-dark-700 text-xs text-dark-200 hover:text-white hover:bg-dark-600 rounded-sm cursor-pointer font-bold"
				>
					Log Out
				</Button>
			</Flex>
		</header>
	);
};

export default Header;
