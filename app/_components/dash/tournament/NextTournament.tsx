'use client';

import { useUser } from '@/app/_service/user/userContext';
import { useGameSocket } from '@/app/_service/ws/game';
import { Badge, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { formatDate } from '../chat/ChatMessage';

const NextTournament: React.FC = ({}) => {
	const router = useRouter();
	const { username } = useUser();
	const { tournament } = useGameSocket();

	console.log(tournament);

	return (
		<>
			<div className="my-[80px]">
				<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
					Tournament Live Preview
				</Text>
				<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
					Play your matches, track your progress, and spectate other games as they happen.
				</Text>

				<div className="mt-4 p-4 rounded-md bg-dark-950 shadow-lg">
					<div className="grid grid-cols-6 grid-rows-5 gap-2">
						<Text size="2" className="text-dark-200 col-span-2 row-span-5">
							NAME
						</Text>
						<Text size="2" className="text-dark-200 row-span-5 col-start-3">
							SLOTS
						</Text>
						<Text size="2" className="text-dark-200 row-span-5 col-start-4">
							STATE
						</Text>
						<Text size="2" className="text-dark-200 col-span-2 row-span-5 col-start-5">
							DATE
						</Text>
						<Text size="2" className="text-dark-50 font-bold col-span-2 row-span-5">
							{tournament.name ? tournament.name : '-'}
						</Text>
						<Text size="2" className="text-dark-50 row-span-5 col-start-3">
							{tournament.emptySlots ? tournament.emptySlots : '-'}
						</Text>

						<Text size="2" className="text-dark-50 row-span-5 col-start-4">
							<Badge>{tournament.state}</Badge>
						</Text>
						<Text size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
							{tournament.date ? formatDate(tournament.date) : '-'}
						</Text>
					</div>
					<PongButton
						disabled={!tournament.registered || !tournament.gid}
						onClick={() => {
							const match = tournament.nextMatches.find((e) => e.player === username || e.opponent === username);
							if (match) {
								if (match.player === username) router.push(`/pong/${match.opponent}/${tournament.gid}`);
								else router.push(`/pong/${match.player}/${tournament.gid}`);
							}
						}}
						className="w-full my-4 bg-accent-300 disabled:bg-dark-700 disabled:border-dark-300/40 border-accent-300 border-2 disabled:text-dark-100 text-black font-bold"
					>
						Play
					</PongButton>
				</div>
			</div>
		</>
	);
};

export default NextTournament;
