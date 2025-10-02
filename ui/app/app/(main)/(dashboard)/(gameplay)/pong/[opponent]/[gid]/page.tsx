import RemotePong from '@/app/_components/gameplay/pong/remote';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import PongProvider from '@/app/_service/ws/game/pongProvider';
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
		...mainAppMetadata.pongGameplay(opponent),
	};
}

const Page: React.FC<{ params: Promise<{ gid: string; opponent: string }> }> = async ({ params }) => {
	const { gid, opponent } = await params;
	if (!gid || !opponent) notFound();

	return (
		<div className="rounded-md p-[20px] min-h-[600px] relative">
			<PongProvider gid={gid}>
				<RemotePong opponent={opponent} />
			</PongProvider>
		</div>
	);
};

export default Page;
