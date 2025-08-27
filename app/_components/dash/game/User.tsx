import { useFriends } from '@/app/_service/friends/FriendContext';
import { Friend } from '@/app/_service/schema';
import { useGET } from '@/app/_service/useFetcher';
import { useGetUser } from '@/app/_service/user/getUser';
import { UserProfile } from '@/app/_service/schema';
import { ClientPlayer, InviteMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgChat, SvgDoom, SvgPong, SvgProfile } from '@/app/_svg/svg';
import { Badge, Link, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import Error from '../../mini/Error';
import { Spinner } from '../../mini/Loading';
import SafeImage from '../../mini/SafeImage';

const Username: React.FC<{ username: string; className?: string }> = ({ username, className }) => {
	return (
		<Link href={`/main/dashboard/${username}`}>
			<Text className={`${className} hover:text-accent-300`}>{username}</Text>
		</Link>
	);
};
const Avatar: React.FC<{ username: string }> = ({ username }) => {
	const { data } = useGET<UserProfile>({ url: `/users/${username}` });

	if (!data)
		return (
			<SafeImage
				fallbackSrc="/Logo.png"
				priority
				className={`rounded-full cursor-pointer border-2 border-accent-300`}
				src={'/Logo.png'}
				alt="player card"
				width={42}
				height={42}
			></SafeImage>
		);
	return (
		<>
			<Link href={`/main/dashboard/${username}`}>
				<SafeImage
					fallbackSrc="/Logo.png"
					priority
					className={`rounded-full cursor-pointer border-2 border-accent-300`}
					src={data.avatar}
					alt="player card"
					width={42}
					height={42}
				></SafeImage>
			</Link>
		</>
	);
};
const Profile: React.FC<{ username: string }> = ({ username }) => {
	const { data } = useGET<UserProfile>({ url: `/users/${username}` });

	if (!data)
		return (
			<>
				<div className="flex justify-start items-center">
					<SafeImage
						priority
						width={42}
						height={42}
						src={'/Logo.png'}
						alt="player card"
						fallbackSrc="/Logo.png"
						className={'rounded-full cursor-pointer'}
					></SafeImage>
					<Text as="div" className="ml-4 text-md font-bold">
						{username}
					</Text>
				</div>
			</>
		);
	return (
		<>
			<div className="flex justify-start items-center">
				<SafeImage
					priority
					width={42}
					height={42}
					src={data.avatar}
					alt="player card"
					fallbackSrc="/Logo.png"
					className={'rounded-full cursor-pointer'}
				></SafeImage>
				<Text as="div" className="ml-4 text-md font-bold">
					{username}
				</Text>
			</div>
		</>
	);
};
const Trigger: React.FC<{
	username: string;
	avatar: string;
	extra: React.ReactNode;
}> = ({ username, avatar, extra }) => {
	return (
		<>
			<div className="flex justify-start items-center">
				<SafeImage
					priority
					width={42}
					height={42}
					src={avatar}
					alt="player card"
					fallbackSrc="/Logo.png"
					className={'rounded-full cursor-pointer'}
				></SafeImage>
				<Text as="div" className="ml-4 text-md font-bold">
					{username}
					{extra}
				</Text>
			</div>
		</>
	);
};
const Dialog: React.FC<{
	children: React.ReactNode;
	username: string;
}> = ({ username, children }) => {
	const { friend: getFriend } = useFriends();
	const { data: user, error, isLoading } = useGetUser(username);
	const { pooler: getPooler, send } = useGameSocket();
	const [active, setActive] = useState<boolean>();
	const router = useRouter();

	const pooler: ClientPlayer | undefined = getPooler(username);
	const friend: Friend | null = getFriend(username);

	const Node = useCallback((): React.ReactNode => {
		if (isLoading) return <Spinner />;
		if (error || !user) return <Error />;

		return (
			<>
				<div className="flex justify-start items-center">
					<SafeImage
						priority
						width={58}
						height={58}
						src={user.avatar}
						alt="player card"
						fallbackSrc="/Logo.png"
						className={'rounded-full cursor-pointer'}
					></SafeImage>
					<Text as="div" className="ml-4 text-md font-bold">
						{username}
						{pooler && pooler.inviteStatus === 'pending' && (
							<Badge ml="3" radius="full" size="1" color="blue">
								pending
							</Badge>
						)}
						{pooler && pooler.inviteStatus === 'declined' && (
							<Badge ml="3" size="1" radius="full" color="red">
								declined
							</Badge>
						)}
						{pooler && pooler.inviteStatus === 'accepted' && (
							<Badge ml="3" size="1" radius="full" color="green">
								accepted
							</Badge>
						)}

						{friend && pooler ? (
							pooler.playerStatus === 'free' ? (
								<Text as="div" size="1" className="font-medium text-accent-300">
									Online
								</Text>
							) : (
								<Text as="div" size="1" className="font-medium text-orange-600">
									Playing
								</Text>
							)
						) : (
							<Text as="div" size="1" className="font-medium text-dark-300">
								Offline
							</Text>
						)}
					</Text>
				</div>
				<Text as="div" className="text-md text-dark-200 my-4">
					{user.bio}
				</Text>
				<div className="flex my-1 gap-2">
					{friend && friend.stat === 'accepted' && (
						<>
							<PongButton
								onClick={() => router.push(`/main/dashboard/chat?chatemate=${friend.username}`)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black disabled:text-dark-400 disabled:bg-dark-700"
							>
								<SvgChat size={24} />
							</PongButton>
							<PongButton
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black disabled:text-dark-400 disabled:bg-dark-700"
								onClick={() => router.push(`/main/dashboard/${friend.username}`)}
							>
								<SvgProfile size={24} />
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
								loading={pooler.inviteStatus === 'pending' && pooler.game === 'pong'}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black disabled:text-dark-400 disabled:bg-dark-700"
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
								loading={pooler.inviteStatus === 'pending' && pooler.game === 'card of doom'}
								className="bg-dark-700 w-full hover:bg-orange-600 hover:text-black disabled:text-dark-400 disabled:bg-dark-700"
							>
								<SvgDoom size={24} />
							</PongButton>
						</>
					)}
				</div>
			</>
		);
	}, [error, friend, isLoading, pooler, router, send, user, username]);

	return (
		<>
			{active && <div className="fixed inset-0 z-40 bg-dark-800/25" onClick={() => setActive(false)}></div>}
			<span className="flex items-center p-2 cursor-pointer relative" onClick={() => setActive(true)}>
				{children}
				{active && user && (
					<div className="absolute top-0 left-0 p-6 bg-dark-800 rounded-md border border-dark-500 w-[400px] shadow-xl z-50">
						{Node()}
					</div>
				)}
			</span>
		</>
	);
};

export const User = {
	Trigger,
	Dialog,
	Username,
	Profile,
	Avatar,
};
