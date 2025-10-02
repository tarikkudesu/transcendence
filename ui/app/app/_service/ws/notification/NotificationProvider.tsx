'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocketInterceptor } from '../useWebsocketInterceptor';
import { notificationContext, NotificationType } from './notificationContext';

interface NotificationProviderProps {
	children: React.ReactNode;
}

if (process.env.NODE_ENV === 'production') console.log = () => {};
const API_BASE = process.env.NEXT_PUBLIC_WS_NOTIFICATION_URL;

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
	const { notify } = useNotification();
	const socketRef = useRef<WebSocket | null>(null);
	const { intercept } = useWebsocketInterceptor();
	const [error, setError] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<NotificationType[]>([]);

	const send = useCallback((message: string) => {
		if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
	}, []);

	const onopen = useCallback(() => {
		console.log('Notification WebSocket connection opened');
	}, []);

	const onerror = useCallback(() => {
		setError(true);
	}, []);

	const onclose = useCallback(() => {
		console.log('Notification WebSocket connection closed');
		setError(true);
	}, []);

	const onmessage = useCallback(
		(e: MessageEvent) => {
			try {
				const json: NotificationType[] = JSON.parse(e.data);
				setNotifications(
					json.sort((a, b) => {
						const dateA = new Date(Number(a.date));
						const dateB = new Date(Number(b.date));
						return dateB.getTime() - dateA.getTime();
					})
				);
			} catch (err: unknown) {
				if (err instanceof Error) notify({ message: err.message, error: true });
				else notify({ message: 'message error, game socket', error: true });
			}
		},
		[notify]
	);

	const initiateConnection = useCallback(async () => {
		const result = await intercept();
		if (result === 'success') {
			socketRef.current?.close();
			try {
				console.log('creating Notification WebSocket connection ' + API_BASE);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else throw new Error('API_BASE not defined');
			} catch (err: unknown) {
				console.log('Error creating Notification WebSocket connection:', err);
			}
		} else {
			notify({ message: 'Something went wrong, Please refresh the page', error: true });
		}
	}, [intercept, onmessage, onerror, onclose, onopen, notify]);

	useEffect(() => {
		initiateConnection();
		return () => socketRef.current?.close();
	}, [initiateConnection]);

	return (
		<notificationContext.Provider value={{ send, notifications }}>
			{error && (
				<div className="fixed top-0 left-4 right-4 rounded-b-md bg-red-500 px-6 py-1 text-white z-50 font-bold">
					You have been disconnected, Please refresh the page
				</div>
			)}
			{children}
		</notificationContext.Provider>
	);
};

export default NotificationProvider;
