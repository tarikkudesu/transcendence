'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import { chatContext } from './chatContext';
import { Message, OuterMessage } from './schemas';

interface ChatProviderProps {
	children: React.ReactNode;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_CHAT_URL;

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
	const { notify } = useNotification();
	const { intercept } = useWebsocketInterceptor();
	const socketRef = useRef<WebSocket | null>(null);

	const [open, setOpen] = useState<boolean>(true);
	const [close, setClose] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [panel, setPanel] = useState<OuterMessage[]>([]);

	const lastMessage = useCallback((u: string): Message | undefined => panel.find((ele) => ele.friend === u)?.lastMessage, [panel]);

	const onopen = useCallback(() => {
		console.log('Chat WebSocket connection opened');
		setOpen(true);
	}, []);

	const onerror = useCallback(() => {
		setOpen(false);
		setClose(true);
		setError(true);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onclose = useCallback((event: any) => {
		console.log(`Chat WebSocket connection closed: ${event?.reason ?? ''}`);
		setOpen(false);
		setClose(true);
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
	}, [error, close]);

	useEffect(() => {
		initiateConnection();
		return () => socketRef.current?.close();
	}, [initiateConnection]);

	return (
		<chatContext.Provider value={{ panel, lastMessage }}>
			{!open && (
				<div className="fixed top-0 left-4 right-4 rounded-b-md bg-red-500 px-6 py-1  text-white z-50 font-bold">
					You are not connected, Please refresh the page
				</div>
			)}
			{children}
		</chatContext.Provider>
	);
};

export default ChatProvider;
