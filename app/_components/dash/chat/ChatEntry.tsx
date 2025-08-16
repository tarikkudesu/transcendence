'use client';

import { useAuth } from '@/app/_service/AuthContext';
import { OuterMessage } from '@/app/_service/ws/chat/schemas';
import { ClientPlayer, useGameSocket } from '@/app/_service/ws/game';
import { Text } from '@radix-ui/themes';
import Image from 'next/image';
import React from 'react';
import UserCallout from '../game/UserCallout';

interface ChatEntryProps {
	data: OuterMessage;
	active: boolean;
}

const ChatEntry: React.FC<ChatEntryProps> = ({ data, active }) => {
	const { username } = useAuth();
	const { pool } = useGameSocket();
	const online: boolean = pool.some((pool: ClientPlayer) => pool.username === data.sender);
	const playing: boolean = pool.some((pool: ClientPlayer) => online && pool.playerStatus === 'playing');

	return (
		<div
			role="button"
			className={`h-[80px] hover:bg-dark-600 border-b-[1px] border-b-dark-600 flex justify-start items-center px-6 cursor-pointer ${
				active ? 'bg-dark-600' : ''
			}`}
		>
			<UserCallout username={data.sender}>
				<div className="relative">
					{online && (
						<div
							className={`h-2 w-2 absolute bottom-0 right-0 ${
								playing ? 'bg-orange-500' : 'bg-accent-300'
							} border-[1px] border-dark-700`}
						></div>
					)}
					<Image
						priority
						className={`rounded-full cursor-pointer bg-accent-300`}
						src="https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar179.png"
						alt="player card"
						width={50}
						height={50}
					></Image>
				</div>
			</UserCallout>
			<div className="flex flex-col justify-center items-center w-full gap-1 ml-4">
				<div className="flex justify-between items-center w-full">
					<Text size="3" weight="bold" className="text-white">
						{data.sender === username ? data.receiver : data.sender}
					</Text>
					<Text size="1" className="text-dark-200">
						{data.lastMessage.date}
					</Text>
				</div>
				<div className="flex justify-between items-end w-full">
					<Text size="1" className="text-dark-200">
						{data.lastMessage.message}
					</Text>
					<Text size="1" weight="bold" className="text-dark-200">
						{data.unread === 0 ? (
							<>{data.unread}</>
						) : (
							<div className="bg-accent-300 text-black h-4 aspect-square flex justify-center items-center rounded-full pt-0.5">
								{data.unread}
							</div>
						)}
					</Text>
				</div>
			</div>
		</div>
	);
};

export default ChatEntry;
