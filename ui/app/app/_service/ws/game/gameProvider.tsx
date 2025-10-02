'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import * as Main from './index';

interface GameProviderProps {
	children: React.ReactNode;
}

if (process.env.NODE_ENV === 'production') console.log = () => {};
const API_BASE = process.env.NEXT_PUBLIC_WS_GAME_URL;

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const router = useRouter();
	const { notify } = useNotification();
	const { intercept } = useWebsocketInterceptor();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [pool, setPool] = useState<Main.ClientPlayer[]>([]);
	const [invitations, setInvitations] = useState<Main.ClientInvitation[]>([]);
	const [tournaments, setTournaments] = useState<Main.TournamentOverview[]>([]);
	const [tournament, setTournament] = useState<Main.ClientTournament>(Main.ClientTournament.instance);

	const online = useCallback(
		(username: string): 'free' | 'pong' | 'doom' | undefined => {
			const pooler = pool.find((ele) => ele.username === username);
			return pooler ? pooler.playerStatus : undefined;
		},
		[pool]
	);

	const pooler = useCallback(
		(username: string): Main.ClientPlayer | undefined => {
			return pool.find((ele) => ele.username === username);
		},
		[pool]
	);

	const parse = useCallback(
		(event: string, message: string, game: 'pong' | 'card of doom') => {
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
				case 'POOL': {
					const p: Main.Pool = Main.Json({ message, target: Main.Pool.instance });
					setPool(p.pool);
					break;
				}
				case 'INVITATIONS': {
					const i: Main.Invitations = Main.Json({ message, target: Main.Invitations.instance });
					setInvitations(i.invitations);
					break;
				}
				case 'PLAY': {
					const p: Main.Play = Main.Json({ message, target: Main.Play.instance });
					if (game === 'pong') router.push(`/pong/${p.opponent}/${p.gid}`);
					else router.push(`/doom/${p.opponent}/${p.gid}`);
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
		[notify, router]
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
				parse(m.message, m.data, m.game);
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
		<Main.gameContext.Provider value={{ send, pool, invitations, tournament, tournaments, online, pooler }}>
			{error && (
				<div className="fixed top-0 left-4 right-4 rounded-b-md bg-red-500 px-6 py-1 text-white z-50 font-bold">
					You have been disconnected, Please refresh the page
				</div>
			)}
			{children}
		</Main.gameContext.Provider>
	);
};

export default GameProvider;
