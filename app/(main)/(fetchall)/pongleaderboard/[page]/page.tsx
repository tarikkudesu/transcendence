import PongLeaderBoard from '@/app/_components/dash/fetchall/PongLeaderBoard';
import Footer from '@/app/_components/mini/Footer';
import Header from '@/app/_components/mini/Header';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Text } from '@radix-ui/themes';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.pongLeaderboard,
};


const Page: React.FC<{ params: Promise<{ page: string }> }> = async ({ params }) => {
	const { page } = await params;
	if (!page) notFound();

	return (
		<>
			<Header />
			<div className="max-w-[1000px] mx-auto my-4">
				<div className="my-[80px]">
					<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
						Ping Pong LeaderBoard
					</Text>
					<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
						Watch ongoing tournament games in real time and track their progress from start to finish.
					</Text>
				</div>
				<PongLeaderBoard page={Number(page)} />
			</div>
			<Footer />
		</>
	);
};

export default Page;
