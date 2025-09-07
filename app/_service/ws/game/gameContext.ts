import { createContext, useContext } from 'react';
import * as Main from './index';

class SocketState {
	// * Incoming data
	pool: Main.ClientPlayer[] = [];
	invitations: Main.ClientInvitation[] = [];
	tournaments: Main.TournamentOverview[] = [];
	tournament: Main.ClientTournament = Main.ClientTournament.instance;
	pooler: (username: string) => Main.ClientPlayer | undefined = (u: string) => {
		void u;
		return Main.ClientPlayer.instance;
	};
	online: (username: string) => 'free' | 'pong' | 'doom' | undefined = (u: string) => {
		void u;
		return undefined;
	};
	send: (message: string) => void = () => {};
}

export const gameContext = createContext(new SocketState());

export function useGameSocket() {
	return useContext(gameContext);
}
