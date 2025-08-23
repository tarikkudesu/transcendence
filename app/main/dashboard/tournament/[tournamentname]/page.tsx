import TournamentDetails from '@/app/_components/dash/tournament/TournamentDetails';
import { notFound } from 'next/navigation';
import React from 'react';

const Tournament: React.FC<{ params: Promise<{ tournamentname: string }> }> = async ({ params }) => {
	const { tournamentname } = await params;
	if (!tournamentname) notFound();
	return <TournamentDetails name={tournamentname} />;
};

export default Tournament;
