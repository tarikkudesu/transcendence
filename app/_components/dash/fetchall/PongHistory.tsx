'use client';

import { PongHistoryEntry } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { SvgSpinner } from '@/app/_svg/svg';
import { Badge, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useCallback } from 'react';

import { formatDistanceToNow } from 'date-fns';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const PongHistory: React.FC<{ username: string }> = ({ username }) => {
	const { data, error, isLoading } = useGET<PongHistoryEntry[]>({ url: `${API_BASE}/game/pong/history/${username}` });

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
		<div className="bg-dark-950 p-8 rounded-md">
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
