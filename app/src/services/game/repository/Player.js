import * as Main from '../index.js';

export class Player {
	constructor(username, socket) {
		this.prevPool = '';
		this.prevTournament = '';
		this.prevInvitations = '';
		this.username = username;
		this.socket = socket;
	}
}
// * create player
export function createPlayer(username, socket) {
	const player = new Player(username, socket);
	socket.username = username;
	socket.PLAYFREE = true;
	socket.gid = '';
	return player;
}
/****************************************************************************************************************
 *                                        PLAYERS TABLE MANIPULATION                                            *
 ****************************************************************************************************************/
// * verify existance
export function checkPlayer(username) {
	return Main.repository.players.has(username);
}
// * add player
export function addPlayer(player) {
	Main.repository.players.set(player.username, player);
}
// * remove player
export function removePlayer(username) {
	Main.repository.players.delete(username);
}
// * get player
export function getPlayer(username) {
	const player = Main.repository.players.get(username);
	if (!player) throw new Error("Player-object doesn't exists");
	return player;
}
export function getPool(username) {
	const pool = [];
	Main.repository.players.forEach((value) => {
		if (value.username !== username) {
			try {
				const i = Main.getInvitation(username, value.username);
				pool.push(
					new Main.ClientPlayer(value.username, i.game, value.socket.PLAYFREE === true ? 'free' : 'playing', i.invite_status)
				);
			} catch (err) {
				pool.push(new Main.ClientPlayer(value.username, 'pong', value.socket.PLAYFREE === true ? 'free' : 'playing', 'unsent'));
				void err;
			}
		}
	});
	return pool;
}
