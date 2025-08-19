import LocalPong from '@/app/_components/gameplay/pong/local/local';
import React from 'react';

const Page: React.FC<unknown> = () => {
	return (
		<div className="rounded-md p-[20px]">
			<LocalPong />
		</div>
	);
};

export default Page;
