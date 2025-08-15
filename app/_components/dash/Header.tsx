'use client';

import { RequestResult, logout } from '@/app/_service/auth/calls';
import { Button, Flex, Text } from '@radix-ui/themes';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import Logo from '../Logo';
import { useNotification } from '../useNotify';
import NotificationCenter from './notification/NotificationCenter';

const Header: React.FC = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { notify } = useNotification();
	const pathname = usePathname();
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
		<header className="w-full h-[150px] absolute top-0 left-0 right-0 bg-dark-700 shadow-lg">
			<Flex justify="between" align="center" height="80px" mx="100px">
				<Logo />
				<Flex gap="8" align="center">
					<NotificationCenter />
					<Button
						variant="solid"
						onClick={logoutCall}
						loading={isLoading}
						className="py-3 px-4 text-center bg-dark-900 text-xs text-dark-200 hover:text-black hover:bg-accent-300 rounded-sm cursor-pointer font-bold"
					>
						Log Out
					</Button>
				</Flex>
			</Flex>
			<Text as="div" align="center" className="text-dark-200 z-10">
				{pathname}
			</Text>
		</header>
	);
};

export default Header;
