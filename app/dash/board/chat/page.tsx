import ChatList from '@/app/_components/dash/chat/ChatList';
import React from 'react';

const Chat: React.FC<unknown> = () => {
	return (
		<div className="grid grid-cols-[300px_1fr] grid-rows-5 h-[800px]">
			<ChatList />
		</div>
	);
};

export default Chat;
