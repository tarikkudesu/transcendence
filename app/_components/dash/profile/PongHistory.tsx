'use client';

import { PongHistoryEntry } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { SvgClockArrow, SvgMore } from '@/app/_svg/svg';
import { Badge, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns';
import { Spinner } from '../../mini/Loading';
import { User } from '../game/User';

const PongHistory: React.FC<{ username: string }> = ({ username }) => {
	const { data, isLoading } = useGET<PongHistoryEntry[]>({ url: `/game/pong/history/${username}?end=10` });

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
			{isLoading && <Spinner />}
			{data && (
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
								{ele.player_score > ele.opponent_score ? <Badge color="green">Won</Badge> : <Badge color="red">Lost</Badge>}
							</Text>
							<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
								{formatDistanceToNow(Number(ele.game_date), { addSuffix: true })}
							</Text>
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default PongHistory;
