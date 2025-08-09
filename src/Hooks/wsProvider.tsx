import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotification } from './useNotification';
import { useNavigate } from 'react-router-dom';

import * as Main from './index';
import { useAuth } from './AuthContext';

interface WSProviderProps {
	url: string;
	username: string;
	children: React.ReactNode;
}

const WSProvider: React.FC<WSProviderProps> = ({ url, username, children }) => {
	const navigate = useNavigate();
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
	const { setUsername } = useAuth();

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
					if (game === 'pong') navigate('/dashboard/server/' + p.gid);
					else navigate('/dashboard/extra/' + p.gid);
					break;
				}
				// ? Game
				case 'PONG': {
					const p: Main.ClientPong = Main.Json({ message, target: Main.ClientPong.instance });
					setPong(p);
					console.log(p);
					break;
				}
				case 'DOOM': {
					const d: Main.ClientCardOfDoom = Main.Json({ message, target: Main.ClientCardOfDoom.instance });
					console.log(d);
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
		[navigate, notify]
	);

	const send = useCallback(
		(message: string) => {
			if (socketRef.current?.OPEN) socketRef.current?.send(message);
			else notify({ message: "connection hasn't been established", error: true });
		},
		[notify]
	);

	const onerror = useCallback(() => {
		setOpen(false);
		setClose(true);
		setError(true);
	}, []);

	const onclose = useCallback(() => {
		console.log('WebSocket connection closed');
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
		console.log('WebSocket connection opened');
		setOpen(true);
		setUsername(username);
	}, [setUsername, username]);

	useEffect(
		function () {
			try {
				socketRef.current = new WebSocket(url);
				socketRef.current.onmessage = onmessage;
				socketRef.current.onerror = onerror;
				socketRef.current.onclose = onclose;
				socketRef.current.onopen = onopen;
			} catch (err: unknown) {
				console.error('Error creating WebSocket connection:', err);
				setError(true);
			}
		},
		[navigate, notify, onclose, onerror, onmessage, onopen, url, username]
	);

	return (
		<Main.wsContext.Provider value={{ error, close, open, send, pool, invitations, tournament, pong, doom, reset }}>
			{children}
		</Main.wsContext.Provider>
	);
};

export default WSProvider;
