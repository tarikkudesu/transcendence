import TournamentDetails from '@/app/_components/dash/tournament/TournamentDetails';
import { baseMetadata, mainAppMetadata } from '@/app/_service/consts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

type Props = {
	params: Promise<{ tournamentname: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { tournamentname } = await params;
	if (!tournamentname) return { ...baseMetadata };
	return {
		...baseMetadata,
		...mainAppMetadata.specificTournament(tournamentname),
	};
}

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
