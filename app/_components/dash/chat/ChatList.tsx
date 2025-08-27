'use client';

import { useFriends } from '@/app/_service/friends/FriendContext';
import { Friend } from '@/app/_service/schema';
import { useChatSocket } from '@/app/_service/ws/chat/chatContext';
import ConversationProvider from '@/app/_service/ws/chat/conversationProvider';
import { OuterMessage } from '@/app/_service/ws/chat/schemas';
import { Box, ScrollArea, Text } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import SafeImage from '../../mini/SafeImage';
import ChatConversation, { EmptyConversation } from './ChatConversation';
import ChatEntry from './ChatEntry';

const ChatList: React.FC = ({}) => {
	const { panel } = useChatSocket();
	const searchParams = useSearchParams();
	const { friend: getFriend } = useFriends();
	const [box, setBox] = useState<[username: string, avatar: string]>(['', '']);
	const [search, setSearch] = useState<string>('');

	useEffect(() => {
		const chat = searchParams.get('chatemate');
		if (chat) {
			const friend: Friend | null = getFriend(chat);
			if (friend) setBox([friend.username, friend.avatar_url]);
		}
	}, [getFriend, searchParams]);

	const filterPanel = useCallback(
		(mate: OuterMessage): boolean => {
			if (!search) return true;
			return mate.friend.toLowerCase().includes(search.toLowerCase());
		},
		[search]
	);

	const setActive = useCallback((u: string, a: string) => setBox([u, a]), []);

	return (
		<>
			<SafeImage
				fill
				fallbackSrc=""
				draggable={false}
				alt="cover image"
				src="/chatback.png"
				className="opacity-25"
				style={{ objectFit: 'cover', objectPosition: 'right' }}
			/>
			<div className="row-span-5 py-6 shadow-lg bg-accent-900/10 border-r-[1px] border-accent-700 h-full select-none relative">
				<Text as="div" my="4" size="4" weight="bold" className="mx-6">
					Messages
				</Text>
				<div className="flex justify-start items-center my-1 mx-3 relative">
					<SafeImage
						src="/search.png"
						fallbackSrc=""
						alt="cover image"
						fill
						className="opacity-50 -z-10"
						style={{ objectFit: 'contain', objectPosition: 'right' }}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 640"
						height={20}
						width={20}
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
						className="w-full outline-none pr-3 pb-2 pt-2.5 pl-10 text-sm text-white rounded-md bg-transparent relative"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
						type="text"
						name="text"
					></input>
				</div>
				<Box height="20px" />
				<ScrollArea type="auto" scrollbars="vertical" style={{ height: 654 }}>
					{panel.filter(filterPanel).length === 0 && (
						<Text as="div" align="center" className="h-full flex justify-center items-center">
							You have no active chats
						</Text>
					)}
					{search && panel.filter(filterPanel).length === 0 && (
						<Text as="div" align="center" className="h-full flex justify-center items-center">
							No search results
						</Text>
					)}
					{panel.length !== 0 &&
						panel.filter(filterPanel).map((ele: OuterMessage, index: number) => (
							<div key={index}>
								<ChatEntry data={ele} active={box[0] === ele.friend} setActive={setActive} />
							</div>
						))}
				</ScrollArea>
			</div>
			<div className="row-span-5 h-full min-w-[300px] relative">
				{box && box[0] && box[1] ? (
					<ConversationProvider friend={box[0]}>
						<ChatConversation chatemate={box[0]} avatar={box[1]} />
					</ConversationProvider>
				) : (
					<EmptyConversation />
				)}
			</div>
		</>
	);
};

export default ChatList;
