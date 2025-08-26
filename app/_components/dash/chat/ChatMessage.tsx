import { Message } from '@/app/_service/ws/chat/schemas';

import { format, isThisWeek, isToday, isYesterday } from 'date-fns';
import React from 'react';
import SafeImage from '../../mini/SafeImage';
import UserCallout from '../game/UserCallout';

interface ChatMyMessageProps {
	data: Message;
}

function formatDate(date: number | string): string {
	const parsedDate = Number(date);
	if (isToday(parsedDate)) return format(parsedDate, 'HH:mm');
	if (isYesterday(parsedDate)) return 'Yesterday';
	if (isThisWeek(parsedDate, { weekStartsOn: 1 })) return format(parsedDate, 'EEEE');
	return format(parsedDate, 'eeee d, yyyy');
}

export const ChatMyMessage: React.FC<ChatMyMessageProps> = ({ data }) => {
	return (
		<div className="flex justify-between m-4">
			<div className=""></div>
			<div className="max-w-[70%]">
				<div className="flex justify-between">
					<div className=""></div>
					<div className="text-sm py-2 px-4 text-black rounded-t-[12px] rounded-br-[4px] rounded-bl-[12px] bg-accent-400">
						{data.message}
					</div>
				</div>
				<div className="text-dark-200 text-xs mt-1 text-right text-nowrap">{formatDate(Number(data.date))}</div>
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
			<div className="flex justify-start items-end gap-2">
				<UserCallout username={data.sender}>
					<SafeImage
						fallbackSrc="/Logo.png"
						priority
						className={`rounded-full cursor-pointer`}
						src="https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar179.png"
						alt="player card"
						width={40}
						height={40}
					></SafeImage>
				</UserCallout>
				<div className="w-[70%]">
					<div className="flex justify-between">
						<div className="text-sm py-2 px-4 rounded-t-[12px] rounded-bl-[4px] rounded-br-[12px] bg-dark-700 text-white">
							{data.message}
						</div>
					</div>
					<div className="text-dark-200 text-xs mt-1 text-nowrap">{formatDate(Number(data.date))}</div>
				</div>
			</div>
			<div className=""></div>
		</div>
	);
};
