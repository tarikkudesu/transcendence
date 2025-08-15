'use client';

import { OuterMessage } from '@/app/_service/ws/chat/schemas';
import { ClientPlayer, useGameSocket } from '@/app/_service/ws/game';
import { Text } from '@radix-ui/themes';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import UserCallout from '../game/UserCallout';
import { ChatMessage } from '@/app/_service/ws/chat/composer';
import { useChatSocket } from '@/app/_service/ws/chat/chatContext';

interface ChatEntryProps {
	data: OuterMessage;
}

const ChatEntry: React.FC<ChatEntryProps> = ({ data }) => {

	console.log(data);
	
	const searchParams = useSearchParams();
	const [active, setActive] = useState<boolean>(false);
	const { pool } = useGameSocket();
	const { send } = useChatSocket();
	const router = useRouter();
	const online: boolean = pool.some((pool: ClientPlayer) => pool.username === data.sender);
	const playing: boolean = pool.some((pool: ClientPlayer) => online && pool.playerStatus === 'playing');
	
	useEffect(() => {
		const chatmate = searchParams.get('chatmate');
		if (chatmate && chatmate === data.sender) setActive(true);
		else setActive(false);
	}, [data]);
	
	const updateQuery = useCallback(() => {
		console.log('------------------------------');
		console.log(data.lastMessage.sender);
		console.log('------------------------------');
		const params = new URLSearchParams(searchParams.toString());
		send(ChatMessage('REQUESTUSER', { user: data.sender }));
		params.set('chatmate', data.sender);
		params.set('chatmateavatar', data.avatar);
		router.push(`?${params.toString()}`);
	}, [data]);
	
	return (
		<div
			role="button"
			onClick={updateQuery}
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
						{data.sender}
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
