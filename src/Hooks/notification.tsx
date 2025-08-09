import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './useNotification';

interface NotifyWsProps {
	url: string;
	children: React.ReactNode;
}

const NotifyWs: React.FC<NotifyWsProps> = ({ url, children }) => {
	const navigate = useNavigate();
	const { notify } = useNotification();
	const socketRef = useRef<WebSocket | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

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
		console.log('Notification WebSocket connection closed');
		setOpen(false);
		setClose(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			notify({ message: e.data });
		},
		[notify]
	);

	const onopen = useCallback(() => {
		console.log('Notification WebSocket connection opened');
		setOpen(true);
	}, []);

	useEffect(
		function () {
			try {
				socketRef.current = new WebSocket(url);
				socketRef.current.onmessage = onmessage;
				socketRef.current.onerror = onerror;
				socketRef.current.onclose = onclose;
				socketRef.current.onopen = onopen;
			} catch (err: unknown) {
				console.error('Error creating Notification WebSocket:', err);
				setError(true);
			}
		},
		[navigate, notify, onclose, onerror, onmessage, onopen, url]
	);

	return <>{children}</>;
};

export default NotifyWs;
