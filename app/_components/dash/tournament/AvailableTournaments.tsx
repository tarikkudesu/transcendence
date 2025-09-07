'use client';

import { RegisterMessage, TournamentOverview, useGameSocket } from '@/app/_service/ws/game';
import { Badge, Box, Callout, Flex, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { formatDate } from '../chat/ChatMessage';
import { User } from '../game/User';

const AvailableTournaments: React.FC = ({}) => {
	const [t, setT] = useState<TournamentOverview | null>(null);
	const [name, setName] = useState<string>('');
	const [alias, setAlias] = useState<string>('');
	const { tournaments, tournament, send } = useGameSocket();

	const filterTournaments = useCallback(
		(temp: TournamentOverview): boolean => {
			if (!name) return true;
			return temp.name.toLowerCase().includes(name.toLowerCase());
		},
		[name]
	);

	return (
		<div className="my-[80px] text-nowrap">
			<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
				Browse Tournaments
			</Text>
			<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
				Here you can find all public tournaments with available spots. Browse the list and register for one to join the competition!
			</Text>
			<div className="flex justify-between items-center gap-4 text-dark-200 my-4 text-sm">
				<input
					required
					value={name}
					minLength={4}
					maxLength={24}
					disabled={tournament.registered}
					placeholder="Tournament name"
					className={`flex-grow outline-none rounded-[3px] px-3 py-2.5 text-sm bg-dark-700 text-white placeholder:text-dark-300 border border-dark-100/30`}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
					type="text"
					name="name"
				></input>
				<input
					required
					value={alias}
					minLength={4}
					maxLength={24}
					placeholder="Alias"
					disabled={tournament.registered}
					className={`flex-grow outline-none rounded-[3px] px-3 py-2.5 text-sm bg-dark-700 text-white placeholder:text-dark-300 border border-dark-100/30`}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setAlias(e.target.value)}
					name="alias"
					type="text"
				></input>
				<PongButton
					className="bg-accent-300 disabled:bg-dark-700 disabled:text-dark-100 text-black font-bold"
					disabled={!alias || !t || tournament.registered}
					onClick={() => {
						if (t) send(RegisterMessage('pong', alias, t.creator));
					}}
				>
					Register Now!
				</PongButton>
			</div>
			{tournament.registered && (
				<Callout.Root variant="soft" color="lime">
					<Callout.Text>
						You&apos;re all set! Head to the <strong>Live</strong> tab to play your match and track your progress.
					</Callout.Text>
				</Callout.Root>
			)}
			<Box height="24px" />
			{tournaments.filter(filterTournaments).map((ele, index) => {
				return (
					<div key={index} className="bg-dark-950 px-[5%] py-[40px] mb-[10px]">
						<Flex justify="between" align="center" gap="6">
							<div className="grid grid-cols-6 grid-rows-5 gap-2 flex-grow">
								<Text size="2" className="text-dark-200 col-span-2 row-span-5">
									NAME
								</Text>
								<Text size="2" className="text-dark-200 row-span-5 col-start-3">
									CREATOR
								</Text>
								<Text size="2" className="text-dark-200 row-span-5 col-start-4">
									STATE
								</Text>
								<Text size="2" className="text-dark-200 col-span-2 row-span-5 col-start-5">
									DATE
								</Text>
								<Text size="2" className="text-dark-50 font-bold col-span-2 row-span-5">
									{ele.name}
								</Text>
								<Text size="2" className="text-dark-50 row-span-5 col-start-3">
									<User.Username username={ele.creator} />
								</Text>

								<Text size="2" className="text-dark-50 row-span-5 col-start-4">
									<Badge>{ele.state}</Badge>
								</Text>
								<Text size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
									{formatDate(ele.date)}
								</Text>
							</div>
							<PongButton
								className="bg-accent-300 disabled:bg-dark-600 disabled:text-white disabled:opacity-40 text-black font-bold"
								disabled={tournament.registered}
								onClick={() => {
									setT(ele);
									setName(ele.name);
								}}
							>
								Select
							</PongButton>
						</Flex>
					</div>
				);
			})}
		</div>
	);
};

export default AvailableTournaments;
