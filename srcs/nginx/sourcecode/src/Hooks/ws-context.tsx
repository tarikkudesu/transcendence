import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './useNotification';

import { Pool, Play, Hash, Message, wsContext, Invitations, ClientPlayer, ClientInvitation, WSError, ClientPong, ClientCardOfDoom, Json, ClientTournament } from './ws-client';

interface WSProviderProps {
	url?: string;
	children: React.ReactNode;
}
const WSProvider: React.FC<WSProviderProps> = ({ url, children }) => {
	const navigate = useNavigate();
	const { notify } = useNotification();
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
		console.error('WebSocket error');
		setOpen(false);
		setClose(true);
		setError(true);
	}

	function reset() {
		setPong(ClientPong.instance);
		setDoom(ClientCardOfDoom.instance);
	}

	function send(message: string) {
		if (socketRef.current?.OPEN) socketRef.current?.send(message);
	}
	useEffect(
		function () {
			function parse(event: string, message: string, game: 'pong' | 'card of doom') {
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
						if (game === 'pong') navigate('/server/' + p.gid);
						else navigate('/extra/' + p.gid);
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
						setDoom(d);
						break;
					}
					case 'TOURNAMENT': {
						const t: ClientTournament = Json({ message, target: ClientTournament.instance });
						setTournament(t);
						console.log(t);
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
				setData(e.data);
				try {
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
			}
			function onclose() {
				console.log('WebSocket connection closed');
				setOpen(false);
				setClose(true);
			}
			if (url) {
				try {
					// * 'ws://localhost:3000/api/game/'
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
