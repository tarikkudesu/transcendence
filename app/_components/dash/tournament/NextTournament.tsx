'use client';

import { RegisterMessage, useGameSocket } from '@/app/_service/ws/game';
import { Badge, Box, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useState } from 'react';

const NextTournament: React.FC = ({}) => {
	const { tournament, send } = useGameSocket();
	const [alias, setAlias] = useState<string>('');
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
							EMPTY SLOTS
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
							<label className="text-sm text-dark-200 my-3">
								Alias
								<input
									required
									minLength={4}
									maxLength={24}
									value={alias}
									placeholder="alias"
									className="w-full my-1 outline-none rounded-md px-3 py-2.5 text-sm bg-dark-600 text-white"
									onChange={(e: ChangeEvent<HTMLInputElement>) => setAlias(e.target.value)}
									type="text"
									name="alias"
								></input>
							</label>
							<button
								disabled={tournament.state !== 'open' || tournament.registered || !alias}
								onClick={() => send(RegisterMessage('pong', alias))}
								className="w-full py-2 my-3 px-4 text-center border-[1px] border-accent-300 bg-dark-950 disabled:border-dark-200 disabled:bg-dark-600 hover:bg-dark-900 text-sm disabled:opacity-40 text-white rounded-md cursor-pointer font-bold"
							>
								Register Now!
							</button>
						</>
					)}
					{tournament.state === 'playing' && (
						<button
							disabled={tournament.gid === ''}
							className="w-full py-2 my-3 px-4 text-center bg-accent-300 disabled:bg-dark-600 disabled:text-white text-sm disabled:opacity-40 text-black rounded-md cursor-pointer font-bold"
						>
							Play
						</button>
					)}
				</div>
			</div>
		</>
	);
};

export default NextTournament;
