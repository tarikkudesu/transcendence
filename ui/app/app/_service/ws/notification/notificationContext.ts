import { createContext, useContext } from 'react';

export interface NotificationType {
	event:
		| 'FRIENDACCEPTEDYOURREQUEST'
		| 'TOURNAMENTMATCHUP'
		| 'NEWTOURNAMENTDATE'
		| 'REGESTRATIONOPEN'
		| 'TOURNAMENTWON'
		| 'FRIENDREQUEST'
		| 'CHATMESSAGE';
	id: number;
	date: number;
	sender: string;
	service: string;
	receiver: string;
}

class SocketState {
	notifications: NotificationType[] = [];
	send: (message: string) => void = () => {};
}

export const notificationContext = createContext(new SocketState());

export function useNotificationSocket() {
	return useContext(notificationContext);
}
