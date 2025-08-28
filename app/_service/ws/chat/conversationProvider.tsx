'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { Badge } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { conversationContext } from './conversationContext';
import { Message } from './schemas';

interface ConversationProviderProps {
	children: React.ReactNode;
	friend: string;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_CONVERSATION_URL;

const ConversationProvider: React.FC<ConversationProviderProps> = ({ children, friend }) => {
	const { notify } = useNotification();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	// * Data Holders
	const [conversation, setConversation] = useState<Message[]>([]);

	const send = useCallback(
		(message: string) => {
			if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
			else notify({ message: "Conversation connection hasn't been established", error: true });
		},
		[notify]
	);

	const onerror = useCallback(() => {
		setOpen(false);
		setClose(true);
		setError(true);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onclose = useCallback((event: any) => {
		console.log(`Conversation WebSocket connection closed: ${event?.reason ?? ''}`);
		setOpen(false);
		setClose(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const json: Message[] = JSON.parse(e.data);
				setConversation(json as Message[]);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				notify({ message: err.message, error: true });
			}
		},
		[notify]
	);

	const onopen = useCallback(() => {
		console.log('Conversation WebSocket connection opened');
		setOpen(true);
	}, []);

	useEffect(
		function () {
			if (socketRef.current?.OPEN) return;
			try {
				console.log('creating Conversation WebSocket connection ' + API_BASE + friend);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE + friend);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else setError(true);
			} catch (err: unknown) {
				console.log('Error creating Conversation WebSocket connection:', err);
				setError(true);
			}
		},
		[error, close]
	);

	useEffect(() => {
		return () => socketRef.current?.close();
	}, []);

	function content() {
		if (error)
			return (
				<Badge color="red" variant="soft" radius="full" className="fixed top-12 right-4">
					Conversation: Error {friend}
				</Badge>
			);
		if (close)
			return (
				<Badge color="yellow" variant="soft" radius="full" className="fixed top-12 right-4">
					Conversation: Closed {friend}
				</Badge>
			);
		if (open)
			return (
				<Badge color="jade" variant="soft" radius="full" className="fixed top-12 right-4">
					Conversation: Open {friend}
				</Badge>
			);
		return (
			<Badge color="red" variant="soft" radius="full" className="fixed top-12 right-4">
				Conversation: Disconnected {friend}
			</Badge>
		);
	}

	return (
		<conversationContext.Provider value={{ error, close, open, conversation, send }}>
			{children}
			{content()}
		</conversationContext.Provider>
	);
};

export default ConversationProvider;
