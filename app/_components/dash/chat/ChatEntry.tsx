'use client';

import { OuterMessage } from '@/app/_service/schema';
import { Text } from '@radix-ui/themes';

import React from 'react';
import SafeImage from '../../mini/SafeImage';
import { formatDate } from './ChatMessage';

interface ChatEntryProps {
	setActive: (u: string, a: string) => void;
	data: OuterMessage;
	active: boolean;
}

const ChatEntry: React.FC<ChatEntryProps> = ({ data, active, setActive }) => {
	return (
		<>
			<div
				className={`h-[80px] hover:bg-accent-900/20 flex justify-start items-center px-6 cursor-pointer duration-200 relative ${
					active ? 'bg-accent-900/10' : ''
				}`}
				onClick={() => {
					setActive(data.friend, data.avatar);
				}}
			>
				<div className="relative">
					<SafeImage
						priority
						width={50}
						height={50}
						alt="player card"
						fallbackSrc="/Logo.png"
						className="rounded-full cursor-pointer"
						src={data.avatar}
					></SafeImage>
				</div>
				<div className="flex flex-col justify-center items-center w-full gap-0.5 ml-4">
					<div className="flex justify-between items-center w-full gap-2">
						<Text size="3" weight="bold" className="text-white">
							{data.friend}
						</Text>
						<Text size="1" className="text-dark-200 text-right">
							{data.lastMessage.date && formatDate(Number(data.lastMessage.date))}
						</Text>
					</div>
					<div className="flex justify-between items-end w-full">
						<Text size="1" className="text-dark-200">
							{data.lastMessage.message.slice(0, 25)}...
						</Text>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChatEntry;
