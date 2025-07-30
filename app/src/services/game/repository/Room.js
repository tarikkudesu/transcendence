import * as Main from '../index.js';

export class Room {
	constructor(pu, ou, tn) {
		this.playerTinyChat = '';
		this.tournamentName = tn;
		this.opponentTinyChat = '';
		this.date_at = Date.now();
		this.game = null;
		this.roomState = 'connecting';
		this.opponent = ou;
		this.player = pu;
	}
}
/***************************************************************************************************************
 *                                           ROOM TABLE MANIPULATION                                           *
 ***************************************************************************************************************/
// * new room
export function addRoom(player, opponent, game, GID) {
	const sen = Main.getPlayer(player);
	const rec = Main.getPlayer(opponent);
	sen.socket.send(Main.PlayMessage(sen.username, sen.socket.hash, game, GID));
	rec.socket.send(Main.PlayMessage(rec.username, rec.socket.hash, game, GID));
	Main.repository.rooms.set(GID, new Room(player, opponent));
}

// * remove room
export function getRoom(gid) {
	const r = Main.repository.rooms.get(gid);
	if (r === undefined) throw new Error("Room doesn't exists");
	return r;
}

// * remove room
export function removeRoom(room, key) {
	Main.registerRoomResult(room, key);
	Main.repository.rooms.delete(key);
}

// * connnect player to a room
export function connectPlayer(username, gid, game) {
	const room = getRoom(gid);
	const player = Main.getPlayer(username);
	if (username !== room.player && username !== room.opponent) throw new Error('You are not allowed to be here');
	if (room.roomState === 'player-1-connected') room.roomState = 'player-2-connected';
	else if (room.roomState === 'connecting') room.roomState = 'player-1-connected';
	player.socket.PLAYFREE = false;
	player.socket.gid = gid;
	if (room.roomState === 'player-2-connected') {
		room.roomState = 'playing';
		if (game === 'pong') room.game = new Main.Pong(room.player, room.opponent);
		else room.game = new Main.Doom(room.player, room.opponent);
		room.date_at = Date.now();
	}
}

export function disconnectPlayer(player) {
	player.socket.PLAYFREE = true;
	player.socket.gid = '';
}

// * room hook
export function roomHook(username, hook) {
	const r = getRoom(hook.gid);
	if (r.game && r.game instanceof Main.Pong) {
		if (r.player === username) r.game.keyPressLeft(hook.up, hook.down);
		if (r.opponent === username) r.game.keyPressRight(hook.up, hook.down);
	}
}

export function roomFlip(username, flip) {
	const r = getRoom(flip.gid);
	if (r.game && r.game instanceof Main.Doom && (username === r.player || username === r.opponent)) r.game.flip(username, flip.pos);
}

export function roomTinyChat(username, tiny) {
	const r = getRoom(tiny.gid);
	if (r.game && tiny.message.length <= 100 && (username === r.player || username === r.opponent)) {
		if (username === r.player) r.opponentTinyChat = tiny.message;
		else r.playerTinyChat = tiny.message;
	}
}

// * update rooms
export function updateRooms(createGamePong, createGameDoom) {
	Main.repository.rooms.forEach((room, key) => {
		if (room.game && room.game.update() && room.roomState !== 'finished') {
			room.roomState = 'finished';
			room.date_at = Date.now();
			if (room.game instanceof Main.Pong) {
				Main.registerRoomResult(room, key);
				createGamePong({
					userUsername: room.player,
					opponentUsername: room.opponent,
					userScore: room.game.playerScore,
					opponentScore: room.game.opponentScore,
					tournamentName: room.tournamentName,
					gameDate: room.date_at,
				});
			} else if (room.game instanceof Main.Doom) {
				createGameDoom({
					userUsername: room.player,
					opponentUsername: room.opponent,
					winnerUsername: room.game.winner,
					gameDate: room.date_at,
				});
			}
		}
		if (room.roomState === 'connecting' && Date.now() - room.date_at > Main.roomConnectionTimeout) removeRoom(room, key);
		else if (room.roomState === 'disconnected' && Date.now() - room.date_at > Main.roomFinishTimeout) removeRoom(room, key);
		else if (room.roomState === 'finished' && Date.now() - room.date_at > Main.roomFinishTimeout) removeRoom(room, key);
	});
}
