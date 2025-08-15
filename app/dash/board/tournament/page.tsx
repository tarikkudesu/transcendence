import CurrentMatches from '@/app/_components/dash/tournament/CurrentMatches';
import CurrentStrikes from '@/app/_components/dash/tournament/CurrentStrikes';
import NextTournament from '@/app/_components/dash/tournament/NextTournament';
import TournamentHistory from '@/app/_components/dash/tournament/TournamentHistory';
import TournamentRules from '@/app/_components/dash/tournament/TournamentRules';
import { Grid } from '@radix-ui/themes';
import React from 'react';

const Tournament: React.FC<unknown> = () => {
	return (
		<>
			<Grid columns="2" gap="9">
				<NextTournament />
				<TournamentRules />
				<CurrentStrikes />
				<CurrentMatches />
			</Grid>
			<TournamentHistory />
		</>
	);
};

export default Tournament;
