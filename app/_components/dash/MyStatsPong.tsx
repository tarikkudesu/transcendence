'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { fetchPongSummary } from '@/app/_service/game/calls';
import { PongSummary } from '@/app/_service/game/schemas';
import UserProfileContext from '@/app/_service/UserContext';
import { Flex, Text } from '@radix-ui/themes';
import { useCallback, useContext, useEffect, useState } from 'react';

const MyStatsPong: React.FC = ({}) => {
	const { user } = useContext(UserProfileContext);
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
				const res: RequestResult = await fetchPongSummary(user.username);
				console.log(res);
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
	}, [user.username]);

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
			<Flex justify="center" gap="9" align="center" className="px-[40px] py-[20px]">
				<div className="">
					<div className="h-[100px] w-[100px] rounded-full border-4 border-red-600 bg-dark-900 flex justify-center items-center text-xl font-black relative overflow-hidden">
						{stats.total_games - stats.total_winns}
						<div className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-dark-400 opacity-25"></div>
					</div>
					<Text as="div" size="4" align="center" weight="bold" className="mt-4">
						Lost
					</Text>
				</div>
				<div className="">
					<div className="h-[100px] w-[100px] rounded-full border-4 border-slate-600 bg-dark-900 flex justify-center items-center text-xl font-black relative overflow-hidden">
						{stats.total_games}
						<div className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-dark-400 opacity-25"></div>
					</div>
					<Text as="div" size="4" align="center" weight="bold" className="mt-4">
						Played
					</Text>
				</div>
				<div className="">
					<div className="h-[100px] w-[100px] rounded-full border-4 border-accent-300 bg-dark-900 flex justify-center items-center text-xl font-black relative overflow-hidden">
						{stats.total_winns}
						<div className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-dark-400 opacity-25"></div>
					</div>
					<Text as="div" size="4" align="center" weight="bold" className="mt-4">
						winns
					</Text>
				</div>
			</Flex>
		);
	}, [isError, isLoading, stats]);

	return (
		<div className="my-8">
			<Text as="div" align="center" size="5" mb="2" weight="bold">
				Ping Pong Statistics
			</Text>
			<div className="flex-grow p-4 rounded-md bg-dark-700">{content()}</div>
		</div>
	);
};

export default MyStatsPong;
