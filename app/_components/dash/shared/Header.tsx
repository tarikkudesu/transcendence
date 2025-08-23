'use client';

import { RequestResult, logout } from '@/app/_service/auth/calls';
import { Button, Flex } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Logo from '../../mini/Logo';
import { useNotification } from '../../mini/useNotify';
import MainSearch from '../friends/MainSearch';
import NotificationCenter from '../notification/NotificationCenter';
import GameInviteCenter from '../notification/GameInviteCenter';
import FriendRequestCenter from '../notification/FriendRequestCenter';

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
		<header className="w-full h-[150px] absolute top-0 left-0 right-0g">
			<div className="w-full h-[150px] absolute top-0 left-0 right-0 bg-dark-700 -z-10 shadow-l"></div>
			<Flex justify="between" align="center" height="80px" mx="100px" className="z-10">
				<Flex justify="start" align="center" gap="4">
					<Logo />
					<MainSearch />
				</Flex>
				<Flex gap="6" align="center">
					<GameInviteCenter />
					<FriendRequestCenter />
					<NotificationCenter />
					<Button
						variant="solid"
						onClick={logoutCall}
						loading={isLoading}
						className="py-3 px-4 text-center bg-dark-900 text-xs text-dark-200 hover:text-black hover:bg-accent-300 rounded-md cursor-pointer font-bold"
					>
						Log Out
					</Button>
				</Flex>
			</Flex>
		</header>
	);
};

export default Header;
