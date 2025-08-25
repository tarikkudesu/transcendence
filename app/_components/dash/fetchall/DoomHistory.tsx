'use client';

import { DoomHistoryEntry } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { Badge, Text } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Spinner } from '../../mini/Loading';

const DoomHistory: React.FC<{ username: string }> = ({ username }) => {
	const { data, isLoading } = useGET<DoomHistoryEntry[]>({ url: `/game/doom/history/${username}` });

	if (isLoading) return <Spinner />;

	return (
		<div className="bg-dark-950 p-8 rounded-md">
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
			{data &&
				data.map((ele, index) => (
					<div key={index} className="grid grid-cols-6 grid-rows-5 gap-[8px] text-nowrap">
						<Text as="div" size="2" className="text-dark-50 col-span-3 row-span-5">
							<Link href={`/main/dashboard/${ele.player_username}`}>{ele.player_username}</Link>
							<Text weight="bold" className="text-accent-300 mx-2">
								:
							</Text>
							<Link href={`/main/dashboard/${ele.opponent_username}`}>{ele.opponent_username}</Link>
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
		</div>
	);
};

export default DoomHistory;
