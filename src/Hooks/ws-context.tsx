import { useEffect, useRef, useState } from 'react';
import { WS, Pool, Play, Hash, Frame, Score, Message, wsContext, Invitations, ClientPlayer, ClientInvitation, WSError } from './ws-client';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './useNotification';

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

	const [won, setWon] = useState<boolean>(false);
	const [lost, setLost] = useState<boolean>(false);
	const [stop, setStop] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	const [score, setScore] = useState<number[]>([0, 0]);
	const [frame, setFrame] = useState<Frame>(new Frame());

	function onerror() {
		console.error('WebSocket error');
		setOpen(false);
		setClose(true);
		setError(true);
	}

	function reset() {
		setWon(false);
		setLost(false);
		setStop(false);
		setStart(false);
		setScore([0, 0]);
		setFrame(new Frame());
	}

	function send(message: string) {
		if (socketRef.current?.OPEN) socketRef.current?.send(message);
		// else throw new Error('Socket not available');
	}
	useEffect(
		function () {
			function parse(event: string, message: string) {
				switch (event) {
					// ? Pool
					case 'HASH': {
						const h: Hash = WS.Json({ message, target: Hash.instance });
						setHash(h.hash);
						break;
					}
					case 'POOL': {
						const p: Pool = WS.Json({ message, target: Pool.instance });
						setPool(p.pool);
						break;
					}
					case 'INVITATIONS': {
						const i: Invitations = WS.Json({ message, target: Invitations.instance });
						setInvitations(i.invitations);
						break;
					}
					case 'PLAY': {
						const p: Play = WS.Json({ message, target: Play.instance });
						navigate('/server/' + p.game);
						break;
					}
					// ? Game
					case 'START': {
						setStart(true);
						break;
					}
					case 'STOP': {
						setStop(true);
						break;
					}
					case 'FRAME': {
						const f: Frame = WS.Json({ message, target: Frame.instance });
						setFrame(f);
						break;
					}
					case 'SCORE': {
						const s: Score = WS.Json({ message, target: Score.instance });
						setScore([s.player, s.opponent]);
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
						const r: WSError = WS.Json({ message, target: WSError.instance });
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
					const m: Message = WS.Json({ message: e.data, target: Message.instance });
					parse(m.message, m.data);
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
					// * 'ws://10.13.7.14:3000/api/game/'
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

	return (
		<wsContext.Provider
			value={{ error, close, open, data, hash, send, pool, invitations, start, stop, score, frame, won, lost, reset }}
		>
			{children}
		</wsContext.Provider>
	);
};

export default WSProvider;
