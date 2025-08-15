'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { useAuth } from '@/app/_service/AuthContext';
import { fetchDoomHistory } from '@/app/_service/game/calls';
import { DoomHistoryEntry } from '@/app/_service/game/schemas';
import { Badge, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import UserCallout from './game/UserCallout';

const MyDoomHistory: React.FC = ({}) => {
	const { username } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);
	const [history, setHistory] = useState<DoomHistoryEntry[]>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await fetchDoomHistory(username);
				if (res.message === 'success') {
					setHistory(res.result.slice(0, 10));
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
			<>
				{history.map((ele, index) => (
					<div key={index} className="grid grid-cols-6 grid-rows-5 gap-[8px]">
						<Text as="div" size="2" className="text-dark-50 col-span-3 row-span-5">
							<UserCallout username={ele.player_username}>{ele.player_username}</UserCallout>

							<Text weight="bold" className="text-accent-300 mx-2">
								:
							</Text>
							<UserCallout username={ele.opponent_username}>{ele.opponent_username}</UserCallout>
						</Text>
						<Text className="row-span-5 col-start-4">
							{ele.player_username === ele.winner_username ? (
								<Badge color="green">Won</Badge>
							) : (
								<Badge color="red">Lost</Badge>
							)}
						</Text>
						<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
							{ele.game_date}
						</Text>
					</div>
				))}
			</>
		);
	}, [history, isError, isLoading]);

	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8 px-6">
			<Flex justify="between" align="center" gap="4" mb="4">
				<Text as="div" size="5" mb="2" weight="bold">
					My Doom Cards Match History
				</Text>
				<Link href="">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 640"
						height={24}
						width={24}
						className="text-dark-200 hover:text-accent-300"
					>
						<path
							fill="currentColor"
							d="M224.5 160C224.5 147.1 232.3 135.4 244.3 130.4C256.3 125.4 270 128.2 279.1 137.4L439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C269.9 511.9 256.2 514.6 244.2 509.6C232.2 504.6 224.5 492.9 224.5 480L224.5 160z"
						/>
					</svg>
				</Link>
			</Flex>
			<div className="grid grid-cols-6 grid-rows-5 gap-2">
				<Text size="2" className="text-dark-200 col-span-3 row-span-5">
					Players
				</Text>
				<Text size="2" className="text-dark-200 row-span-5 col-start-4">
					Result
				</Text>
				<Text size="2" className="text-dark-200 col-span-2 row-span-5 col-start-5">
					Date
				</Text>
			</div>
			{content()}
		</div>
	);
};

export default MyDoomHistory;
