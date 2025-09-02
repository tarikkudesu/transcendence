'use client';

import { useGameSocket } from '@/app/_service/ws/game';
import { Box, Flex, Text, Tooltip } from '@radix-ui/themes';
import React, { useCallback } from 'react';
import { User } from '../game/User';

const CurrentStrikes: React.FC = ({}) => {
	const { tournament } = useGameSocket();

	const content = useCallback(() => {
		if (tournament.state !== 'playing')
			return (
				<Text size="4" as="div" align="center" className="text-dark-200">
					Tournament has yet to start
				</Text>
			);
		return (
			<Flex align="end" justify="center" gap="4">
				{tournament.results.map((ele, index) => (
					<Tooltip content={ele.username} key={index}>
						<Flex align="center" direction="column" gap="2">
							<User.Avatar username={ele.username} />
							<Box height={`${(ele.level + 1) * 20}px`} width="20px" className="rounded-full bg-accent-300"></Box>
							<Text weight="bold" size="4">
								{ele.level}
							</Text>
						</Flex>
					</Tooltip>
				))}
			</Flex>
		);
	}, [tournament.results, tournament.state]);
	
	return (
		<div className="my-[80px]">
			<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
				Current Strike
			</Text>
			<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
				Follow players on hot winning streaks and see who’s dominating the tournament right now.
			</Text>
			<div className="p-4 rounded-md bg-dark-950">{content()}</div>
		</div>
	);
};

export default CurrentStrikes;
