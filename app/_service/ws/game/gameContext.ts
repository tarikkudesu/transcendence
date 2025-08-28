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

	pong: Main.ClientPong | null = null;
	doom: Main.ClientCardOfDoom | null = null;

	pooler: (username: string) => Main.ClientPlayer | undefined = (u: string) => Main.ClientPlayer.instance;
	online: (username: string) => 'playing' | 'free' | undefined = (u: string) => undefined;

	send: (message: string) => void = () => {};
	reset: () => void = () => {};
}

export const gameContext = createContext(new SocketState());

export function useGameSocket() {
	return useContext(gameContext);
}
