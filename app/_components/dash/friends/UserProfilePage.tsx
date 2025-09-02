'use client';

import client from '@/app/_service/axios/client';
import { useFriends } from '@/app/_service/friends/FriendContext';
import { useAcceptFriendCall, useAddFriendCall, useBlockFriendCall, useDeclineFriendCall } from '@/app/_service/friends/Mutaters';
import { Friend, FriendRequest, UserProfile } from '@/app/_service/schema';
import { ClientPlayer, InviteMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgAddFriend, SvgBan, SvgChat, SvgDoom, SvgInfo, SvgPong } from '@/app/_svg/svg';
import { Callout, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { Spinner } from '../../mini/Loading';
import SafeImage from '../../mini/SafeImage';

const AddFriend: React.FC<{ username: string }> = ({ username }) => {
	const { isLoading, addCall } = useAddFriendCall();

	return (
		<PongButton
			loading={isLoading}
			onClick={() => addCall({ to: username })}
			className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
		>
			<SvgAddFriend size={24} />
		</PongButton>
	);
};
const AcceptFriend: React.FC<{ username: string }> = ({ username }) => {
	const { isLoading, acceptCall } = useAcceptFriendCall();

	return (
		<PongButton
			loading={isLoading}
			onClick={() => acceptCall({ to: username })}
			className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
		>
			Accept
		</PongButton>
	);
};
const DeclineFriend: React.FC<{ username: string }> = ({ username }) => {
	const { isLoading, declineCall } = useDeclineFriendCall();

	return (
		<PongButton
			loading={isLoading}
			onClick={() => declineCall({ to: username })}
			className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
		>
			Remove
		</PongButton>
	);
};
const BlockFriend: React.FC<{ username: string }> = ({ username }) => {
	const { isLoading, blockCall } = useBlockFriendCall();

	return (
		<PongButton
			loading={isLoading}
			onClick={() => blockCall({ to: username })}
			className="bg-dark-700 w-full hover:bg-red-600 hover:text-white"
		>
			<SvgBan size={24} />
		</PongButton>
	);
};

const UserProfilePage: React.FC<{ username: string }> = ({ username }) => {
	const router = useRouter();
	const { pooler: getPooler, send } = useGameSocket();
	const { request: getRequest, friend: getFriend } = useFriends();

	const fetchData = (): Promise<UserProfile> => client.get(`/users/${username}`).then((response) => response.data);
	const {
		data: user,
		error,
		isPending,
	} = useQuery({
		queryKey: [`users${username}`],
		queryFn: fetchData,
	});

	const pooler: ClientPlayer | undefined = getPooler(username);
	const request: FriendRequest | null = getRequest(username);
	const friend: Friend | null = getFriend(username);

	const Node = useCallback((): React.ReactNode => {
		if (isPending) return <Spinner />;
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
						className={`rounded-full cursor-pointer border-4 aspect-square object-cover ${friend && pooler ? 'border-accent-300' : 'border-dark-400'}`}
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
					{!friend && <AddFriend username={username} />}
					{request && request.stat === 'pending' && (
						<>
							<AcceptFriend username={username} />
							<DeclineFriend username={username} />
						</>
					)}
					{friend && friend.stat === 'accepted' && (
						<>
							<PongButton
								onClick={() => router.push(`/chat?chatemate=${friend.username}`)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								<SvgChat size={24} />
							</PongButton>
							<BlockFriend username={username} />
						</>
					)}
					{friend && friend.stat === 'accepted' && pooler && (
						<>
							<PongButton
								onClick={() => send(InviteMessage('pong', username))}
								disabled={
									pooler.playerStatus !== 'free' ||
									pooler.inviteStatus === 'pending' ||
									pooler.inviteStatus === 'declined'
								}
								loading={pooler.inviteStatus === 'pending' && pooler.game === 'pong'}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black disabled:text-white disabled:bg-dark-700"
							>
								<SvgPong size={24} />
							</PongButton>
							<PongButton
								onClick={() => send(InviteMessage('card of doom', username))}
								disabled={
									pooler.playerStatus !== 'free' ||
									pooler.inviteStatus === 'pending' ||
									pooler.inviteStatus === 'declined'
								}
								loading={pooler.inviteStatus === 'pending' && pooler.game === 'card of doom'}
								className="bg-dark-700 w-full hover:bg-orange-600 hover:text-black disabled:text-white disabled:bg-dark-700"
							>
								<SvgDoom size={24} />
							</PongButton>
						</>
					)}
				</div>
			</>
		);
	}, [error, friend, isPending, pooler, request, router, send, user, username]);

	return <div className="bg-dark-950 rounded-md shadow-xl my-8">{Node()}</div>;
};

export default UserProfilePage;
