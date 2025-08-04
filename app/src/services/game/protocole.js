import * as Main from './index.js';

// * Main Loop
export function main(createGamePong, createGameDoom, createTournament, addPlayerToTournament, updateTournamentWinner) {
	setInterval(() => {
		Main.deleteExpiredInvitations();
		Main.updateRooms(createGamePong, createGameDoom);
		Main.updateTournament(createTournament, addPlayerToTournament, updateTournamentWinner);
		Main.sendPool();
		Main.sendGame();
		Main.sendInvitations();
		Main.sendTournament();
	}, 1000 / 60);
}
