import { useEffect, useRef, useState } from 'react';
interface useWebsocketProps {
	url: string;
	openCallBack?: () => void;
	closeCallBack?: () => void;
}
export function useWebsocket({ url, openCallBack, closeCallBack }: useWebsocketProps) {
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
		if (openCallBack) openCallBack();
	}
	function onclose() {
		setOpen(false);
		setClose(true);
		if (closeCallBack) closeCallBack();
	}
	function onerror() {
		setError(true);
	}
	function send(message: string) {
		console.log(socketRef.current);
		// if (socketRef.current?.readyState) socketRef.current?.send(message);
	}
	useEffect(function () {
		try {
			// * 'ws://localhost:3000/api/game/'
			socketRef.current = new WebSocket(url);
			socketRef.current.onmessage = onmessage;
			socketRef.current.onerror = onerror;
			socketRef.current.onclose = onclose;
			socketRef.current.onopen = onopen;
		} catch (err) {
			setError(true);
		}
	}, []);
	return { data, send, error, open, close };
}
