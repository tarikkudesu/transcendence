'use client';

import { useAuth } from '@/app/_service/AuthContext';
import { ChatMessage } from '@/app/_service/ws/chat/composer';
import { useConversationSocket } from '@/app/_service/ws/chat/conversationContext';
import { SvgChat, SvgEmojis } from '@/app/_svg/svg';
import { Box, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import User from '../game/User';
import { ChatMyMessage, ChatOtherMessage } from './ChatMessage';
import EmojiList from './EmojiList';

export const EmptyConversation: React.FC = () => {
	return (
		<div className="h-full flex flex-col justify-between items-center">
			<div className="p-4 h-[80px] bg-dark-700 border-b-[1px] border-dark-500 w-full flex gap-4 justify-start items-center">
			</div>
			<div className="flex-grow w-full bg-dark-950">
				<div
					className="overflow-y-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
					style={{ height: 660 }}
				>
					<Text as="div" align="center" className="h-full flex justify-center items-center">
						You&apos;re Not texting any one
					</Text>
				</div>
			</div>
			<div className="h-[60px] bg-dark-700  border-t-[1px] border-dark-500 w-full flex justify-between items-center relative">
				<div
					role="button"
					className="h-[36px] w-[36px] bg-dark-600 hover:bg-accent-300 rounded-md ml-4 text-dark-300 flex justify-center items-center hover:text-black duration-150"
				>
					<SvgEmojis size={20} className="translate-x-0.5 translate-y-0.5" />
				</div>
				<div className="mx-2 rounded-md bg-dark-600 flex justify-start items-center flex-grow">
					<input
						type="text"
						name="text"
						maxLength={2000}
						placeholder="Search Conversations..."
						className="w-full outline-none px-3 pb-2 pt-3 text-sm text-white bg-dark-600 rounded-md"
					></input>
				</div>
				<div
					role="button"
					className="h-[36px] w-[36px] bg-dark-600 hover:bg-accent-300 rounded-md mr-4 text-dark-300 flex justify-center items-center hover:text-black duration-150"
				>
					<SvgChat size={18} />
				</div>
			</div>
		</div>
	);
};

interface ChatConversationProps {
	chatemate?: string;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ chatemate }) => {
	const [active, setActive] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const { conversation, send, open } = useConversationSocket();
	const inputRef = useRef<HTMLInputElement>(null);
	const endRef = useRef<HTMLDivElement>(null);
	const { username } = useAuth();

	const appendEmoji = useCallback(
		(e: string) => {
			if (chatemate) setMessage(`${message}${e}`);
		},
		[message, chatemate]
	);

	const sendMessage = useCallback(() => {
		if (message && chatemate) {
			send(ChatMessage(message));
			setMessage('');
		}
	}, [message, chatemate, send]);

	const handleEnter = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.code === 'Enter' || e.code === 'NumpadEnter') sendMessage();
		},
		[sendMessage]
	);

	useEffect(() => {
		inputRef?.current?.focus();
	}, [inputRef]);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [conversation]);

	if (!open) return <EmptyConversation />;

	return (
		<div className="h-full flex flex-col justify-between items-center">
			<div className="p-4 h-[80px] bg-dark-700 border-b-[1px] border-dark-500 w-full flex gap-4 justify-start items-center">
				{chatemate && <User username={chatemate} />}
			</div>
			<div className="flex-grow w-full bg-dark-950">
				<div
					className="overflow-y-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
					style={{ height: 660 }}
				>
					{!chatemate && (
						<Text as="div" align="center" className="h-full flex justify-center items-center">
							You&apos;re Not texting any one
						</Text>
					)}
					{chatemate && conversation.length < 11 && <Box height={`${56 * (11 - conversation.length)}px`} />}
					{chatemate &&
						conversation.map((ele, index) => {
							return (
								<div key={index}>
									{ele.sender === username ? <ChatMyMessage data={ele} /> : <ChatOtherMessage data={ele} />}
								</div>
							);
						})}
					<div ref={endRef} />
				</div>
			</div>
			<div className="h-[60px] bg-dark-700  border-t-[1px] border-dark-500 w-full flex justify-between items-center relative">
				{active && chatemate && (
					<>
						<div className="fixed top-0 left-0 right-0 bottom-0" onClick={() => setActive(false)}></div>
						<EmojiList set={appendEmoji} />
					</>
				)}
				<div
					role="button"
					onClick={() => setActive((stat) => !stat)}
					className="h-[36px] w-[36px] bg-dark-600 hover:bg-accent-300 rounded-md ml-4 text-dark-300 flex justify-center items-center hover:text-black duration-150"
				>
					<SvgEmojis size={20} className="translate-x-0.5 translate-y-0.5" />
				</div>
				<div className="mx-2 rounded-md bg-dark-600 flex justify-start items-center flex-grow">
					<input
						type="text"
						name="text"
						ref={inputRef}
						value={message}
						maxLength={2000}
						onKeyDown={handleEnter}
						placeholder="Search Conversations..."
						onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
						className="w-full outline-none px-3 pb-2 pt-3 text-sm text-white bg-dark-600 rounded-md"
					></input>
				</div>
				<div
					role="button"
					className="h-[36px] w-[36px] bg-dark-600 hover:bg-accent-300 rounded-md mr-4 text-dark-300 flex justify-center items-center hover:text-black duration-150"
					onClick={sendMessage}
				>
					<SvgChat size={18} />
				</div>
			</div>
		</div>
	);
};

export default ChatConversation;
