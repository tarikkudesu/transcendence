import * as Main from './index.js';

export function closeSocket(socket) {
	if (socket.username) {
		if (socket.PLAYFREE === false) {
			try {
				const room = Main.getRoom(socket.gid);
				room.roomState = 'disconnected';
				room.date_at = Date.now();
			} catch (err) {
				void err;
			}
		}
		Main.cancelAllPlayerInvitations(socket.username);
		Main.removePlayer(socket.username);
	}
}

export function eventEntry(message, socket) {
	try {
		Main.useParser(message, socket);
	} catch (error) {
		socket.send(Main.ErrorMessage("you didn't pong good enough"));
		console.error('Error', error.message);
	}
}

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
