import { Message } from '@/app/_service/ws/chat/schemas';

import { format } from 'date-fns';
import React from 'react';
import UserCallout from '../game/UserCallout';
import SafeImage from '../../mini/SafeImage';

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
				<div className="text-dark-200 text-xs mt-1">
					{/* {Date.now() - Number(data.date) < 3600 * 1000 ? format(data.date, 'HH:mm') : format(data.date, 'yyyy-MM-dd')} */}
					{format(Date.now(), 'HH:mm')}
				</div>
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
				<div className="flex-grow">
					<div className="text-sm py-2 px-4 rounded-t-[12px] rounded-bl-[4px] rounded-br-[12px] bg-dark-700 text-white">
						{data.message}
					</div>
					<div className="text-dark-200 text-xs mt-1">
						{/* {Date.now() - Number(data.date) < 3600 * 1000 ? format(data.date, 'HH:mm') : format(data.date, 'yyyy-MM-dd')} */}
						{format(Date.now(), 'HH:mm')}
					</div>
				</div>
			</div>
			<div className=""></div>
		</div>
	);
};
