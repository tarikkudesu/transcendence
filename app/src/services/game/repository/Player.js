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
	const hash = Main.generateHash(username);
	socket.username = username;
	socket.PLAYFREE = true;
	socket.hash = hash;
	socket.gid = '';
	return player;
}
/****************************************************************************************************************
 *                                        PLAYERS TABLE MANIPULATION                                            *
 ****************************************************************************************************************/
// * add player
export function addPlayer(player) {
	if (Main.repository.players.has(player.username)) throw new Error('Player already exists');
	Main.repository.players.set(player.username, player);
	player.socket.send(Main.HashMessage(player.username, player.socket.hash, 'pong'));
}
// * remove player
export function removePlayer(username) {
	Main.repository.players.delete(username);
}
// * get player Hash
export function getPlayerHash(username) {
	const player = Main.repository.players.get(username);
	if (!player) throw new Error("Player-hash doesn't exists");
	return player.socket.hash;
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
				pool.push(new Main.ClientPlayer(value.username, i.game, value.socket.PLAYFREE === true ? 'free' : 'playing', i.invite_status));
			} catch (err) {
				pool.push(new Main.ClientPlayer(value.username, 'pong', value.socket.PLAYFREE === true ? 'free' : 'playing', 'unsent'));
				void err;
			}
		}
	});
	return pool;
}
