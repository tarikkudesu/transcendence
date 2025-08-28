'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { Badge } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Main from './index';
import { pongContext } from './pongContext';

interface PongProviderProps {
	children: React.ReactNode;
	gid: string;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_PONG_URL;

const PongProvider: React.FC<PongProviderProps> = ({ children, gid }) => {
	const { notify } = useNotification();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	const [won, setWon] = useState<boolean>(false);
	const [lost, setLost] = useState<boolean>(false);
	const [disconnected, setDisonnected] = useState<boolean>(false);

	const [pong, setPong] = useState<Main.ClientPong | null>(null);

	const reset = useCallback(() => {
		setPong(null);
	}, []);

	const parse = useCallback(
		(event: string, message: string) => {
			switch (event) {
				case 'PONG': {
					const p: Main.ClientPong = Main.Json({ message, target: Main.ClientPong.instance });
					setPong(p);
					break;
				}
				case 'LOST': {
					setLost(true);
					break;
				}
				case 'WON': {
					setWon(true);
					break;
				}
				case 'ERROR': {
					const r: Main.WSError = Main.Json({ message, target: Main.WSError.instance });
					notify({ message: r.message, error: true });
					break;
				}
				default:
					break;
			}
		},
		[notify]
	);

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
		setDisonnected(true);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onclose = useCallback((event: any) => {
		console.log(`Doom WebSocket connection closed: ${event?.reason ?? ''}`);
		setOpen(false);
		setClose(true);
		setDisonnected(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const m: Main.Message = Main.Json({ message: e.data, target: Main.Message.instance });
				parse(m.message, m.data);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				notify({ message: err.message, error: true });
			}
		},
		[notify, parse]
	);

	const onopen = useCallback(() => {
		console.log('Doom WebSocket connection opened');
		setOpen(true);
	}, []);

	useEffect(() => {
		return () => {
			socketRef.current?.close();
		};
	}, [reset]);

	useEffect(
		function () {
			if (socketRef.current?.OPEN) return;
			reset();
			try {
				console.log('creating Doom WebSocket connection ' + API_BASE + gid);
				if (API_BASE) {
					socketRef.current = new WebSocket(`${API_BASE}${gid}`);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else setError(true);
			} catch (err: unknown) {
				console.log('Error creating Doom WebSocket connection:', err);
				setError(true);
			}
		},
		[error, close, gid]
	);

	function content() {
		if (error)
			return (
				<Badge color="red" variant="soft" radius="full" className="fixed top-12 z-100 right-4">
					Pong: Error
				</Badge>
			);
		if (close)
			return (
				<Badge color="yellow" variant="soft" radius="full" className="fixed top-12 z-100 right-4">
					Pong: Closed
				</Badge>
			);
		if (open)
			return (
				<Badge color="jade" variant="soft" radius="full" className="fixed top-12 z-100 right-4">
					Pong: Open
				</Badge>
			);
		return (
			<Badge color="red" variant="soft" radius="full" className="fixed top-12 z-100 right-4">
				Pong: Disconnected
			</Badge>
		);
	}

	return (
		<pongContext.Provider value={{ won, lost, disconnected, send, pong, gid, open }}>
			{children}
			{content()}
		</pongContext.Provider>
	);
};

export default PongProvider;
