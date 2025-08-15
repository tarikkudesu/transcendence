'use client';

import { RequestResult } from '@/app/_service/auth/calls';
import { fetchTournament } from '@/app/_service/game/calls';
import { TournamentDetailsType } from '@/app/_service/game/schemas';
import { Spinner } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

interface TournamentDetailsProps {
	name: string;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ name }) => {
	const [isError, setError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [details, setDetails] = useState<TournamentDetailsType | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await fetchTournament(name);
				if (res.message === 'success') {
					setDetails(res.result);
				} else {
					setError(true);
				}
			} catch (err) {
				void err;
				setError(true);
			}
			setIsLoading(false);
		}
		fetchData();
	}, [name]);

	if (isLoading) return <Spinner />;
	if (isError || !details) return <>Error Page</>;
	return <div>{JSON.stringify(details)}</div>;
};

export default TournamentDetails;
