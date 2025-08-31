'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import { doomContext } from './doomContext';
import * as Main from './index';

interface DoomProviderProps {
	children: React.ReactNode;
	gid: string;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_DOOM_URL;

const DoomProvider: React.FC<DoomProviderProps> = ({ children, gid }) => {
	const { notify } = useNotification();
	const { intercept } = useWebsocketInterceptor();
	const socketRef = useRef<WebSocket | null>(null);

	const [won, setWon] = useState<boolean>(false);
	const [lost, setLost] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(true);
	const [disconnected, setDisonnected] = useState<boolean>(false);
	const [doom, setDoom] = useState<Main.ClientCardOfDoom | null>(null);

	const reset = useCallback(() => {
		setDoom(null);
	}, []);

	const parse = useCallback(
		(event: string, message: string) => {
			switch (event) {
				case 'DOOM': {
					const d: Main.ClientCardOfDoom = Main.Json({ message, target: Main.ClientCardOfDoom.instance });
					setDoom(d);
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

	const send = useCallback((message: string) => {
		if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
	}, []);

	const onopen = useCallback(() => {
		console.log('Doom WebSocket connection opened');
		setOpen(true);
	}, []);

	const onerror = useCallback(() => {
		console.log(`Doom WebSocket connection gave an error`);
		setDisonnected(true);
	}, []);

	const onclose = useCallback((event: CloseEvent) => {
		console.log(`Doom WebSocket connection closed: ${event?.reason ?? ''}`);
		setDisonnected(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const m: Main.Message = Main.Json({ message: e.data, target: Main.Message.instance });
				parse(m.message, m.data);
			} catch (err: unknown) {
				if (err instanceof Error) notify({ message: err.message, error: true });
				else notify({ message: 'message error, pong socket', error: true });
			}
		},
		[notify, parse]
	);

	useEffect(() => {
		return () => socketRef.current?.close();
	}, [reset]);

	const initiateConnection = useCallback(async () => {
		const result = await intercept();
		if (result === 'success') {
			socketRef.current?.close();
			reset();
			try {
				console.log('creating Pong WebSocket connection ' + API_BASE + gid);
				if (API_BASE) {
					socketRef.current = new WebSocket(`${API_BASE}${gid}`);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else throw new Error('API_BASE not defined');
			} catch (err: unknown) {
				console.log('Error creating Pong WebSocket connection:', err);
			}
		} else {
			notify({ message: 'Something went wrong, Please refresh the page', error: true });
		}
	}, [gid]);

	useEffect(() => {
		initiateConnection();
		return () => socketRef.current?.close();
	}, [initiateConnection]);

	return (
		<doomContext.Provider value={{ won, lost, disconnected, send, doom, gid, open }}>
			{!open && (
				<div className="fixed top-0 left-4 right-4 rounded-b-md bg-red-500 px-6 py-1  text-white z-50 font-bold">
					You are not connected, Please refresh the page
				</div>
			)}
			{children}
		</doomContext.Provider>
	);
};

export default DoomProvider;
