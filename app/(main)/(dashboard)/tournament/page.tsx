import CurrentMatches from '@/app/_components/dash/tournament/CurrentMatches';
import CurrentStrikes from '@/app/_components/dash/tournament/CurrentStrikes';
import NextTournament from '@/app/_components/dash/tournament/NextTournament';
import TournamentHistory from '@/app/_components/dash/tournament/TournamentHistory';
import TournamentRules from '@/app/_components/dash/tournament/TournamentRules';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
	...baseMetadata,
	...mainAppMetadata.tournament,
};

const Tournament: React.FC<unknown> = () => {
	return (
		<div className="mx-auto max-w-[1400px] ">
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-12">
				<NextTournament />
				<TournamentRules />
				<CurrentStrikes />
				<CurrentMatches />
			</div>
			<TournamentHistory />
		</div>
	);
};

export default Tournament;
