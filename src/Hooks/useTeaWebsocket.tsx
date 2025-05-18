import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { WS } from './ws-client';
import { faker } from '@faker-js/faker';

type SocketConnectionControls = {
	data: string;
	send: (message: string) => void;
};

const SocketConnectionControlsInstance = {
	data: '',
	send: (message: string) => console.log(message),
};

export const SocketConnectionContext = createContext<SocketConnectionControls>(SocketConnectionControlsInstance);
export const userContext = createContext<string>(faker.internet.username());

interface useWebsocketProps {
	url: string;
	openCallBack?: () => void;
	closeCallBack?: () => void;
}

export function useTeaWebsocket({ url, openCallBack, closeCallBack }: useWebsocketProps) {
	const username = useContext(userContext);
	const socketRef = useRef<WebSocket | null>(null);
	const [data, setData] = useState<string>('');
	const [error, setError] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);

	function onmessage(e: MessageEvent) {
		console.log('WebSocket message received:', e.data);
		setData(e.data);
	}
	function onopen() {
		console.log('WebSocket connection opened');
		setOpen(true);
		send(WS.ConnectMessage(username, 'img.img', 'MAIN', ''));
		if (openCallBack) openCallBack();
	}
	function onclose() {
		console.log('WebSocket connection closed');
		setOpen(false);
		setClose(true);
		if (closeCallBack) closeCallBack();
	}
	function onerror() {
		console.error('WebSocket error');
		setError(true);
	}
	function send(message: string) {
		if (socketRef.current?.OPEN) socketRef.current?.send(message);
	}
	useEffect(
		function () {
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
		},
		[url]
	);
	return { data, send, error, open, close };
}
