import RemoteDoom from '@/app/_components/gameplay/doom/remote';
import { notFound } from 'next/navigation';
import React from 'react';

const Page: React.FC<{ params: Promise<{ gid: string; opponent: string }> }> = async ({ params }) => {
	const { gid, opponent } = await params;
	if (!gid || !opponent) notFound();

	return (
		<div className="rounded-md p-[20px]">
			<RemoteDoom gid={gid} opponent={opponent} />
		</div>
	);
};

export default Page;
