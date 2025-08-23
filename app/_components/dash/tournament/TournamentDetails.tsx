'use client';

import { TournamentDetailsType } from '@/app/_service/game/schemas';
import { useGET } from '@/app/_service/useFetcher';
import React from 'react';
import LoadingIndicator from '../../mini/Loading';

interface TournamentDetailsProps {
	name: string;
}

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ name }) => {
	const { isLoading, error, data: details } = useGET<TournamentDetailsType>({ url: `${API_BASE}/game/tournament/${name}` });

	if (isLoading) return <LoadingIndicator />;
	if (error || !details) return <>Error...</>;

	return <div>{JSON.stringify(details)}</div>;
};

export default TournamentDetails;
