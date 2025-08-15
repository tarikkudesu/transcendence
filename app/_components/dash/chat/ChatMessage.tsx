import { Message } from '@/app/_service/ws/chat/schemas';
import Image from 'next/image';
import React from 'react';
import UserCallout from '../game/UserCallout';

interface ChatMyMessageProps {
	data: Message;
}

export const ChatMyMessage: React.FC<ChatMyMessageProps> = ({ data }) => {
	return (
		<div className="flex justify-between m-4">
			<div className=""></div>
			<div className="max-w-[70%]">
				<div className="text-sm py-2 px-4 text-black rounded-t-[12px] rounded-br-[4px] rounded-bl-[12px] bg-accent-400">
					{data.message}
				</div>
				<div className="text-dark-200 text-sm mt-1">{data.date.slice(0, 10)}</div>
			</div>
		</div>
	);
};

interface ChatMyMessageProps {
	data: Message;
}

export const ChatOtherMessage: React.FC<ChatMyMessageProps> = ({ data }) => {
	return (
		<div className="flex justify-between m-4">
			<div className="max-w-[70%] flex justify-start items-end gap-2">
				<UserCallout username={data.sender}>
					<Image
						priority
						className={`rounded-full cursor-pointer bg-accent-300`}
						src="https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar179.png"
						alt="player card"
						width={40}
						height={40}
					></Image>
				</UserCallout>
				<div className="flex-grow">
					<div className="text-sm py-2 px-4 rounded-t-[12px] rounded-bl-[4px] rounded-br-[12px] bg-dark-700 text-white">
						{data.message}
					</div>
					<div className="text-dark-200 text-sm mt-1">{data.date.slice(0, 10)}</div>
				</div>
			</div>
			<div className=""></div>
		</div>
	);
};
