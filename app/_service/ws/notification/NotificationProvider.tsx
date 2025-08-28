'use client';

import { useNotification } from '@/app/_components/mini/useNotify';
import { Badge } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { notificationContext, NotificationType } from './notificationContext';

interface NotificationProviderProps {
	children: React.ReactNode;
}

const API_BASE = process.env.NEXT_PUBLIC_WS_NOTIFICATION_URL;

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
	const { notify } = useNotification();
	const socketRef = useRef<WebSocket | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [close, setClose] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<NotificationType[]>([]);

	const send = useCallback(
		(message: string) => {
			if (socketRef.current?.OPEN && message) socketRef.current?.send(message);
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

	const onmessage = useCallback((e: MessageEvent) => {
		try {
			const json: NotificationType[] = JSON.parse(e.data);
			setNotifications(
				json.sort((a, b) => {
					const dateA = new Date(Number(a.date));
					const dateB = new Date(Number(b.date));
					return dateB.getTime() - dateA.getTime();
				})
			);
		} catch (err) {
			void err;
		}
	}, []);

	const onopen = useCallback(() => {
		console.log('Notification WebSocket connection opened');
		setOpen(true);
	}, []);

	function content() {
		if (error)
			return (
				<Badge color="red" variant="soft" radius="full" className="fixed top-4 z-100 right-4">
					Notification: Error
				</Badge>
			);
		if (close)
			return (
				<Badge color="yellow" variant="soft" radius="full" className="fixed top-4 z-100 right-4">
					Notification: Closed
				</Badge>
			);
		if (open)
			return (
				<Badge color="jade" variant="soft" radius="full" className="fixed top-4 z-100 right-4">
					Notification: Open
				</Badge>
			);
		return (
			<Badge color="red" variant="soft" radius="full" className="fixed top-4 z-100 right-4">
				Notification: Disconnected
			</Badge>
		);
	}

	useEffect(
		function () {
			if (socketRef.current?.OPEN) return;
			try {
				console.log('Connecting to Notification WebSocket ' + API_BASE);
				if (API_BASE) {
					socketRef.current = new WebSocket(API_BASE);
					socketRef.current.onmessage = onmessage;
					socketRef.current.onerror = onerror;
					socketRef.current.onclose = onclose;
					socketRef.current.onopen = onopen;
				} else setError(true);
			} catch (err: unknown) {
				console.error('Error creating Notification WebSocket:', err);
				setError(true);
			}
		},
		[error, close]
	);

	return (
		<notificationContext.Provider value={{ close, error, open, send, notifications }}>
			{children}
			{content()}
		</notificationContext.Provider>
	);
};

export default NotificationProvider;
