import LocalPong from '@/app/_components/gameplay/pong/local';
import React from 'react';

const Chat: React.FC<unknown> = () => {
	return (
		<div className="rounded-md border border-dark-600 shadow-xl p-[20px]">
			<LocalPong />
		</div>
	);
};

export default Chat;
