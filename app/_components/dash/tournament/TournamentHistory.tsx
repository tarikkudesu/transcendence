'use client';

import { TournamentHistoryEntry } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const TournamentHistory: React.FC = ({}) => {
	const { isLoading, data: tournaments } = useGET<TournamentHistoryEntry[]>({ url: `${API_BASE}/game/tournament/history?end=10` });

	if (isLoading) return <Spinner />;

	return (
		<div className="my-[80px]">
			<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
				Tournament History
			</Text>
			<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
				Browse past tournaments, view winners, scores, and match highlights.
			</Text>
			{!tournaments || (tournaments.length === 0 && <>No Data...</>)}
			{tournaments &&
				tournaments.map((ele, index) => {
					return (
						<div key={index} className="bg-dark-950 px-[10%] py-[40px] mb-[10px]">
							<Flex justify="between" align="center">
								<Text as="div" size="7" className="font-black text-white">
									{ele.tournament_name}
									<Text as="div" size="3" className="text-dark-200">
										{ele.tournament_date}
									</Text>
								</Text>
								<Link href={'/main/dashboard/tournament/' + ele.tournament_name}>
									<button className="py-3 px-6 text-center bg-accent-300 text-xs text-black rounded-md cursor-pointer font-bold">
										See Details
									</button>
								</Link>
							</Flex>
						</div>
					);
				})}
			<Link href="/main/tournaments">
				<Text as="div" align="center" size="1" mb="2" weight="bold" className="text-accent-300">
					See full history
				</Text>
			</Link>
		</div>
	);
};

export default TournamentHistory;
