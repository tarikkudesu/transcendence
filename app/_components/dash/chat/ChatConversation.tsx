'use client';

import { useAuth } from '@/app/_service/AuthContext';
import { useChatSocket } from '@/app/_service/ws/chat/chatContext';
import { ChatMessage } from '@/app/_service/ws/chat/composer';
import { Box, Text } from '@radix-ui/themes';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import User from '../game/User';
import { ChatMyMessage, ChatOtherMessage } from './ChatMessage';
import EmojiList from './EmojiList';

interface ChatConversationProps {
	chatmate?: string;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ chatmate }) => {
	const [active, setActive] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const { conversation, send } = useChatSocket();
	const endRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { username } = useAuth();

	const appendEmoji = useCallback(
		(e: string) => {
			if (chatmate) setMessage(`${message}${e}`);
		},
		[message, chatmate]
	);

	const sendMessage = useCallback(() => {
		if (message && chatmate) {
			send(ChatMessage('NEWMESSAGE', { to: chatmate, message }));
			setMessage('');
		}
	}, [message, chatmate, send]);

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

	return (
		<div className="h-full flex flex-col justify-between items-center">
			<div className="p-4 h-[80px] bg-dark-700 border-b-[1px] border-dark-500 w-full flex gap-4 justify-start items-center">
				{chatmate && <User username={chatmate} />}
			</div>
			<div className="flex-grow w-full bg-dark-950">
				<div
					className="overflow-y-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
					style={{ height: 660 }}
				>
					{!chatmate && (
						<Text as="div" align="center" className="h-full flex justify-center items-center">
							You&apos;re Not texting any one
						</Text>
					)}
					{chatmate && conversation.length < 11 && <Box height={`${56 * (11 - conversation.length)}px`} />}
					{chatmate &&
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
				{active && chatmate && (
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
					<svg
						width={20}
						height={20}
						viewBox="0 0 640 640"
						xmlns="http://www.w3.org/2000/svg"
						className="translate-x-0.5 translate-y-0.5"
					>
						<path
							fill="currentColor"
							d="M174.9 272c10.7 0 20.7 5.3 26.6 14.2l11.8 17.8 26.7 0c26.5 0 48 21.5 48 48l0 112c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 352c0-26.5 21.5-48 48-48l26.7 0 11.8-17.8c5.9-8.9 15.9-14.2 26.6-14.2l61.7 0zm278.6-12c5.6-4.9 13.9-5.3 19.9-.9s8.3 12.4 5.3 19.3L440.3 368 496 368c6.7 0 12.6 4.1 15 10.4s.6 13.3-4.4 17.7l-128 112c-5.6 4.9-13.9 5.3-19.9 .9s-8.3-12.4-5.3-19.3l38.5-89.7-55.8 0c-6.7 0-12.6-4.1-15-10.4s-.6-13.3 4.4-17.7l128-112zM144 360a48 48 0 1 0 0 96 48 48 0 1 0 0-96zM483.8 .4c6.5-1.1 13.1 .4 18.5 4.4 6.1 4.5 9.7 11.7 9.7 19.2l0 152-.3 4.9c-3.3 24.2-30.5 43.1-63.7 43.1-35.3 0-64-21.5-64-48s28.7-48 64-48c5.5 0 10.9 .6 16 1.6l0-49.3-112 33.6 0 110.2-.3 4.9c-3.3 24.2-30.5 43.1-63.7 43.1-35.3 0-64-21.5-64-48s28.7-48 64-48c5.5 0 10.9 .6 16 1.6L304 72c0-10.6 7-20 17.1-23l160-48 2.7-.6zM188.9 0C226 0 256 30 256 67.1l0 6.1c0 56.1-75.2 112.1-110.3 135.3-10.8 7.1-24.6 7.1-35.4 0-35.1-23.1-110.3-79.2-110.3-135.3l0-6.1C0 30 30 0 67.1 0 88.2 0 108 9.9 120.7 26.8l7.3 9.8 7.3-9.8C148 9.9 167.8 0 188.9 0z"
						/>
					</svg>
				</div>
				<div className="mx-2 rounded-md bg-dark-600 flex justify-start items-center flex-grow">
					<input
						type="text"
						name="text"
						ref={inputRef}
						maxLength={2000}
						value={message}
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
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={18} width={18}>
						<path
							fill="currentColor"
							d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default ChatConversation;
