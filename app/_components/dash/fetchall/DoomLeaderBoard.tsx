'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { fetchPongLeaderboard } from '@/app/_service/game/calls';
import { LeaderboardEntry } from '@/app/_service/game/schemas';
import { Flex, Text } from '@radix-ui/themes';
import { useState, useEffect, useCallback } from 'react';

const PongLeaderBoard: React.FC = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);
	const [leaderBoard, setLeaderBoard] = useState<LeaderboardEntry[]>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await fetchPongLeaderboard();
				if (res.message === 'success') {
					setLeaderBoard(res.result.slice(0, 3));
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
			<>
				{leaderBoard.map((ele, index) => (
					<div key={index}>{ele.username}</div>
				))}
			</>
		);
	}, [isError, isLoading, leaderBoard]);

	return <>{content()}</>;
};

export default PongLeaderBoard;
