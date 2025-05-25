import { useEffect, useRef, useState } from 'react';
import { Frame, Hash, Invitations, Message, Play, Pool, Score, WS, WSC, wsContext, ClientInvitation, ClientPlayer } from './ws-client';
import { useNavigate, useParams } from 'react-router-dom';

interface WSProviderProps {
	url?: string;
	children: React.ReactNode;
}
const WSProvider: React.FC<WSProviderProps> = ({ url, children }) => {
	const navigate = useNavigate();

	// * Parameters
	const { game } = useParams();

	// * Connection Managers
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [data, setData] = useState<string>('');

	// * Data Holders
	const [hash, setHash] = useState<string>('');
	const [pool, setPool] = useState<ClientPlayer[]>([]);
	const [invitations, setInvitations] = useState<ClientInvitation[]>([]);

	const [score, setScore] = useState<number[]>([0, 0]);
	const [frame, setFrame] = useState<Frame>(new Frame());

	function onerror() {
		console.error('WebSocket error');
		setClose(true);
		setOpen(false);
		setError(true);
	}
	function send(message: string) {
		if (socketRef.current?.OPEN) socketRef.current?.send(message);
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
						console.log(message);
						break;
					}
					case 'STOP': {
						console.log(message);
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
						console.log(message);
						break;
					}
					case 'WON': {
						console.log(message);
						break;
					}
					default:
						break;
				}
			}
			function onmessage(e: MessageEvent) {
				setData(e.data);
				const m: Message = WS.Json({ message: e.data, target: Message.instance });
				parse(m.message, m.data);
			}
			function onopen() {
				console.log('WebSocket connection opened', game);
				if (game) send(WS.ConnectMessage(WSC.username, '', WSC.img, 'GAME', game));
				else send(WS.ConnectMessage(WSC.username, '', WSC.img, 'MAIN', ''));
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
		[game, navigate, url] // ! MAY POTENTIALY CAUSE PROBLEMS
	);
	return (
		<wsContext.Provider value={{ error, close, open, data, hash, send, pool, invitations, score, frame }}>
			{children}
		</wsContext.Provider>
	);
};

export default WSProvider;
