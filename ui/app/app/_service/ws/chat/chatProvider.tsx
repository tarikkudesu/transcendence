'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import { chatContext } from './chatContext';
import { Message, OuterMessage } from '../../schema';

interface ChatProviderProps {
	children: React.ReactNode;
}

if (process.env.NODE_ENV === 'production') console.log = () => {};
const API_BASE = process.env.NEXT_PUBLIC_WS_CHAT_URL;

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
	const { notify } = useNotification();
	const { intercept } = useWebsocketInterceptor();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [panel, setPanel] = useState<OuterMessage[]>([]);

	const lastMessage = useCallback((u: string): Message | undefined => panel.find((ele) => ele.friend === u)?.lastMessage, [panel]);

	const onopen = useCallback(() => {
		console.log('Chat WebSocket connection opened');
	}, []);

	const onerror = useCallback(() => {
		setError(true);
	}, []);

	const onclose = useCallback((event: CloseEvent) => {
		console.log(`Chat WebSocket connection closed: ${event?.reason ?? ''}`);
		setError(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const json: OuterMessage[] = JSON.parse(e.data);
				setPanel(
					(json as OuterMessage[]).sort((a, b) => {
						const dateA = new Date(Number(a.lastMessage.date));
						const dateB = new Date(Number(b.lastMessage.date));
						return dateB.getTime() - dateA.getTime();
					})
				);
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
				console.log('creating Chat WebSocket connection ' + API_BASE);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else throw new Error('API_BASE not defined');
			} catch (err: unknown) {
				console.log('Error creating Chat WebSocket connection:', err);
			}
		} else {
			notify({ message: 'Something went wrong, Please refresh the page', error: true });
		}
	}, [intercept, onmessage, onerror, onclose, onopen, notify]);

	useEffect(() => {
		initiateConnection();
		return () => socketRef.current?.close();
	}, [initiateConnection]);

	return (
		<chatContext.Provider value={{ panel, lastMessage }}>
			{error && (
				<div className="fixed top-0 left-4 right-4 rounded-b-md bg-red-500 px-6 py-1 text-white z-50 font-bold">
					You have been disconnected, Please refresh the page
				</div>
			)}
			{children}
		</chatContext.Provider>
	);
};

export default ChatProvider;
