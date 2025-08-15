'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { useAuth } from '@/app/_service/AuthContext';
import { fetchPongSummary } from '@/app/_service/game/calls';
import { PongSummary } from '@/app/_service/game/schemas';
import { Flex, Text } from '@radix-ui/themes';
import { useCallback, useEffect, useState } from 'react';

const MyStatsTournament: React.FC = ({}) => {
	const { username } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);
	const [stats, setStats] = useState<PongSummary>({
		total_games: 0,
		total_winns: 0,
		totalTournamentPlayed: 0,
		totalTournamentWinns: 0,
	});

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await fetchPongSummary(username);
				if (res.message === 'success') {
					setStats(res.result);
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
	}, [username]);

	const content = useCallback(() => {
		if (isLoading)
			return (
				<Text as="div" align="center" mt="5s">
					Loading...
				</Text>
			);
		if (isError)
			return (
				<Text as="div" align="center" mt="5s">
					ErrorPage
				</Text>
			);
		return (
			<Flex justify="center" gap="6" direction={{ initial: 'column', lg: 'row' }} align="center" className="px-[40px] py-[20px]">
				<Text size="8" weight="bold" as="div" className="text-accent-300">
					{stats.totalTournamentWinns}
					<Text size="3" as="div" className="text-white">
						winns
					</Text>
				</Text>
				<Text size="8" weight="bold" as="div" className="text-dark-200">
					{stats.totalTournamentPlayed}
					<Text size="3" as="div" className="text-white">
						Played
					</Text>
				</Text>
				<Text size="8" weight="bold" as="div" className="text-red-600">
					{stats.totalTournamentPlayed - stats.totalTournamentWinns}
					<Text size="3" as="div" className="text-white">
						Losts
					</Text>
				</Text>
			</Flex>
		);
	}, [isError, isLoading, stats]);

	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8">
			<Text as="div" align="center" size="5" mb="2" weight="bold">
				Tournament Statistics
			</Text>
			{content()}
		</div>
	);
};

export default MyStatsTournament;
