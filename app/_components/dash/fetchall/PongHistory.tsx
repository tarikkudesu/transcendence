'use client';

import client from '@/app/_service/axios/client';
import { PongHistoryEntry } from '@/app/_service/schema';
import { Badge, Box, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import Error from '../../mini/Error';
import { Spinner } from '../../mini/Loading';

const PongHistory: React.FC<{ username: string; page: number }> = ({ username, page }) => {
	const router = useRouter();
	const fetchData = (): Promise<PongHistoryEntry[]> =>
		client.get(`/game/pong/history/${username}?begin=${page * 20}&end=${20}`).then((response) => response.data);
	const { data, error, isPending } = useQuery({
		queryKey: [`gameponghistory${username}all`],
		queryFn: fetchData,
	});

	const changePage = useCallback(
		(back: boolean) => {
			if (back) {
				if (page > 0) router.push(`/ponghistory/${username}/${page - 1}`);
			} else {
				if (data?.length === 20) router.push(`/ponghistory/${username}/${page + 1}`);
			}
		},
		[data?.length, page, router, username]
	);

	if (isPending) return <Spinner />;
	if (error || !data) return <Error />;

	return (
		<>
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
				{data.map((ele: PongHistoryEntry, index: number) => (
					<div key={index} className="grid grid-cols-6 grid-rows-5 gap-2 text-nowrap">
						<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5">
							<Link href={`/dashboard/profile/${ele.player_username}`}>{ele.player_username}</Link>
							<Text weight="bold" className="text-accent-300 mx-2">
								:
							</Text>
							<Link href={`/dashboard/profile/${ele.opponent_username}`}>{ele.opponent_username}</Link>
						</Text>
						<Text as="div" size="2" className="text-dark-50 row-span-5 col-start-3">
							{ele.player_score}
							<Text weight="bold" className="text-accent-300 mx-2">
								:
							</Text>
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
							{formatDistanceToNow(Number(ele.game_date), { addSuffix: true })}
						</Text>
					</div>
				))}
			</div>
			<Box height="24px" />
			<div className="flex justify-between items-center">
				<PongButton onClick={() => changePage(true)} className="bg-dark-800 text-dark-200 hover:text-white">
					Previous
				</PongButton>
				<div className="text-white">{page}</div>
				<PongButton onClick={() => changePage(false)} className="bg-dark-800 text-dark-200 hover:text-white">
					Next
				</PongButton>
			</div>
		</>
	);
};

export default PongHistory;
