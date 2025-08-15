import { PauseButton, ResetButton, SoudButtonOn } from '@/app/_components/gameplay/pong/Buttons';
import Table from '@/app/_components/gameplay/pong/table';
import { Text } from '@radix-ui/themes';
import React from 'react';

const Chat: React.FC<unknown> = () => {
	return (
		<div className="rounded-md border border-dark-600 shadow-xl p-[20px]">
			<div className="max-w-[800px] bg-black aspect-[4/3] relative overflow-hidden mx-auto rounded-md border border-dark-600 shadow-2xl mb-4">
				<Table />
			</div>
			<div className="flex justify-center items-center gap-4">
				<PauseButton />
				<SoudButtonOn />
				<ResetButton />
			</div>

		</div>
	);
};

export default Chat;
