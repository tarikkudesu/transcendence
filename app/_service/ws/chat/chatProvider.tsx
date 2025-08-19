'use client';

import { useNotification } from '@/app/_components/useNotify';
import { Badge } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Json } from '../game/common';
import { chatContext } from './chatContext';
import { EventOut, Message, OuterMessage } from './schemas';

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
	const [conversation, setConversation] = useState<Message[]>([]);

	const send = useCallback(
		(message: string) => {
			if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
			else notify({ message: "connection hasn't been established", error: true });
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
		console.log(`Game WebSocket connection closed: ${event?.reason ?? ''}`);
		setOpen(false);
		setClose(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const json: EventOut = Json({ message: e.data, target: new EventOut() });
				if (json.event === 'UNREAD') setPanel(json.content as OuterMessage[]);
				else setConversation(json.content as Message[]);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				notify({ message: err.message, error: true });
			}
		},
		[notify]
	);

	const onopen = useCallback(() => {
		console.log('Game WebSocket connection opened');
		setOpen(true);
	}, []);

	useEffect(
		function () {
			if (socketRef.current && !error && !close) return;
			try {
				console.log('creating Game WebSocket connection ' + API_BASE);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else setError(true);
			} catch (err: unknown) {
				console.log('Error creating Game WebSocket connection:', err);
				setError(true);
			}
		},
		[error, close]
	);

	function content() {
		if (error)
			return (
				<Badge color="red" variant="soft" radius="full" className="absolute top-1 right-1">
					Chat: Error
				</Badge>
			);
		if (close)
			return (
				<Badge color="yellow" variant="soft" radius="full" className="absolute top-1 right-1">
					Chat: Closed
				</Badge>
			);
		if (open)
			return (
				<Badge color="jade" variant="soft" radius="full" className="absolute top-1 right-1">
					Chat: Open
				</Badge>
			);
		return (
			<Badge color="red" variant="soft" radius="full" className="absolute top-1 right-1">
				Chat: Disconnected
			</Badge>
		);
	}

	return (
		<chatContext.Provider value={{ error, close, open, send, panel, conversation }}>
			{children}
			{content()}
		</chatContext.Provider>
	);
};

export default ChatProvider;
