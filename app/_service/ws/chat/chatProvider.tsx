'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { Badge } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { chatContext } from './chatContext';
import { Message, OuterMessage } from './schemas';

interface ChatProviderProps {
	children: React.ReactNode;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_CHAT_URL;

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
	const { notify } = useNotification();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	// * Data Holders
	const [panel, setPanel] = useState<OuterMessage[]>([]);

	const lastMessage = useCallback(
		(u: string): Message | undefined => {
			return panel.find((ele) => ele.friend === u)?.lastMessage;
		},
		[panel]
	);

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
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				notify({ message: err.message, error: true });
			}
		},
		[notify]
	);

	const onopen = useCallback(() => {
		console.log('Chat WebSocket connection opened');
		setOpen(true);
	}, []);

	useEffect(
		function () {
			if (socketRef.current?.OPEN) return;
			try {
				console.log('creating Chat WebSocket connection ' + API_BASE);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else setError(true);
			} catch (err: unknown) {
				console.log('Error creating Chat WebSocket connection:', err);
				setError(true);
			}
		},
		[error, close, open]
	);

	useEffect(() => {
		return () => socketRef.current?.close();
	}, []);

	function content() {
		if (error)
			return (
				<Badge color="red" variant="soft" radius="full" className="fixed top-28 right-4">
					Chat: Error
				</Badge>
			);
		if (close)
			return (
				<Badge color="yellow" variant="soft" radius="full" className="fixed top-28 right-4">
					Chat: Closed
				</Badge>
			);
		if (open)
			return (
				<Badge color="jade" variant="soft" radius="full" className="fixed top-28 right-4">
					Chat: Open
				</Badge>
			);
		return (
			<Badge color="red" variant="soft" radius="full" className="fixed top-28 right-4">
				Chat: Disconnected
			</Badge>
		);
	}

	return (
		<chatContext.Provider value={{ error, close, open, panel, lastMessage }}>
			{children}
			{content()}
		</chatContext.Provider>
	);
};

export default ChatProvider;
