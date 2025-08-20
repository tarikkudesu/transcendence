
import RemotePong from '@/app/_components/gameplay/pong/remote';
import { notFound } from 'next/navigation';
import React from 'react';

const Page: React.FC<{ params: Promise<{ gid: string }> }> = async ({ params }) => {
	const { gid } = await params;
	if (!gid) notFound();
	return (
		<div className="rounded-md p-[20px]">
			<RemotePong gid={gid} />
		</div>
	);
};

export default Page;
