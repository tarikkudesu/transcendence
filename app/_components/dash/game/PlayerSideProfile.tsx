'use client';
import { RequestResult } from '@/app/_service/auth/calls';
import { getUser } from '@/app/_service/user/calls';
import { UserProfile } from '@/app/_service/user/schema';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge, Button, Spinner, Text } from '@radix-ui/themes';
import { ClientPlayer, InviteMessage, useGameSocket } from '@/app/_service/ws/game';

interface ChallengeButtonProps {
	game: 'pong' | 'card of doom';
	pooler: ClientPlayer;
	className: string;
}

const ChallengeButton: React.FC<ChallengeButtonProps> = ({ pooler, className, game }) => {
	const { send } = useGameSocket();

	if (pooler.inviteStatus === 'unsent')
		return (
			<Button
				className={className}
				disabled={pooler?.inviteStatus !== 'unsent'}
				onClick={() => send(InviteMessage(game, pooler?.username))}
			>
				{game} challenge
			</Button>
		);
	if (game !== pooler?.game)
		return (
			<Button className={className} disabled>
				{game} challenge
			</Button>
		);
	else if (pooler?.inviteStatus === 'pending')
		return (
			<Button className={className} loading>
				{game} challenge
			</Button>
		);
	else if (pooler?.inviteStatus === 'declined')
		return (
			<Button className={className} disabled>
				{game} challenge
			</Button>
		);
};

const PlayerSideProfile: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hydrated, setHydrated] = useState<boolean>(false);
	const [isError, setError] = useState<boolean>(false);
	const [username, setUsername] = useState<string>('');
	const router = useRouter();
	const searchParams = useSearchParams();
	const { pool } = useGameSocket();
	const [pooler, setPooler] = useState<ClientPlayer | null>(null);
	const [player, setPlayer] = useState<UserProfile | null>(null);

	useEffect(() => {
		const profile = searchParams.get('profile');
		if (profile) setUsername(profile);
		setHydrated(true);
	}, [searchParams]);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				const res: RequestResult = await getUser(username);
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
		if (hydrated && username) fetchData();
	}, [hydrated, username]);

	useEffect(() => {
		if (player) {
			const temp = pool.find((ele) => ele.username === player.username);
			if (temp) setPooler(temp);
		}
	}, [player, pool]);

	const inviteStatus = useCallback((): React.ReactNode => {
		if (pooler?.inviteStatus === 'pending')
			return (
				<Badge size="1" color="blue" radius="full">
					{pooler?.inviteStatus}
				</Badge>
			);
		else if (pooler?.inviteStatus === 'declined')
			return (
				<Badge size="1" color="red" radius="full">
					{pooler?.inviteStatus}
				</Badge>
			);
		else if (pooler?.inviteStatus === 'accepted')
			return (
				<Badge size="1" color="green" radius="full">
					{pooler?.inviteStatus}
				</Badge>
			);
	}, [pooler?.inviteStatus]);

	const reset = useCallback(() => {
		setPlayer(null);
		setPooler(null);
		setUsername('');
		setError(false);
		setIsLoading(false);
		const params = new URLSearchParams(searchParams.toString());
		params.delete('profile');
		router.push(`?${params.toString()}`);
	}, [router, searchParams]);

	if (isLoading) return <Spinner />;

	if (isError || !username || !player) {
		return <></>;
	}

	return (
		<div className="my-8 w-[40%] shadow-lg">
			<div className="p-4 rounded-md bg-dark-700 relative">
				<button className="absolute top-4 right-4 p-1 text-dark-200 hover:text-accent-300 cursor-pointer" onClick={reset}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={24} width={24}>
						<path
							fill="currentColor"
							d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"
						/>
					</svg>
				</button>
				<Image
					draggable={false}
					priority
					className="mt-[40px] mb-[20px] mx-auto rounded-full cursor-pointer border-4 border-accent-300"
					src={player.avatar}
					alt="player card"
					width={120}
					height={120}
				></Image>
				<Text as="div" align="center" size="4" weight="bold" className="text-white mb-2">
					{player.username} {inviteStatus()}
				</Text>
				<Text as="div" align="center" size="2" className="text-dark-200">
					{player.bio}
				</Text>
				<Text as="div" align="center" size="2" className="text-dark-200">
					Joined {player.created_at.slice(0, 10)}
				</Text>

				<div className="flex justify-center items-center gap-4 my-[20px]">
					{pooler ? (
						<>
							<ChallengeButton
								pooler={pooler}
								game="pong"
								className="py-3 px-4 text-center bg-accent-300 disabled:bg-dark-600 text-xs text-black disabled:text-white rounded-sm cursor-pointer font-bold"
							/>
							<ChallengeButton
								pooler={pooler}
								game="card of doom"
								className="py-3 px-4 text-center bg-orange-500 disabled:bg-dark-600 text-xs text-white rounded-sm cursor-pointer font-bold"
							/>
						</>
					) : (
						<>
							{' '}
							<Button
								className="py-3 px-4 text-center bg-accent-300 disabled:bg-dark-600 text-xs text-black disabled:text-white rounded-sm cursor-pointer font-bold"
								disabled
							>
								pong challenge
							</Button>
							<Button
								className="py-3 px-4 text-center bg-orange-500 disabled:bg-dark-600 text-xs text-white rounded-sm cursor-pointer font-bold"
								disabled
							>
								doom challenge
							</Button>
						</>
					)}
				</div>
				{/* <button className="py-3 px-4 text-center bg-accent-300 text-xs text-black rounded-sm cursor-pointer font-bold">Message</button> */}
			</div>
		</div>
	);
};

export default PlayerSideProfile;
