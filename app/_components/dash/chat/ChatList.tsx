'use client';

import { useChatSocket } from '@/app/_service/ws/chat/chatContext';
import { OuterMessage } from '@/app/_service/ws/chat/schemas';
import { Box, ScrollArea, Text } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import ChatConversation from './ChatConversation';
import ChatEntry from './ChatEntry';

const ChatList: React.FC = ({}) => {
	const [currentBox, setCurrentBox] = useState<string>('');
	const [search, setSearch] = useState<string>('');
	const searchParams = useSearchParams();
	const { panel } = useChatSocket();

	useEffect(() => {
		const chat = searchParams.get('chatsearch');
		if (chat) setSearch(chat);
	}, [searchParams]);

	const filterPanel = useCallback(
		(mate: OuterMessage): boolean => {
			if (!search) return true;
			return mate.lastMessage.sender.toLowerCase().includes(search.toLowerCase());
		},
		[search]
	);

	const setActive = useCallback((a: string) => setCurrentBox(a), []);

	return (
		<>
			<div className="row-span-5 py-6 shadow-lg bg-dark-700 border-r-[1px] border-dark-500 h-full select-none">
				<Text as="div" my="4" size="4" weight="bold" className="mx-6">
					Messages
				</Text>
				<div className="rounded-md bg-dark-700 flex justify-start items-center my-1 mx-3 relative">
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
						className="w-full outline-none pr-3 pb-2 pt-2.5 pl-10 text-sm text-white rounded-md bg-transparent"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
						type="text"
						name="text"
					></input>
				</div>
				<Box height="20px" />
				<ScrollArea type="always" scrollbars="vertical" style={{ height: 654 }}>
					{panel.length === 0 && (
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
						panel
							.filter(filterPanel)
							.sort((a, b) => a.lastMessage.date.localeCompare(b.lastMessage.date))
							.map((ele, index) => (
								<div key={index}>
									<ChatEntry data={ele} active={currentBox === ele.friend} setActive={setActive} />
								</div>
							))}
				</ScrollArea>
			</div>
			<div className="row-span-5 h-full min-w-[300px]">
				<ChatConversation chatmate={currentBox} />
			</div>
		</>
	);
};

export default ChatList;
