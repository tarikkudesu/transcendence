import { PongButton } from '@/app/_components/buttons/ServerButtons';
import OnlinePlayers from '@/app/_components/dash/game/OnlinePlayers';
import ProfileWrapper from '@/app/_components/dash/profile/ProfileWrapper';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Text } from '@radix-ui/themes';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.playground,
};

const Playground: React.FC<unknown> = () => {
	return (
		<div className="mx-auto max-w-[1400px] grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
			<OnlinePlayers />
			<div className="my-[80px]">
				<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
					Play IRL
				</Text>
				<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
					Follow players on hot winning streaks and see who’s dominating the tournament right now.
				</Text>
				<div className="p-4 rounded-md bg-dark-700">
					<Link href="/dashboard/local" className="pb-3">
						<PongButton className="w-full bg-dark-950 text-white hover:bg-accent-300 hover:text-black border-[2px] border-accent-300">
							Play
						</PongButton>
					</Link>
				</div>
				<ProfileWrapper />
			</div>
		</div>
	);
};

export default Playground;
