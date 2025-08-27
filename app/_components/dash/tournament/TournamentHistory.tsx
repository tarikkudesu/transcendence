'use client';

import { TournamentHistoryEntry } from '@/app/_service/schema';
import { useGET } from '@/app/_service/useFetcher';
import { Flex, Text } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { Spinner } from '../../mini/Loading';

const TournamentHistory: React.FC = ({}) => {
	const { isLoading, data: tournaments } = useGET<TournamentHistoryEntry[]>({ url: `/game/tournament/history?end=10` });

	if (isLoading) return <Spinner />;

	return (
		<div className="my-[80px]">
			<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
				Tournament History
			</Text>
			<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
				Browse past tournaments, view winners, scores, and match highlights.
			</Text>
			{tournaments &&
				tournaments.map((ele, index) => {
					return (
						<div key={index} className="bg-dark-950 px-[10%] py-[40px] mb-[10px]">
							<Flex justify="between" align="center">
								<Text as="div" size="7" className="font-black text-white">
									{ele.tournament_name}
									<Text as="div" size="3" className="text-dark-200">
										{formatDistanceToNow(Number(ele.tournament_date), { addSuffix: true })}
									</Text>
								</Text>
								<Link href={'/main/dashboard/tournament/' + ele.tournament_name}>
									<PongButton className="bg-accent-300 text-black font-bold">See Details</PongButton>
								</Link>
							</Flex>
						</div>
					);
				})}
			{tournaments?.length === 10 && (
				<Link href="/main/tournaments">
					<Text as="div" align="center" size="1" mb="2" weight="bold" className="text-accent-300">
						See full history
					</Text>
				</Link>
			)}
		</div>
	);
};

export default TournamentHistory;
