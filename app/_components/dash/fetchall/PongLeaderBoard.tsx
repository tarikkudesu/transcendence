'use client';

import { LeaderboardEntry } from '@/app/_service/schema';
import { useGET } from '@/app/_service/useFetcher';
import { Text } from '@radix-ui/themes';
import { Spinner } from '../../mini/Loading';
import { User } from '../game/User';

const PongLeaderBoard: React.FC = ({}) => {
	const { isLoading, data: leaderBoard } = useGET<LeaderboardEntry[]>({ url: `/game/pong/leaderboard` });
	if (isLoading) return <Spinner />;
	return (
		<>
			{leaderBoard &&
				leaderBoard.map((ele, index) => (
					<div key={index} className="bg-dark-950 rounded-md px-[10%] py-[40px] m-8">
						<div className="flex justify-between items-center">
							<div className="flex justify-start gap-4">
								<div className="h-[42px] w-[42px] rounded-full bg-dark-500 flex justify-center items-center text-xl font-black">
									<div className="translate-y-0.5">{index + 1}</div>
								</div>
								<User.Trigger
									username={ele.username}
									avatar={ele.avatar_url}
									extra={
										<Text as="div" size="2" weight="bold" className="text-dark-300">
											RANK #{index + 1}
										</Text>
									}
								></User.Trigger>
							</div>
							<div className="">
								<Text align="right" as="div" size="8" weight="bold" className="text-accent-300">
									{ele.winns}
								</Text>
								<Text align="right" as="div" size="2" weight="bold" className="text-dark-300">
									winns
								</Text>
							</div>
						</div>
					</div>
				))}
		</>
	);
};

export default PongLeaderBoard;
