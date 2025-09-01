'use client';

import { Nothing } from '@/app/_components/gameplay/Cards';
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
	const [error, setError] = useState<boolean>(false);
	const [waiting, setWaiting] = useState<boolean>(true);
	const [nothing, setNothing] = useState<boolean>(false);
	const [disconnected, setDisonnected] = useState<boolean>(false);
	const [doom, setDoom] = useState<Main.ClientCardOfDoom | null>(null);

	const reset = useCallback(() => {
		setWon(false);
		setLost(false);
		setError(false);
		setWaiting(true);
		setNothing(false);
		setDisonnected(false);
		setDoom(null);
	}, []);

	const parse = useCallback(
		(event: string, message: string) => {
			switch (event) {
				case 'DOOM': {
					const d: Main.ClientCardOfDoom = Main.Json({ message, target: Main.ClientCardOfDoom.instance });
					setWaiting(false);
					setDoom(d);
					break;
				}
				case 'DISCONNECTED': {
					setDisonnected(true);
					setWaiting(false);
					break;
				}
				case 'WAITING': {
					setWaiting(true);
					break;
				}
				case 'NOTHING': {
					setWaiting(false);
					setNothing(true);
					break;
				}
				case 'LOST': {
					setWaiting(false);
					setLost(true);
					break;
				}
				case 'WON': {
					setWaiting(false);
					setWon(true);
					break;
				}
				default:
					break;
			}
		},
		[]
	);

	const send = useCallback((message: string) => {
		if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
	}, []);

	const onopen = useCallback(() => {
		console.log('Doom WebSocket connection opened');
	}, []);

	const onerror = useCallback(() => {
		console.log(`Doom WebSocket connection gave an error`);
		setError(true);
	}, []);

	const onclose = useCallback((event: CloseEvent) => {
		console.log(`Doom WebSocket connection closed: ${event?.reason ?? ''}`);
		setError(true);
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
				setError(true);
				console.log('Error creating Pong WebSocket connection:', err);
			}
		} else {
			setError(true);
			notify({ message: 'Something went wrong, Please refresh the page', error: true });
		}
	}, [gid, intercept, notify, onclose, onerror, onmessage, onopen, reset]);

	useEffect(() => {
		initiateConnection();
		return () => socketRef.current?.close();
	}, [initiateConnection]);

	return (
		<doomContext.Provider value={{ won, lost, disconnected, send, doom, gid, waiting, nothing }}>
			{error ? <Nothing /> : children}
		</doomContext.Provider>
	);
};

export default DoomProvider;
