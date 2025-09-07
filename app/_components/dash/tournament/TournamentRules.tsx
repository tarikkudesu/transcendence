import { Text } from '@radix-ui/themes';
import React from 'react';

const TournamentRules: React.FC = ({}) => {
	return (
		<div className="mt-[60px]">
			<Text
				mt="4"
				as="div"
				size="3"
				weight="bold"
				align="center"
				className="text-accent-300 p-2 rounded-tr-md rounded-tl-md bg-accent-300/10"
			>
				About The Tournament
			</Text>
			<Text as="div" size="3" mb="2" className="text-dark-200 p-6 rounded-br-md rounded-bl-md bg-dark-700 mb-8 shadow-xl">
				The tournament takes place every 2 days and features 4 available slots for participants. You’ll receive a notification as
				soon as registration opens, and if you register, we’ll notify you again when the tournament starts and when it’s your turn
				to play. During the event, you can follow live updates on ongoing strikes and matches, keeping you connected to all the
				action. Once the tournament concludes, the next tournament date will be announced so you can prepare for your next chance to
				compete.
			</Text>
		</div>
	);
};

export default TournamentRules;
