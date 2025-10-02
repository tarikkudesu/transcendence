'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import { conversationContext } from './conversationContext';
import { Message } from '../../schema';

interface ConversationProviderProps {
	children: React.ReactNode;
	friend: string;
}

if (process.env.NODE_ENV === 'production') console.log = () => {};
const API_BASE = process.env.NEXT_PUBLIC_WS_CONVERSATION_URL;

const ConversationProvider: React.FC<ConversationProviderProps> = ({ children, friend }) => {
	const { notify } = useNotification();
	const { intercept } = useWebsocketInterceptor();
	const socketRef = useRef<WebSocket | null>(null);
	const [_error, setError] = useState<boolean>(false);

	// * Data Holders
	const [conversation, setConversation] = useState<Message[]>([]);

	const send = useCallback((message: string) => {
		if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
	}, []);

	const onopen = useCallback(() => {
		console.log('Conversation WebSocket connection opened');
	}, []);

	const onerror = useCallback(() => {
		console.log(`Conversation WebSocket connection gave an error`);
		setError(true);
	}, []);

	const onclose = useCallback((event: CloseEvent) => {
		console.log(`Conversation WebSocket connection closed: ${event?.reason ?? ''}`);
		setError(true);
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
	}, [intercept, friend, onmessage, onerror, onclose, onopen, notify]);

	useEffect(() => {
		initiateConnection();
		return () => socketRef.current?.close();
	}, [initiateConnection]);

	return <conversationContext.Provider value={{ conversation, send }}>{children}</conversationContext.Provider>;
};

export default ConversationProvider;
