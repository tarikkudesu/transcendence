import { createContext, useContext } from 'react';

export interface NotificationType {
	event:
		| 'NEWTOURNAMENTDATE'
		| 'REGESTRATIONOPEN'
		| 'TOURNAMENTMATCHUP'
		| 'TOURNAMENTWON'
		| 'PONGGAMEINVITATION'
		| 'DOOMGAMEINVITATION'
		| 'FRIENDREQUEST'
		| 'FRIENDACCEPTEDYOURREQUEST'
		| 'CHATMESSAGE';
	date: number;
	sender: string;
	service: string;
	receiver: string;
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
