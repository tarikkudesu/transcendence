'use client';

import { TournamentDetailsType } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import { Box, Flex, Text, Tooltip } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import LoadingIndicator from '../../mini/Loading';
import { User } from '../game/User';

const TournamentDetails: React.FC<{
	name: string;
}> = ({ name }) => {
	const { isLoading, error, data: details } = useGET<TournamentDetailsType>({ url: `/game/tournament/${name}` });

	if (isLoading) return <LoadingIndicator />;
	if (error || !details) return <>Error...</>;

	return (
		<>
			<div className="px-[10%] py-[40px] mb-[10px] mt-[80px] rounded-md">
				<Text as="div" align="center" size="9" mb="2" weight="bold" className="text-accent-300">
					{name}
				</Text>
			</div>
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
				<div className="my-[80px]">
					<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
						Contestants
					</Text>
					<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
						See all contestants in the tournament along with their level. Get a quick overview of who’s competing and how far
						each player has advanced.
					</Text>
					<div className="p-4 rounded-md bg-dark-950">
						<Flex align="end" justify="center" gap="4">
							{details.Contestants.map((ele, index) => (
								<Tooltip content={ele.username} key={index}>
									<Flex align="center" direction="column" gap="2">
										<User.Avatar username={ele.username} />
										<Box height={`${ele.round_level * 20}px`} width="20px" className="rounded-full bg-accent-300"></Box>
										<Text weight="bold" size="4">
											{ele.round_level}
										</Text>
									</Flex>
								</Tooltip>
							))}
						</Flex>
					</div>
				</div>
				<div className="my-[80px]">
					<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
						Match History
					</Text>
					<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
						Browse the full match history of the tournament with results, scores, and highlights from each game.
					</Text>
					<div className="p-4 rounded-md bg-dark-950">
						<div className="grid grid-cols-6 grid-rows-5 gap-2 text-sm">
							<Text size="2" className="text-dark-200 col-span-2 row-span-5">
								PLAYERS
							</Text>
							<Text size="2" className="text-dark-200 row-span-5 col-start-3">
								SCORE
							</Text>
							<Text size="2" className="text-dark-200 row-span-5 col-start-4">
								WINNER
							</Text>
							<Text size="2" className="text-dark-200 col-span-2 row-span-5 col-start-5">
								DATE
							</Text>
						</div>
						{details.matches.map((ele, index) => (
							<div key={index} className="grid grid-cols-6 grid-rows-5 gap-2 text-nowrap">
								<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5">
									<User.Username username={ele.user} className="text-white" />
									<Text weight="bold" className="text-accent-300 mx-2">
										:
									</Text>
									<User.Username username={ele.opponent} className="text-white" />
								</Text>
								<Text as="div" size="2" className="text-dark-50 row-span-5 col-start-3">
									{ele.player_score}
									<Text weight="bold" className="text-accent-300 mx-2">
										:
									</Text>
									{ele.opponent_score}
								</Text>
								<Text className="row-span-5 col-start-4">
									{ele.player_score > ele.opponent_score ? (
										<User.Username username={ele.user} className="text-white" />
									) : (
										<User.Username username={ele.opponent} className="text-white" />
									)}
								</Text>
								<Text as="div" size="2" className="text-dark-50 col-span-2 row-span-5 col-start-5">
									{formatDistanceToNow(Number(ele.date), { addSuffix: true })}
								</Text>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default TournamentDetails;
