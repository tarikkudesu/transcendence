import { createContext, useContext } from 'react';

export interface NotificationType {
	senderAvatarUrl: string;
	reciever: string;
	sender: string;
	event: string;
	date: string;
}

class SocketState {
	// * Websocket vars
	error: boolean = false;
	close: boolean = false;
	open: boolean = false;

	notifications: NotificationType[] = [];
	send: (message: string) => void = () => {};
}

export const notificationContext = createContext(new SocketState());

export function useNotificationSocket() {
	return useContext(notificationContext);
}
