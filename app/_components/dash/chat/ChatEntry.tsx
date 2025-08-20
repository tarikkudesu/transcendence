'use client';

import { OuterMessage } from '@/app/_service/ws/chat/schemas';
import { Text } from '@radix-ui/themes';


import React from 'react';
import SafeImage from '../../mini/SafeImage';

interface ChatEntryProps {
	setActive: (e: string) => void;
	data: OuterMessage;
	active: boolean;
}

const ChatEntry: React.FC<ChatEntryProps> = ({ data, active, setActive }) => {
	return (
		<div
			className={`h-[80px] hover:bg-dark-600 border-b-[1px] border-b-dark-600 flex justify-start items-center px-6 cursor-pointer duration-200 ${
				active ? 'bg-dark-600' : ''
			}`}
			onClick={() => {
				setActive(data.friend);
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
				<div className="flex justify-between items-center w-full">
					<Text size="3" weight="bold" className="text-white">
						{data.friend}
					</Text>
					<Text size="1" className="text-dark-200">
						{data.lastMessage.date}
						{/* {Date.now() - Number(data.lastMessage.date) < 3600 * 1000
							? format(data.lastMessage.date, 'HH:mm')
							: format(data.lastMessage.date, 'yyyy-MM-dd')} */}
					</Text>
				</div>
				<div className="flex justify-between items-end w-full">
					<Text size="1" className="text-dark-200">
						{data.lastMessage.message.slice(0, 25)}...
					</Text>
				</div>
			</div>
		</div>
	);
};

export default ChatEntry;
