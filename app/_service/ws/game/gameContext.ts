import { createContext, useContext } from 'react';
import * as Main from './index';

class SocketState {
	// * Websocket vars
	error: boolean = false;
	close: boolean = false;
	open: boolean = false;

	// * Incoming data
	pool: Main.ClientPlayer[] = [];
	invitations: Main.ClientInvitation[] = [];
	tournament: Main.ClientTournament = Main.ClientTournament.instance;

	pong: Main.ClientPong = Main.ClientPong.instance;
	doom: Main.ClientCardOfDoom = Main.ClientCardOfDoom.instance;

	send: (message: string) => void = () => {};
	reset: () => void = () => {};
}

export const gameContext = createContext(new SocketState());

export function useGameSocket() {
	return useContext(gameContext);
}
