'use client';

import { useAuth } from '@/app/_service/auth/authContext';
import { Flex } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import Logo from '../../mini/Logo';
import { useNotification } from '../../mini/useNotify';
import MainSearch from '../friends/MainSearch';
import FriendRequestCenter from '../notification/FriendRequestCenter';
import GameInviteCenter from '../notification/GameInviteCenter';
import NotificationCenter from '../notification/NotificationCenter';

const Header: React.FC = ({}) => {
	const router = useRouter();
	const { notify } = useNotification();
	const { logoutcall, isLoading, data, error } = useAuth();

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
					<PongButton
						onClick={() => logoutcall()}
						loading={isLoading}
						className="bg-dark-700 text-dark-200 hover:text-white hover:bg-dark-600"
					>
						Log Out
					</PongButton>
				</Flex>
			</Flex>
		</header>
	);
};

export default Header;
