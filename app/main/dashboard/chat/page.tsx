import ChatList from '@/app/_components/dash/chat/ChatList';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.chat,
};


const Chat: React.FC<unknown> = () => {
	return (
		<div className="grid grid-cols-[300px_1fr] grid-rows-5 h-[800px]">
			<ChatList />
		</div>
	);
};

export default Chat;
