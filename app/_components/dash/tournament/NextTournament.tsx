'use client';

import { useUser } from '@/app/_service/user/userContext';
import { RegisterMessage, useGameSocket } from '@/app/_service/ws/game';
import { Badge, Box, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const NextTournament: React.FC = ({}) => {
	const router = useRouter();
	const { username } = useUser();
	const { tournament, send } = useGameSocket();

	return (
		<>
			<div className="my-[80px]">
				<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
					Next Tournament
				</Text>
				<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
					Stay informed about the upcoming tournament’s date, time, and format so you don’t miss out.
				</Text>
				<div className="p-4 rounded-md bg-dark-950 shadow-lg">
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
							{tournament.name}
						</Text>
						<Text size="2" className="text-dark-50 row-span-5 col-start-3">
							{tournament.emptySlots}
						</Text>

						<Text size="2" className="text-dark-50 row-span-5 col-start-4">
							<Badge>{tournament.state}</Badge>
						</Text>
						<Text size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
							{tournament.date}
						</Text>
					</div>
					<Box height="18px" />
					{tournament.state !== 'playing' && (
						<>
							<PongButton
								disabled={tournament.state !== 'open' || tournament.registered}
								onClick={() => send(RegisterMessage('pong', username))}
								className="w-full bg-accent-300 disabled:bg-dark-600 disabled:text-white disabled:opacity-40 text-black font-bold"
							>
								Register Now!
							</PongButton>
						</>
					)}
					{tournament.state === 'playing' && tournament.registered && (
						<PongButton
							disabled={tournament.gid === ''}
							onClick={() => {
								const match = tournament.nextMatches.find((e) => e.player === username || e.opponent === username);
								if (match) {
									if (match.player === username) router.push(`/pong/${match.opponent}/${tournament.gid}`);
									else router.push(`/pong/${match.player}/${tournament.gid}`);
								}
							}}
							className="w-full bg-accent-300 disabled:bg-dark-600 disabled:text-white disabled:opacity-40 text-black font-bold"
						>
							Play
						</PongButton>
					)}
				</div>
			</div>
		</>
	);
};

export default NextTournament;
