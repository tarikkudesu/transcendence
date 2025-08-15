'use client';

import { useAuth } from '@/app/_service/AuthContext';
import { Message } from '@/app/_service/ws/chat/schemas';
import { ScrollArea, Text } from '@radix-ui/themes';
import Image from 'next/image';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import UserCallout from '../game/UserCallout';
import { ChatMyMessage, ChatOtherMessage } from './ChatMessage';
import { useChatSocket } from '@/app/_service/ws/chat/chatContext';
import { ChatMessage } from '@/app/_service/ws/chat/composer';
import { useSearchParams } from 'next/navigation';

const ChatConversation: React.FC = () => {
	const chatScroller = useRef<HTMLDivElement | null>(null);
	const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);
	const [pendMessage, setPendMessage] = useState<string[]>([]);
	const [mateAvatar, setMateAvatar] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const { conversation, send } = useChatSocket();
	const [mate, setMate] = useState<string>('');
	const { username: myusername } = useAuth();
	const searchParams = useSearchParams();

	useEffect(() => {
		const m = searchParams.get('chatmate');
		const a = searchParams.get('chatmateavatar');
		if (m && a) {
			setMate(m);
			setMateAvatar(a);
		}
	}, [searchParams]);

	const updateScroll = useCallback(() => {
		setScrollToBottom((state) => !state);
	}, []);

	const sendMessage = useCallback(() => {
		if (message && mate) {
			send(ChatMessage('NEWMESSAGE', { to: '', message }));
			setPendMessage([...pendMessage, message]);
			setMessage('');
			updateScroll();
		}
	}, [message, mate]);

	useEffect(() => {
		if (chatScroller && chatScroller.current) chatScroller.current.scrollTop = chatScroller.current.scrollHeight;
	}, [chatScroller, scrollToBottom]);

	return (
		<div className="h-full flex flex-col justify-between items-center">
			<div className="p-4 h-[80px] bg-dark-700 border-b-[1px] border-dark-500 w-full flex gap-4 justify-start items-center">
				<UserCallout username={myusername}>
					<Image
						priority
						className={`rounded-full cursor-pointer bg-accent-300`}
						src={mateAvatar ? mateAvatar : '/ChatAvatar.png'}
						alt="player card"
						width={46}
						height={46}
					></Image>
				</UserCallout>
				<div className="">
					<Text as="div" size="3" weight="bold" className="text-white">
						{mate ? mate : 'Unknown'}
					</Text>
					{/* <Text as="div" className={'text-xs ' + (playing ? 'text-orange-500' : 'text-accent-300')}>
						{playing ? 'Playing' : 'Online'}
					</Text> */}
				</div>
			</div>
			<div className="flex-grow w-full bg-dark-950">
				<ScrollArea type="always" scrollbars="vertical" style={{ height: 660 }} ref={chatScroller}>
					{(!mate || !mateAvatar) && (
						<Text as="div" align="center" className="h-full flex justify-center items-center">
							You&apos;re Not texting any one
						</Text>
					)}
					{mate &&
						mateAvatar &&
						conversation.map((ele, index) => {
							return (
								<div key={index}>
									{ele.sender === myusername ? <ChatMyMessage data={ele} /> : <ChatOtherMessage data={ele} />}
								</div>
							);
						})}
					{pendMessage.length !== 0 && (
						<>
							<Text as="div" align="center" size="1" className="my-1 text-dark-200">
								Pending Message
							</Text>
							{pendMessage.map((ele, index) => {
								return (
									<div key={index}>
										<ChatMyMessage data={{ message: ele, date: 'pending', sender: myusername }} />
									</div>
								);
							})}
						</>
					)}
				</ScrollArea>
			</div>
			<div className="h-[60px] bg-dark-700  border-t-[1px] border-dark-500 w-full flex justify-between items-center">
				<div className="mx-2 rounded-md bg-dark-600 flex justify-start items-center flex-grow">
					<input
						required
						maxLength={40}
						value={message}
						placeholder="Search Conversations..."
						className="w-full outline-none px-3 pb-2 pt-3 text-sm text-white bg-dark-600 rounded-md"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
						type="text"
						name="text"
					></input>
				</div>
				<div
					role="button"
					className="h-[36px] w-[36px] bg-dark-600 hover:bg-accent-300 rounded-md mr-2 text-dark-300 flex justify-center items-center hover:text-white"
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
