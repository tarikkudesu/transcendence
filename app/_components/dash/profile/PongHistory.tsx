'use client';

import client from '@/app/_service/axios/client';
import { PongHistoryEntry } from '@/app/_service/schema';
import { SvgClockArrow, SvgMore } from '@/app/_svg/svg';
import { Badge, Flex, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Spinner } from '../../mini/Loading';
import { formatDate } from '../chat/ChatMessage';
import { User } from '../game/User';
import { useCallback } from 'react';
import Error from '../../mini/Error';

const PongHistory: React.FC<{ username: string }> = ({ username }) => {
	const fetchData = (): Promise<PongHistoryEntry[]> =>
		client.get(`/game/pong/history/${username}?begin=0&end=${20}`).then((response) => response.data);
	const { data, error, isPending } = useQuery({
		queryKey: [`gameponghistory${username}`],
		queryFn: fetchData,
	});

	const Node = useCallback(() => {
		if (isPending) return <Spinner />;
		if (error || !data) return <Error />;
		return (
			<>
				{data.map((ele, index) => (
					<div key={index} className="grid grid-cols-6 grid-rows-5 gap-2 text-nowrap">
						<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5">
							<User.Username className="text-white" username={ele.player_username} />
							<span className="font-bold text-accent-300 mx-2">:</span>
							<User.Username className="text-white" username={ele.opponent_username} />
						</Text>
						<Text as="div" size="2" className="text-dark-50 row-span-5 col-start-3">
							{ele.player_score}
							<span className="font-bold text-accent-300 mx-2">:</span>
							{ele.opponent_score}
						</Text>
						<Text className="row-span-5 col-start-4">
							{username === ele.player_username ? (
								ele.player_score > ele.opponent_score ? (
									<Badge color="green">Won</Badge>
								) : (
									<Badge color="red">Lost</Badge>
								)
							) : ele.opponent_score > ele.player_score ? (
								<Badge color="green">Won</Badge>
							) : (
								<Badge color="red">Lost</Badge>
							)}
						</Text>
						<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
							{formatDate(Number(ele.game_date))}
						</Text>
					</div>
				))}
			</>
		);
	}, [data, error, isPending, username]);

	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8 px-6">
			<Flex justify="between" align="center" gap="4" mb="4">
				<div className="flex mb-1 mt-2">
					<SvgClockArrow size={24} className="text-white mr-4" />
					<Text as="div" size="5" weight="bold">
						Ping Pong History
					</Text>
				</div>
				<Link href={`/main/ponghistory/${username}/0`}>
					<SvgMore size={24} className="text-dark-200 hover:text-accent-300" />
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
			{Node()}
		</div>
	);
};

export default PongHistory;
