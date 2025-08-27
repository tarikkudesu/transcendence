'use client';

import { useFriends } from '@/app/_service/friends/FriendContext';
import { Friend } from '@/app/_service/schema';
import { useGameSocket } from '@/app/_service/ws/game';
import { Text } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { User } from './User';

const OnlinePlayers: React.FC = ({}) => {
	const [search, setSearch] = useState<string>('');
	const searchParams = useSearchParams();
	const { online } = useGameSocket();
	const { friends } = useFriends();

	useEffect(() => {
		const player = searchParams.get('playersearch');
		if (player) setSearch(player);
	}, [searchParams]);

	const filterPool = useCallback(
		(player: Friend): boolean => {
			if (player.stat !== 'accepted') return false;
			if (!search) return true;
			return player.username.toLowerCase().includes(search.toLowerCase());
		},
		[search]
	);

	return (
		<div className="flex-grow p-6 rounded-md bg-dark-700 my-8 shadow-lg">
			<div className="flex mb-1 mt-6">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={24} width={24} className="text-white mr-4">
					<path
						fill="currentColor"
						d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"
					/>
				</svg>
				<Text as="div" size="5" weight="bold">
					Players
				</Text>
			</div>
			<Text as="div" size="3" mb="2" className="text-dark-200">
				Browse a live list of players currently online, ready to join matches or challenges.
			</Text>
			<div className="relative mt-4 mb-8 bg-dark-950 border border-accent-300 rounded-md">
				<svg
					width={20}
					height={20}
					viewBox="0 0 640 640"
					xmlns="http://www.w3.org/2000/svg"
					className="text-dark-200 mx-3 absolute top-1/2 left-0 -translate-y-1/2"
				>
					<path
						fill="currentColor"
						d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"
					/>
				</svg>
				<input
					required
					maxLength={40}
					value={search}
					autoComplete="off"
					placeholder="Search..."
					className="w-full outline-none pr-3 pb-2 pt-2.5 pl-10 text-sm text-white rounded-md bg-transparent"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
					type="text"
					name="text"
				/>
			</div>

			{friends.filter(filterPool).map((player) => (
				<div key={player.username} className="p-1 hover:bg-dark-800 rounded-md">
					<User.Dialog username={player.username}>
						<User.Trigger
							username={player.username}
							avatar={player.avatar_url}
							extra={
								online(player.username) === 'free' ? (
									<Text as="div" size="1" className="font-medium text-accent-300">
										Online
									</Text>
								) : online(player.username) === 'playing' ? (
									<Text as="div" size="1" className="font-medium text-orange-600">
										Playing
									</Text>
								) : (
									<Text as="div" size="1" className="font-medium text-dark-300">
										Offline
									</Text>
								)
							}
						/>
					</User.Dialog>
				</div>
			))}
			{search && friends.filter(filterPool).length === 0 && (
				<Text as="div" align="center" className="text-dark-200">
					No Player Found
				</Text>
			)}
		</div>
	);
};

export default OnlinePlayers;
