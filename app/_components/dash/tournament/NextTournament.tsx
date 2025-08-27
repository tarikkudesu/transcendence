'use client';

import { useUser } from '@/app/_service/user/userContext';
import { RegisterMessage, useGameSocket } from '@/app/_service/ws/game';
import { Badge, Box, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';

const NextTournament: React.FC = ({}) => {
	const router = useRouter();
	const { username } = useUser();
	const { tournament, send } = useGameSocket();
	const [alias, setAlias] = useState<string>(username);

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
							<label className="text-sm text-dark-200 my-4">
								Alias
								<input
									required
									minLength={4}
									maxLength={24}
									value={alias}
									placeholder="alias"
									className={`w-full mt-1 mb-4 outline-none rounded-md px-3 py-2.5 text-sm bg-dark-600 text-white ${
										alias ? '' : 'border border-red-600'
									}`}
									onChange={(e: ChangeEvent<HTMLInputElement>) => setAlias(e.target.value)}
									type="text"
									name="alias"
								></input>
							</label>
							<PongButton
								disabled={tournament.state !== 'open' || tournament.registered || !alias}
								onClick={() => send(RegisterMessage('pong', alias))}
								className="w-full bg-accent-300 disabled:bg-dark-600 disabled:text-white disabled:opacity-40 text-black font-bold"
							>
								Register Now!
							</PongButton>
						</>
					)}
					{tournament.state === 'playing' && tournament.registered && (
						<PongButton
							disabled={tournament.gid === ''}
							onClick={() => router.push(`/main/dashboard/gameplay/pong/${tournament.gid}/tournament`)}
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
