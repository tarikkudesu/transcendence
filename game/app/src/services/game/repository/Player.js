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
export function createPlayer(username, socket, gid) {
	const player = new Player(username, socket);
	socket.username = username;
	socket.gid = gid;
	return player;
}

/****************************************************************************************************************
 *                                        POOOONG TABLE MANIPULATION                                            *
 ****************************************************************************************************************/

// * verify existance
export function checkPongPlayer(username) {
	return Main.repository.pongs.has(username);
}
// * add player
export function addPongPlayer(player) {
	Main.repository.pongs.set(player.username, player);
}
// * get player
export function getPongPlayer(username) {
	const player = Main.repository.pongs.get(username);
	if (!player) throw new Error("Player-pong-object doesn't exists");
	return player;
}

/****************************************************************************************************************
 *                                        DOOOOOM TABLE MANIPULATION                                            *
 ****************************************************************************************************************/

export function removeDoomPongPlayer(username) {
	Main.repository.dooms.delete(username);
	Main.repository.pongs.delete(username);
}

// * verify existance
export function checkDoomPlayer(username) {
	return Main.repository.dooms.has(username);
}
// * add player
export function addDoomPlayer(player) {
	Main.repository.dooms.set(player.username, player);
}
// * get player
export function getDoomPlayer(username) {
	const player = Main.repository.dooms.get(username);
	if (!player) throw new Error("Player-doom-object doesn't exists");
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
export function getPool(username, amIAFriendOfHis) {
	const pool = [];
	Main.repository.pongs.forEach((value) => {
		if (value.username !== username && amIAFriendOfHis({ username, potentialFriend: value.username }) === 1) {
			try {
				const i = Main.getInvitation(username, value.username);
				pool.push(new Main.ClientPlayer(value.username, i.game, 'pong', i.invite_status));
			} catch (err) {
				pool.push(new Main.ClientPlayer(value.username, 'pong', 'pong', 'unsent'));
				void err;
			}
		}
	});
	Main.repository.dooms.forEach((value) => {
		if (value.username !== username && amIAFriendOfHis({ username, potentialFriend: value.username }) === 1) {
			try {
				const i = Main.getInvitation(username, value.username);
				pool.push(new Main.ClientPlayer(value.username, i.game, 'doom', i.invite_status));
			} catch (err) {
				pool.push(new Main.ClientPlayer(value.username, 'pong', 'doom', 'unsent'));
				void err;
			}
		}
	});
	Main.repository.players.forEach((value) => {
		if (
			value.username !== username &&
			amIAFriendOfHis({ username, potentialFriend: value.username }) === 1 &&
			!pool.some((ele) => ele.username === value.username)
		) {
			try {
				const i = Main.getInvitation(username, value.username);
				pool.push(new Main.ClientPlayer(value.username, i.game, 'free', i.invite_status));
			} catch (err) {
				pool.push(new Main.ClientPlayer(value.username, 'pong', 'free', 'unsent'));
				void err;
			}
		}
	});
	return pool;
}
