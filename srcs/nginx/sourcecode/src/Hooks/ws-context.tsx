import { useEffect, useRef, useState } from 'react';
import { useNotification } from './useNotification';

import { Pool, Play, Hash, Message, wsContext, Invitations, ClientPlayer, ClientInvitation, WSError, ClientPong, ClientCardOfDoom, Json, ClientTournament, ConnectMessage } from './ws-client';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../Redux/Store';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../Redux/userSlice';

interface WSProviderProps {
	url?: string;
	children: React.ReactNode;
}
const WSProvider: React.FC<WSProviderProps> = ({ url, children }) => {
	const username: string = useSelector((state: RootState) => state.user.username);
	const { notify } = useNotification();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [data, setData] = useState<string>('');

	// * Data Holders
	const [hash, setHash] = useState<string>('');
	const [pool, setPool] = useState<ClientPlayer[]>([]);
	const [invitations, setInvitations] = useState<ClientInvitation[]>([]);
	const [tournament, setTournament] = useState<ClientTournament>(ClientTournament.instance);

	const [pong, setPong] = useState<ClientPong>(ClientPong.instance);
	const [doom, setDoom] = useState<ClientCardOfDoom>(ClientCardOfDoom.instance);

	function onerror() {
		setOpen(false);
		setClose(true);
		setError(true);
	}

	function reset() {
		setPong(ClientPong.instance);
		setDoom(ClientCardOfDoom.instance);
	}

	function send(message: string) {
		if (socketRef.current?.OPEN && hash) socketRef.current?.send(message);
		else notify({ message: "connection hasn't been established", error: true });
	}

	useEffect(
		function () {
			// ? HASH, POOL, INVITATIONS, PLAY, PONG, DOOM, TOURNAMENT, ERROR
			function parse(event: string, message: string, game: 'pong' | 'card of doom') {
				// console.log(event);
				switch (event) {
					// ? Pool
					case 'HASH': {
						const h: Hash = Json({ message, target: Hash.instance });
						setHash(h.hash);
						break;
					}
					case 'POOL': {
						const p: Pool = Json({ message, target: Pool.instance });
						setPool(p.pool);
						break;
					}
					case 'INVITATIONS': {
						const i: Invitations = Json({ message, target: Invitations.instance });
						setInvitations(i.invitations);
						break;
					}
					case 'PLAY': {
						const p: Play = Json({ message, target: Play.instance });
						if (game === 'pong') navigate('/dashboard/server/' + p.gid);
						else navigate('/dashboard/extra/' + p.gid);
						break;
					}
					// ? Game
					case 'PONG': {
						const p: ClientPong = Json({ message, target: ClientPong.instance });
						setPong(p);
						break;
					}
					case 'DOOM': {
						const d: ClientCardOfDoom = Json({ message, target: ClientCardOfDoom.instance });
						console.log(d);
						setDoom(d);
						break;
					}
					case 'TOURNAMENT': {
						const t: ClientTournament = Json({ message, target: ClientTournament.instance });
						setTournament(t);
						break;
					}
					case 'ERROR': {
						const r: WSError = Json({ message, target: WSError.instance });
						notify({ message: r.message, error: true });
						break;
					}
					default:
						break;
				}
			}
			function onmessage(e: MessageEvent) {
				try {
					setData(e.data);
					const m: Message = Json({ message: e.data, target: Message.instance });
					parse(m.message, m.data, m.game);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (err: any) {
					notify({ message: err.message, error: true });
				}
			}
			function onopen() {
				console.log('WebSocket connection opened');
				setOpen(true);
				dispatch(
					setUser({
						username,
						email: '',
						bio: '',
						created_at: '',
						avatar: '',
					})
				);
				socketRef.current?.send(ConnectMessage(username));
			}
			function onclose() {
				console.log('WebSocket connection closed');
				setOpen(false);
				setClose(true);
			}
			if (url) {
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
			}
		},
		[navigate, url] // ! MAY POTENTIALY CAUSE PROBLEMS
	);

	return <wsContext.Provider value={{ error, close, open, data, hash, send, pool, invitations, tournament, pong, doom, reset }}>{children}</wsContext.Provider>;
};

export default WSProvider;
