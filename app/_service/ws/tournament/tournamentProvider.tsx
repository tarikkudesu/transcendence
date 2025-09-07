'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Main from '../game/index';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import { tournamentContext } from './tournamentContext';

interface TournamentProviderProps {
	children: React.ReactNode;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_TOURNAMENT_URL;

const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
	const { notify } = useNotification();
	const { intercept } = useWebsocketInterceptor();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [tournaments, setTournaments] = useState<Main.TournamentOverview[]>([]);
	const [tournament, setTournament] = useState<Main.ClientTournament>(Main.ClientTournament.instance);

	const parse = useCallback(
		(event: string, message: string) => {
			console.log('Tournament socket', event, message);
			switch (event) {
				case 'TOURNAMENTS': {
					const t: Main.Tournaments = Main.Json({ message, target: Main.Tournaments.instance });
					setTournaments(t.tournaments);
					break;
				}
				case 'TOURNAMENT': {
					const t: Main.ClientTournament = Main.Json({ message, target: Main.ClientTournament.instance });
					setTournament(t);
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
		console.log('Game WebSocket connection opened');
	}, []);

	const onerror = useCallback(() => {
		console.log(`Game WebSocket connection gave an error`);
		setError(true);
	}, []);

	const onclose = useCallback((event: CloseEvent) => {
		console.log(`Game WebSocket connection closed: ${event?.reason ?? ''}`);
		setError(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const m: Main.Message = Main.Json({ message: e.data, target: Main.Message.instance });
				parse(m.message, m.data);
			} catch (err: unknown) {
				if (err instanceof Error) notify({ message: err.message, error: true });
				else notify({ message: 'message error, game socket', error: true });
			}
		},
		[notify, parse]
	);

	const initiateConnection = useCallback(async () => {
		const result = await intercept();
		if (result === 'success') {
			socketRef.current?.close();
			try {
				console.log('creating Game WebSocket connection ' + API_BASE);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else throw new Error('API_BASE not defined');
			} catch (err: unknown) {
				console.log('Error creating Game WebSocket connection:', err);
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
		<tournamentContext.Provider value={{ send, tournament, tournaments }}>
			{error && (
				<div className="fixed top-0 left-4 right-4 rounded-b-md bg-red-500 px-6 py-1 text-white z-50 font-bold">
					You have been disconnected, Please refresh the page
				</div>
			)}
			{children}
		</tournamentContext.Provider>
	);
};

export default TournamentProvider;
