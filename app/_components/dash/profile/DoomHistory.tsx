'use client';

import { DoomHistoryEntry } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { SvgClockArrow, SvgMore, SvgSpinner } from '@/app/_svg/svg';
import { Badge, Flex, Text } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useCallback } from 'react';
import { User } from '../game/User';

const DoomHistory: React.FC<{ username: string }> = ({ username }) => {
	const { data, error, isLoading } = useGET<DoomHistoryEntry[]>({ url: `/game/doom/history/${username}?end=10` });

	const content = useCallback(() => {
		if (isLoading) return <SvgSpinner size={24} />;
		if (error) return <>Error...</>;
		if (!data) return <div className="text-center">No data...</div>;

		return (
			<>
				{data.map((ele, index) => (
					<div key={index} className="grid grid-cols-6 grid-rows-5 gap-[8px] text-nowrap">
						<Text as="div" size="2" className="text-dark-50 col-span-3 row-span-5">
							<User.Username className="text-white" username={ele.player_username} />
							<Text weight="bold" className="text-accent-300 mx-2">
								:
							</Text>
							<User.Username className="text-white" username={ele.opponent_username} />
						</Text>
						<Text className="row-span-5 col-start-4">
							{ele.player_username === ele.winner_username ? (
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
			</>
		);
	}, [isLoading, error, data]);

	return (
		<div className="flex-grow p-4 rounded-md bg-dark-700 my-8 px-6">
			<Flex justify="between" align="center" gap="4" mb="4">
				<div className="flex mb-1 mt-2">
					<SvgClockArrow size={24} className="text-white mr-4" />
					<Text as="div" size="5" weight="bold">
						Doom Cards History
					</Text>
				</div>
				<Link href={`/main/doomhistory/${username}`}>
					<SvgMore size={24} className="text-dark-200 hover:text-accent-300" />
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

export default DoomHistory;
