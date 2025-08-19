import RemotePong from '@/app/_components/gameplay/pong/remote/remote';
import { notFound } from 'next/navigation';
import React from 'react';

const Page: React.FC<{ params: { gid: string } }> = ({ params }) => {
	const { gid } = params;
	if (!gid) notFound();
	return (
		<div className="rounded-md p-[20px]">
			<RemotePong gid={gid} />
		</div>
	);
};

export default Page;
