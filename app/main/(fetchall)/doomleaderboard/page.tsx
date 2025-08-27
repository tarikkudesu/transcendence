import DoomLeaderBoard from '@/app/_components/dash/fetchall/DoomLeaderBoard';
import Footer from '@/app/_components/mini/Footer';
import Header from '@/app/_components/mini/Header';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Text } from '@radix-ui/themes';
import { Metadata } from 'next';
import React from 'react';


export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.doomLeaderboard,
};


const Page: React.FC<unknown> = () => {
	return (
		<>
			<Header />
			<div className="max-w-[1000px] mx-auto my-4">
				<div className="my-[80px]">
					<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
						Doom Cards LeaderBoard
					</Text>
					<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
						Watch ongoing tournament games in real time and track their progress from start to finish.
					</Text>
				</div>
				<DoomLeaderBoard />
			</div>
			<Footer />
		</>
	);
};

export default Page;
