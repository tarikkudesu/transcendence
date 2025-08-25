'use client';

import { useGameSocket } from '@/app/_service/ws/game';
import { Text } from '@radix-ui/themes';
import React, { useCallback } from 'react';
import { User } from '../game/User';

const CurrentMatches: React.FC = ({}) => {
	const { tournament } = useGameSocket();

	const content = useCallback(() => {
		if (tournament.state !== 'playing')
			return (
				<Text size="4" as="div" align="center" className="text-dark-200">
					Tournament has yet to start
				</Text>
			);
		return (
			<>
				<Text as="div" align="center" size="7" my="8" weight="bold">
					ROUND <span className="text-accent-300">#{tournament.round}</span>
				</Text>
				{tournament.nextMatches.map((ele, index) => (
					<div key={index} className="my-2 flex justify-center">
						<User.Username className="text-white" username={ele.player} />
						<Text weight="bold" className="text-accent-300 mx-2">
							:
						</Text>
						<User.Username className="text-white" username={ele.opponent} />
					</div>
				))}
			</>
		);
	}, [tournament.nextMatches, tournament.round, tournament.state]);

	return (
		<div className="my-[80px]">
			<Text as="div" align="center" size="7" mb="2" weight="bold" className="text-accent-300">
				Current Matches
			</Text>
			<Text as="div" size="3" mb="8" align="center" className="text-dark-200">
				Watch ongoing tournament games in real time and track their progress from start to finish.
			</Text>
			<div className="p-4 rounded-md bg-dark-950">{content()}</div>
		</div>
	);
};

export default CurrentMatches;
// const content = useCallback(() => {
// 	return (
// 		<>
// 			<Text as="div" align="center" size="7" mt="8" mb="4" weight="bold">
// 				ROUND <span className="text-accent-300">#4</span>
// 			</Text>
// 			<div className="my-2 flex justify-center">
// 				<User.Username className='text-white' username="Najia" />
// 				<Text weight="bold" className="text-accent-300 mx-2">
// 					:
// 				</Text>
// 				<User.Username className='text-white' username="Najia" />
// 			</div>
// 			<div className="my-2 flex justify-center">
// 				<User.Username className='text-white' username="Najia" />
// 				<Text weight="bold" className="text-accent-300 mx-2">
// 					:
// 				</Text>
// 				<User.Username className='text-white' username="Najia" />
// 			</div>
// 			<div className="my-2 flex justify-center">
// 				<User.Username className='text-white' username="Najia" />
// 				<Text weight="bold" className="text-accent-300 mx-2">
// 					:
// 				</Text>
// 				<User.Username className='text-white' username="Najia" />
// 			</div>
// 			<div className="my-2 flex justify-center">
// 				<User.Username className='text-white' username="Najia" />
// 				<Text weight="bold" className="text-accent-300 mx-2">
// 					:
// 				</Text>
// 				<User.Username className='text-white' username="Najia" />
// 			</div>
// 		</>
// 	);
// }, []);
