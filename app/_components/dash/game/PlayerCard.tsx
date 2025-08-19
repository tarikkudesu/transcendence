'use client';
import { RequestResult } from '@/app/_service/auth/calls';
import { getUser } from '@/app/_service/user/calls';
import { UserProfile } from '@/app/_service/user/schema';
import { ClientPlayer } from '@/app/_service/ws/game/schema';
import { Spinner } from '@radix-ui/themes';

import SafeImage from '@/app/_components/SafeImage';
import React, { useEffect, useState } from 'react';
import UserCallout from './UserCallout';

interface PlayerCardProps {
	pooler: ClientPlayer;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ pooler }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);
	const [player, setPlayer] = useState<UserProfile | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await getUser(pooler.username);
				if (res.message === 'success') {
					setPlayer(res.result);
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
	}, [pooler.username]);

	if (isLoading) return <Spinner />;

	if (isError || !player) return <></>;

	return (
		<>
			<UserCallout username={player.username}>
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					className={`rounded-full cursor-pointer border-2 ${
						pooler.playerStatus === 'free' ? 'border-accent-300' : 'border-magenta-500'
					}`}
					src={player.avatar}
					alt="player card"
					width={42}
					height={42}
				></SafeImage>
			</UserCallout>
		</>
	);
};

export default PlayerCard;
