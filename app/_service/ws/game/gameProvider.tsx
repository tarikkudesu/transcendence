'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotification } from '@/app/_components/useNotify';
import * as Main from './index';
import { Badge } from '@radix-ui/themes';

interface GameProviderProps {
	children: React.ReactNode;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_GAME_URL;

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
	const { notify } = useNotification();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	// * Data Holders
	const [pool, setPool] = useState<Main.ClientPlayer[]>([]);
	const [invitations, setInvitations] = useState<Main.ClientInvitation[]>([]);
	const [tournament, setTournament] = useState<Main.ClientTournament>(Main.ClientTournament.instance);

	const [pong, setPong] = useState<Main.ClientPong>(Main.ClientPong.instance);
	const [doom, setDoom] = useState<Main.ClientCardOfDoom>(Main.ClientCardOfDoom.instance);

	const reset = useCallback(() => {
		setPong(Main.ClientPong.instance);
		setDoom(Main.ClientCardOfDoom.instance);
	}, []);

	const parse = useCallback(
		(event: string, message: string, game: 'pong' | 'card of doom') => {
			switch (event) {
				// ? Pool
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
					// if (game === 'pong') router.push('/dashboard/server/' + p.gid);
					// else router.push('/dashboard/extra/' + p.gid);
					break;
				}
				// ? Game
				case 'PONG': {
					const p: Main.ClientPong = Main.Json({ message, target: Main.ClientPong.instance });
					setPong(p);
					break;
				}
				case 'DOOM': {
					const d: Main.ClientCardOfDoom = Main.Json({ message, target: Main.ClientCardOfDoom.instance });
					setDoom(d);
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
				const m: Main.Message = Main.Json({ message: e.data, target: Main.Message.instance });
				parse(m.message, m.data, m.game);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				notify({ message: err.message, error: true });
			}
		},
		[notify, parse]
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
				<Badge color="red" variant="soft" radius="full" className="fixed bottom-4 z-100 right-4">
					Game: Error
				</Badge>
			);
		if (close)
			return (
				<Badge color="yellow" variant="soft" radius="full" className="fixed bottom-4 z-100 right-4">
					Game: Closed
				</Badge>
			);
		if (open)
			return (
				<Badge color="jade" variant="soft" radius="full" className="fixed bottom-4 z-100 right-4">
					Game: Open
				</Badge>
			);
		return (
			<Badge color="red" variant="soft" radius="full" className="fixed bottom-4 z-100 right-4">
				Game: Disconnected
			</Badge>
		);
	}

	return (
		<Main.gameContext.Provider value={{ error, close, open, send, pool, invitations, tournament, pong, doom, reset }}>
			{children}
			{content()}
		</Main.gameContext.Provider>
	);
};

export default GameProvider;
