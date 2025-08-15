import TournamentDetails from '@/app/_components/dash/tournament/TournamentDetails';
import { notFound } from 'next/navigation';
import React from 'react';

const Tournament: React.FC<{ params: { tournamentname: string } }> = ({ params }) => {
	const { tournamentname } = params;
	if (!tournamentname) notFound();
	return <TournamentDetails name={tournamentname} />;
};

export default Tournament;
