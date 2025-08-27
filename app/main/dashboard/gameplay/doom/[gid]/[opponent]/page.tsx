import RemoteDoom from '@/app/_components/gameplay/doom/remote';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

type Props = {
	params: Promise<{ gid: string; opponent: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { opponent } = await params;
	if (!opponent) return { ...baseMetadata };
	return {
		...baseMetadata,
		...mainAppMetadata.doomGameplay(opponent),
	};
}

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
