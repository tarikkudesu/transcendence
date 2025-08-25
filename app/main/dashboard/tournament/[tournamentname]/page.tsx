import TournamentDetails from '@/app/_components/dash/tournament/TournamentDetails';
import { notFound } from 'next/navigation';
import React from 'react';

const Tournament: React.FC<{ params: Promise<{ tournamentname: string }> }> = async ({ params }) => {
	const { tournamentname } = await params;
	if (!tournamentname) notFound();
	return (
		<div className="mx-auto max-w-[1400px] ">
			<TournamentDetails name={decodeURIComponent(tournamentname)} />
		</div>
	);
};

export default Tournament;
