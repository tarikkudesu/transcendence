'use client';

import { useFriends } from '@/app/_service/friends/FriendContext';
import { Friend } from '@/app/_service/friends/schema';
import { useGameSocket } from '@/app/_service/ws/game';
import { Text } from '@radix-ui/themes';
import React, { useState } from 'react';
import SafeImage from '../../mini/SafeImage';

interface UserProps {
	username: string;
	children: React.ReactNode;
}

const UserCallout: React.FC<UserProps> = ({ username, children }) => {
	const { friend } = useFriends();
	const { online } = useGameSocket();
	const [active, setActive] = useState<boolean>();
	const user: Friend | null = friend(username);

	return (
		<>
			{active && user && <div className="fixed inset-0 z-40 bg-dark-800/25" onClick={() => setActive(false)}></div>}
			{active && user && (
				<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-dark-800 rounded-md border border-dark-500 w-[400px] min-h-[100px] shadow-xl z-50">
					<div className="flex justify-start items-center">
						<SafeImage
							priority
							width={58}
							height={58}
							src={user.avatar_url}
							alt="player card"
							fallbackSrc="/Logo.png"
							className={'rounded-full cursor-pointer'}
						></SafeImage>
						<Text as="div" className="ml-4 text-md font-bold">
							{user.username}
							{online(user.username) === 'free' ? (
								<Text as="div" size="1" className="font-medium text-accent-300">
									Online
								</Text>
							) : online(user.username) === 'playing' ? (
								<Text as="div" size="1" className="font-medium text-accent-300">
									Playing
								</Text>
							) : (
								<Text as="div" size="1" className="font-medium text-dark-300">
									Offline
								</Text>
							)}
						</Text>
					</div>
					<Text as="div" className="text-md text-dark-200 my-4">
						{user.bio}
					</Text>
				</div>
			)}
			<span
				className="cursor-pointer"
				onClick={() => {
					if (user) setActive(true);
				}}
			>
				{children}
			</span>
		</>
	);
};

export default UserCallout;
