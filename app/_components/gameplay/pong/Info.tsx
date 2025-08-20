import React from 'react';
import { Text } from '@radix-ui/themes';

const GameInfo: React.FC<{ player: string; opponent: string }> = ({ player, opponent }) => {
	return (
		<>
			<div className="grid grid-cols-3 gap-[12px] p-[28px] bg-dark-700 w-[500px] mx-auto my-6 rounded-md">
				<Text as="div" align="center" size="3" className="text-accent-300 font-bold">
					{player}
				</Text>
				<Text as="div" align="center" size="3" className="font-bold">
					VS
				</Text>
				<Text as="div" align="center" size="3" className="text-accent-300 font-bold">
					{opponent}
				</Text>
			</div>
			<Text as="div" align="center" size="2" className="text-dark-300">
				First to 7 wins
			</Text>
		</>
	);
};

export default GameInfo;
