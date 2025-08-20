import RemoteDoom from '@/app/_components/gameplay/doom/remote';
import { notFound } from 'next/navigation';
import React from 'react';

const Page: React.FC<{ params: Promise<{ gid: string }> }> = async ({ params }) => {
	const { gid } = await params;
	if (!gid) notFound();
	return (
		<div className="rounded-md p-[20px]">
			<RemoteDoom gid={gid} />
		</div>
	);
};

export default Page;
