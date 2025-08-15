'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { fetchTournamentHistory } from '@/app/_service/game/calls';
import { TournamentHistoryEntry } from '@/app/_service/game/schemas';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const TournamentHistory: React.FC = ({}) => {
	const [isError, setError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tournaments, setTournaments] = useState<TournamentHistoryEntry[]>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await fetchTournamentHistory();
				if (res.message === 'success') {
					setTournaments(res.result);
				} else {
					setError(true);
				}
			} catch (err) {
				void err;
				setError(true);
			}
			setIsLoading(false);
		}
		fetchData();
	}, []);

	if (isLoading) return <Spinner />;
	if (isError) return <>Error Page</>;

	return (
		<div className="my-[80px]">
			<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
				Tournament History
			</Text>
			<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
				Browse past tournaments, view winners, scores, and match highlights.
			</Text>
			{tournaments.map((ele, index) => {
				return (
					<div key={index} className="bg-dark-950 px-[10%] py-[40px] mb-[10px]">
						<Flex justify="between" align="center">
							<Text as="div" size="7" className="font-black text-white">
								{ele.tournament_name}
								<Text as="div" size="3" className="text-dark-200">
									{ele.tournament_date}
								</Text>
							</Text>
							<Link href={"/dash/board/tournament/" + ele.tournament_name}>
								<button className="py-3 px-6 text-center bg-accent-300 text-xs text-black rounded-sm cursor-pointer font-bold">
									See Details
								</button>
							</Link>
						</Flex>
					</div>
				);
			})}
		</div>
	);
};

export default TournamentHistory;
