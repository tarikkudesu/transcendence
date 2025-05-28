import { createContext, useEffect, useRef, useState } from 'react';

import { ClientInvitation, ClientPlayer, Hash, Invitations, Message, Pool, WS, WSC } from './ws-client';

type SocketConnectionControls = {
	data: string;
	send: (message: string) => void;
};

const SocketConnectionControlsInstance = {
	data: '',
	send: (message: string) => console.log(message),
};

export const SocketConnectionContext = createContext<SocketConnectionControls>(SocketConnectionControlsInstance);

interface useWebsocketProps {
	url?: string;
	openCallBack?: () => void;
	closeCallBack?: () => void;
}

export function useTeaWebsocket({ url, openCallBack, closeCallBack }: useWebsocketProps) {
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

	function parse(event: string, message: string) {
		switch (event) {
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
			default:
				break;
		}
	}

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
			function onmessage(e: MessageEvent) {
				setData(e.data);
				const m: Message = WS.Json({ message: e.data, target: Message.instance });
				parse(m.message, m.data);
			}
			function onopen() {
				console.log('WebSocket connection opened');
				send(WS.ConnectMessage('', WSC.username, WSC.img, 'MAIN', ''));
				setOpen(true);
				if (openCallBack) openCallBack();
			}
			function onclose() {
				console.log('WebSocket connection closed');
				setOpen(false);
				setClose(true);
				if (closeCallBack) closeCallBack();
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
		[closeCallBack, openCallBack, url]
	);
	return { data, send, error, open, close, hash, pool, invitations };
}
