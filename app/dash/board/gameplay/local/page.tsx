import LocalPong from '@/app/_components/gameplay/pong/local';
import React from 'react';

const Chat: React.FC<unknown> = () => {
	return (
		<div className="rounded-md p-[20px]">
			<LocalPong />
		</div>
	);
};

export default Chat;
