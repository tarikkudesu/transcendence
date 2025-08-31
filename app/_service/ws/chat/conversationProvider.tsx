'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import { conversationContext } from './conversationContext';
import { Message } from './schemas';

interface ConversationProviderProps {
	children: React.ReactNode;
	friend: string;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_CONVERSATION_URL;

const ConversationProvider: React.FC<ConversationProviderProps> = ({ children, friend }) => {
	const { notify } = useNotification();
	const { intercept } = useWebsocketInterceptor();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(true);

	// * Data Holders
	const [conversation, setConversation] = useState<Message[]>([]);

	const send = useCallback((message: string) => {
		if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
	}, []);

	const onopen = useCallback(() => {
		console.log('Conversation WebSocket connection opened');
		setOpen(true);
	}, []);

	const onerror = useCallback(() => {
		console.log(`Conversation WebSocket connection gave an error`);
		setOpen(false);
		setClose(true);
		setError(true);
	}, []);

	const onclose = useCallback((event: CloseEvent) => {
		console.log(`Conversation WebSocket connection closed: ${event?.reason ?? ''}`);
		setOpen(false);
		setClose(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const json: Message[] = JSON.parse(e.data);
				setConversation(json as Message[]);
			} catch (err: unknown) {
				if (err instanceof Error) notify({ message: err.message, error: true });
				else notify({ message: 'message error, game socket', error: true });
			}
		},
		[notify]
	);

	const initiateConnection = useCallback(async () => {
		const result = await intercept();
		if (result === 'success') {
			socketRef.current?.close();
			try {
				console.log('creating Conversation WebSocket connection ' + API_BASE + friend);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE + friend);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else throw new Error('API_BASE not defined');
			} catch (err: unknown) {
				console.log('Error creating Conversation WebSocket connection:', err);
			}
		} else {
			notify({ message: 'Something went wrong, Please refresh the page', error: true });
		}
	}, [error, close]);

	useEffect(() => {
		initiateConnection();
		return () => socketRef.current?.close();
	}, [initiateConnection]);

	return (
		<conversationContext.Provider value={{ conversation, send }}>
			{!open && (
				<div className="fixed top-0 left-4 right-4 rounded-b-md bg-red-500 px-6 py-1  text-white z-50 font-bold">
					You are not connected, Please refresh the page
				</div>
			)}
			{children}
		</conversationContext.Provider>
	);
};

export default ConversationProvider;
