import OnlinePlayers from '@/app/_components/dash/game/OnlinePlayers';
import React from 'react';
import { Text } from '@radix-ui/themes';
import { PongButton } from '@/app/_components/buttons/ServerButtons';
import Link from 'next/link';
import MyStatsPong from '@/app/_components/dash/profile/MyStatsPong';

const Playground: React.FC<unknown> = () => {
	return (
		<div className="mx-auto max-w-[1024px] grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
			<OnlinePlayers />
			<div className="my-[80px]">
				<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
					Play IRL
				</Text>
				<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
					Follow players on hot winning streaks and see who’s dominating the tournament right now.
				</Text>
				<div className="p-4 rounded-md bg-dark-700">
					<Link href="/dash/board/gameplay/local">
						<PongButton className="w-full bg-dark-950 border-[1px] border-accent-300 text-white hover:bg-accent-300 hover:text-black">
							Play
						</PongButton>
					</Link>
				</div>
				<MyStatsPong />
			</div>
		</div>
	);
};

export default Playground;
