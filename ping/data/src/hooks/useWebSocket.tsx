import { useEffect, useRef, useState } from 'react';
import { WS } from '../protocole/ws-client';
interface useWebsocketProps {
	url: string;
	username: string;
}
export function useWebsocket({ url, username }: useWebsocketProps) {
	const socketRef = useRef<WebSocket | null>(null);
	const [data, setData] = useState<string>('');
	const [error, setError] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);

	function onmessage(e: MessageEvent) {
		setData(e.data);
	}
	function onopen() {
		setOpen(true);
		send(WS.ConnectMessage(username));
	}
	function onclose() {
		setOpen(false);
		setClose(true);
	}
	function onerror() {
		setError(true);
	}
	function send(message: string) {
		if (socketRef.current?.OPEN) socketRef.current?.send(message);
	}
	useEffect(function () {
		try {
			// * 'ws://localhost:3000/api/game/'
			socketRef.current = new WebSocket(url);
			socketRef.current.onmessage = onmessage;
			socketRef.current.onerror = onerror;
			socketRef.current.onclose = onclose;
			socketRef.current.onopen = onopen;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log(err.message);
			setError(true);
		}
	}, []);
	return { data, send, error, open, close };
}
