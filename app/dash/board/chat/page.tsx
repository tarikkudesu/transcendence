import ChatConversation from '@/app/_components/dash/chat/ChatConversation';
import ChatList from '@/app/_components/dash/chat/ChatList';
import React from 'react';

const Chat: React.FC<unknown> = () => {
	return (
		<div className="grid grid-cols-[300px_1fr] grid-rows-5 h-[800px]">
			<div className="row-span-5 py-6 shadow-lg bg-dark-700 border-r-[1px] border-dark-500 h-full">
				<ChatList />
			</div>
			<div className="row-span-5 h-full min-w-[300px]">
				<ChatConversation />
			</div>
		</div>
	);
};

export default Chat;
