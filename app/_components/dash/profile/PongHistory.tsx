'use client';

import { PongHistoryEntry } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { SvgClockArrow, SvgSpinner } from '@/app/_svg/svg';
import { Badge, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useCallback } from 'react';

import { formatDistanceToNow } from 'date-fns';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const PongHistory: React.FC<{ username: string }> = ({ username }) => {
	const { data, error, isLoading } = useGET<PongHistoryEntry[]>({ url: `${API_BASE}/game/pong/history/${username}?end=10` });

	const content = useCallback(() => {
		if (isLoading) return <SvgSpinner size={24} />;
		if (error) return <>Error...</>;
		if (!data) return <div className="text-center">No data</div>;
		return (
			<>
				{data.map((ele, index) => (
					<div key={index} className="grid grid-cols-6 grid-rows-5 gap-2 text-nowrap">
						<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5">
							<Link href={`/main/dashboard/${ele.player_username}`}>{ele.player_username}</Link>
							<Text weight="bold" className="text-accent-300 mx-2">
								:
							</Text>
							<Link href={`/main/dashboard/${ele.opponent_username}`}>{ele.opponent_username}</Link>
						</Text>
						<Text as="div" size="2" className="text-dark-50 row-span-5 col-start-3">
							{ele.player_score}
							<Text weight="bold" className="text-accent-300 mx-2">
								:
							</Text>
							{ele.opponent_score}
						</Text>
						<Text className="row-span-5 col-start-4">
							{ele.player_score > ele.opponent_score ? <Badge color="green">Won</Badge> : <Badge color="red">Lost</Badge>}
						</Text>
						<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
							{formatDistanceToNow(Number(ele.game_date), { addSuffix: true })}
						</Text>
					</div>
				))}
			</>
		);
	}, [data, error, isLoading]);

	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8 px-6">
			<Flex justify="between" align="center" gap="4" mb="4">
				<div className="flex mb-1 mt-2">
					<SvgClockArrow size={24} className="text-white mr-4" />
					<Text as="div" size="5" weight="bold">
						Ping Pong History
					</Text>
				</div>
				<Link href={`/main/ponghistory/${username}`}>
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
			<div className="grid grid-cols-6 grid-rows-5 gap-2 text-sm">
				<Text size="2" className="text-dark-200 col-span-2 row-span-5">
					PLAYERS
				</Text>
				<Text size="2" className="text-dark-200 row-span-5 col-start-3">
					SCORE
				</Text>
				<Text size="2" className="text-dark-200 row-span-5 col-start-4">
					RESULT
				</Text>
				<Text size="2" className="text-dark-200 col-span-2 row-span-5 col-start-5">
					DATE
				</Text>
			</div>
			{content()}
		</div>
	);
};

export default PongHistory;
