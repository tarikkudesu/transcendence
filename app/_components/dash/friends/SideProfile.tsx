'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:80/api/v1';

const User: React.FC<{ username: string; reset: () => void }> = ({ username, reset }) => {
	return <></>;
	// const { pool } = useGameSocket();
	// const [pooler, setPooler] = useState<ClientPlayer | undefined>(undefined);
	// const { data: check, fetchData } = useMutate<CheckResponse, FriendRequest>();
	// const { data: user, isLoading, error } = useGET<UserProfile>({ url: `${API_BASE}/users/${username}` });

	// useEffect(() => {
	// 	setPooler(_.find(pool, (o: ClientPlayer) => o.username === username));
	// }, [pool]);

	// if (isLoading)
	// 	return (
	// 		<div className="min-h-[200px] shadow-lg my-8 p-4 rounded-md bg-dark-700 relative">
	// 			<LoadingIndicator />
	// 		</div>
	// 	);

	// if (!user || !check || error || check.state === 'blocked') return <></>;

	// return (
	// <div className="min-h-[200px] shadow-lg my-8 p-8 pt-12 rounded-md bg-dark-700 relative">
	// 	<div className="flex justify-end items-center gap-[12px]">
	// 		<svg
	// 			width={20}
	// 			height={20}
	// 			onClick={reset}
	// 			viewBox="0 0 640 640"
	// 			xmlns="http://www.w3.org/2000/svg"
	// 			className="text-dark-200 hover:text-accent-300 cursor-pointer"
	// 		>
	// 			<path
	// 				fill="currentColor"
	// 				d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"
	// 			/>
	// 		</svg>
	// 	</div>
	// 	<div className="flex gap-[16px] items-center">
	// 		<SafeImage
	// 			priority
	// 			alt="player card"
	// 			fallbackSrc="/Logo.png"
	// 			width={78}
	// 			height={78}
	// 			src={user.avatar}
	// 			className="rounded-full border-[3px] border-dark-400"
	// 		></SafeImage>
	// 		<Text as="div" size="5" weight="bold" className="text-accent-300">
	// 			{username}{' '}
	// 			{check === 'pending' && (
	// 				<Badge size="1" color="blue" radius="full" className="px-4">
	// 					Pending friend Request
	// 				</Badge>
	// 			)}
	// 			<Text as="div" size="2" className="text-dark-200">
	// 				{pooler ? (pooler.playerStatus === 'playing' ? 'Playing' : 'Online') : 'Offline'}
	// 			</Text>
	// 			<Text as="div" size="1" className="text-dark-400">
	// 				Joined {user.created_at.slice(0, 10)}
	// 			</Text>
	// 		</Text>
	// 	</div>
	// 	<Text as="div" size="4" className="text-dark-200 my-4">
	// 		{user.bio}
	// 	</Text>
	// 	{check !== 'none' && check !== 'pending' && pooler && (
	// 		<>
	// 			<ChallangePong pooler={pooler} />
	// 			<Box height="12px" />
	// 			<ChallangeDoom pooler={pooler} />
	// 			<Box height="12px" />
	// 			<ChatButton username={username} />
	// 		</>
	// 	)}
	// 	{check === 'none' && <AddButton username={username} refresh={refresh} />}
	// </div>
	// );
};

const SideProfile: React.FC = () => {
	const [username, setUsername] = useState<string>('');
	const searchParams = useSearchParams();

	const router = useRouter();

	const reset = useCallback(() => {
		setUsername('');
		const params = new URLSearchParams(searchParams.toString());
		params.delete('profile');
		router.push(`?${params.toString()}`);
	}, [router, searchParams]);

	useEffect(() => {
		const profile = searchParams.get('profile');
		if (profile) setUsername(profile);
	}, [searchParams]);

	return <User username={username} reset={reset} />;
};

export default SideProfile;

// const inviteStatus = useCallback((): React.ReactNode => {
// 	if (pooler?.inviteStatus === 'pending')
// 		return (
// 			<Badge size="1" color="blue" radius="full">
// 				{pooler?.inviteStatus}
// 			</Badge>
// 		);
// 	else if (pooler?.inviteStatus === 'declined')
// 		return (
// 			<Badge size="1" color="red" radius="full">
// 				{pooler?.inviteStatus}
// 			</Badge>
// 		);
// 	else if (pooler?.inviteStatus === 'accepted')
// 		return (
// 			<Badge size="1" color="green" radius="full">
// 				{pooler?.inviteStatus}
// 			</Badge>
// 		);
// }, [pooler?.inviteStatus]);
