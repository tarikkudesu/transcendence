import { createContext, useContext } from 'react';
import * as Main from '../game/index';

class SocketState {
	tournaments: Main.TournamentOverview[] = [];
	tournament: Main.ClientTournament = Main.ClientTournament.instance;
	send: (message: string) => void = () => {};
}

export const tournamentContext = createContext(new SocketState());

export function useTournamentSocket() {
	return useContext(tournamentContext);
}
