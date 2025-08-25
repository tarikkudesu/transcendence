'use client';

import { useFriends } from '@/app/_service/friends/FriendContext';
import { Friend, FriendRequest } from '@/app/_service/friends/schema';
import { useGET } from '@/app/_service/useFetcher';
import { UserProfile } from '@/app/_service/user/schema';
import { ClientPlayer, InviteMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgAddFriend, SvgBan, SvgChat, SvgDoom, SvgInfo, SvgPong } from '@/app/_svg/svg';
import { Callout, Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { Spinner } from '../../mini/Loading';
import SafeImage from '../../mini/SafeImage';

const UserProfilePage: React.FC<{ username: string }> = ({ username }) => {
	const { pooler: getPooler, send } = useGameSocket();
	const { request: getRequest, friend: getFriend, addCall, acceptCall, declineCall, blockCall, isLoading: actionLoading } = useFriends();
	const { data: user, error, isLoading } = useGET<UserProfile>({ url: `/users/${username}` });
	const router = useRouter();

	const pooler: ClientPlayer | undefined = getPooler(username);
	const request: FriendRequest | null = getRequest(username);
	const friend: Friend | null = getFriend(username);

	const Node = useCallback((): React.ReactNode => {
		if (isLoading) return <Spinner />;
		if (error || !user) return null;
		return (
			<>
				<div className="flex flex-col items-center justify-center m-8">
					<SafeImage
						priority
						width={200}
						height={200}
						src={user.avatar}
						alt="player card"
						fallbackSrc="/Logo.png"
						className={`rounded-full cursor-pointer border-4 ${
							friend && pooler
								? pooler.playerStatus === 'free'
									? 'border-accent-300'
									: 'border-golden-500'
								: 'border-dark-400'
						}`}
					></SafeImage>
					<Text as="div" size="7" weight="bold" align="center" className="mt-4 text-white font-bold">
						{username}
					</Text>
					<Text as="div" className="text-md text-dark-200 mx-8 my-2 flex justify-start items-center gap-4">
						Joined {format(new Date(Number(user.created_at)), 'MMMM yyyy')}
					</Text>
				</div>
				{user.bio && (
					<>
						<Text as="div" className="text-lg text-accent-300 mx-8 my-2 font-black">
							Bio
						</Text>
						<Text as="div" className="text-md text-dark-200 mx-8 my-2">
							{user.bio}
						</Text>
					</>
				)}
				<div className="flex gap-2 m-8">
					{friend && friend.stat === 'blocked' && (
						<Callout.Root variant="soft" color="red" className="w-full">
							<Callout.Icon>
								<SvgInfo size={24} />
							</Callout.Icon>
							<Callout.Text>This Profile is restricted</Callout.Text>
						</Callout.Root>
					)}
					{!friend && (
						<PongButton
							loading={actionLoading}
							onClick={() => addCall(user.username)}
							className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
						>
							<SvgAddFriend size={24} />
						</PongButton>
					)}
					{request && request.stat === 'pending' && (
						<>
							<PongButton
								loading={actionLoading}
								onClick={() => acceptCall(user.username)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								Accept
							</PongButton>
							<PongButton
								loading={actionLoading}
								onClick={() => declineCall(user.username)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								Remove
							</PongButton>
						</>
					)}
					{friend && friend.stat === 'accepted' && (
						<>
							<PongButton
								onClick={() => router.push(`/main/dashboard/chat?chatemate=${friend.username}`)}
								loading={actionLoading}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								<SvgChat size={24} />
							</PongButton>
							<PongButton
								loading={actionLoading}
								onClick={() => blockCall(user.username)}
								className="bg-dark-700 w-full hover:bg-red-600 hover:text-white"
							>
								<SvgBan size={24} />
							</PongButton>
						</>
					)}
					{friend && friend.stat === 'accepted' && pooler && (
						<>
							<PongButton
								onClick={() => send(InviteMessage('pong', username))}
								disabled={
									pooler.playerStatus === 'playing' ||
									pooler.inviteStatus === 'pending' ||
									pooler.inviteStatus === 'declined'
								}
								loading={actionLoading || pooler.playerStatus === 'playing'}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black disabled:text-white disabled:bg-dark-700"
							>
								<SvgPong size={24} />
							</PongButton>
							<PongButton
								onClick={() => send(InviteMessage('card of doom', username))}
								disabled={
									pooler.playerStatus === 'playing' ||
									pooler.inviteStatus === 'pending' ||
									pooler.inviteStatus === 'declined'
								}
								loading={actionLoading || pooler.playerStatus === 'playing'}
								className="bg-dark-700 w-full hover:bg-golden-500 hover:text-black disabled:text-white disabled:bg-dark-700"
							>
								<SvgDoom size={24} />
							</PongButton>
						</>
					)}
				</div>
			</>
		);
	}, [
		acceptCall,
		actionLoading,
		addCall,
		blockCall,
		declineCall,
		error,
		friend,
		isLoading,
		pooler,
		request,
		router,
		send,
		user,
		username,
	]);

	return <div className="bg-dark-950 rounded-md shadow-xl my-8">{Node()}</div>;
};

export default UserProfilePage;
