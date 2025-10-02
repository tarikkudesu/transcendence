import * as Main from '../index.js';

if (process.env.NODE_ENV === 'production') console.log = () => {};

export class Room {
	constructor(pu, ou, tn) {
		this.tournamentName = tn;
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
	sen.socket.send(Main.PlayMessage(game, GID, opponent));
	rec.socket.send(Main.PlayMessage(game, GID, player));
	Main.repository.rooms.set(GID, new Room(player, opponent));
}

export function playerInRoom(player) {
	Main.repository.rooms.forEach((room) => {
		if (player === room.player || player === room.opponent) throw new Error(`${player} Already is engaged in a game`);
	});
}

// * get room
export function getRoom(gid) {
	const r = Main.repository.rooms.get(gid);
	if (r === undefined) throw new Error("Room doesn't exists");
	return r;
}

// * remove room
export function removeRoom(winner, key) {
	Main.registerRoomResult(winner, key);
	Main.repository.rooms.delete(key);
}

// * connnect player to a room
export function connectPlayer(username, game) {
	let player = null;
	if (game === 'card of doom') player = Main.getDoomPlayer(username);
	else if (game === 'pong') player = Main.getPongPlayer(username);
	const room = getRoom(player.socket.gid);
	if (username !== room.player && username !== room.opponent) throw new Error('You are not allowed to be here');
	if (username === room.player) {
		room.playerConnected = true;
	} else if (username === room.opponent) {
		room.opponentConnected = true;
	} else throw new Error('You are not allowed to be here');
	if (room.playerConnected && room.opponentConnected) {
		room.roomState = 'playing';
		if (game === 'pong') room.game = new Main.Pong(room.player, room.opponent);
		else room.game = new Main.Doom(room.player, room.opponent);
	}
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

export function updateDoomRoom(room, player, opponent, createGameDoom) {
	room.game.update();
	let winner = room.game?.winner;
	if (opponent && opponent.socket.OPEN && player && player.socket.OPEN) {
		const { myturn, timer } = room.game;
		const time = (Main.DoomTimeLimite - (Date.now() - timer)) / 1000;
		player.socket.send(
			Main.DoomMessage(
				new Main.ClientCardOfDoom({
					cards: room.game.getMap(),
					myturn: myturn === player.username,
					timer: Math.ceil(time >= 0 ? time : 0),
				})
			)
		);
		opponent.socket.send(
			Main.DoomMessage(
				new Main.ClientCardOfDoom({
					cards: room.game.getMap(),
					myturn: myturn === opponent.username,
					timer: Math.ceil(time >= 0 ? time : 0),
				})
			)
		);
		if (winner) {
			if (winner == room.player) player.socket.send(Main.WonMessage());
			else player.socket.send(Main.LostMessage());
			if (winner == room.player) opponent.socket.send(Main.LostMessage());
			else opponent.socket.send(Main.WonMessage());
			createGameDoom({
				playerUsername: room.player,
				opponentUsername: room.opponent,
				winnerUsername: room.game.winner,
				gameDate: room.date_at,
			});
			Main.removeRoom(opponent.socket.username, opponent.socket.gid);
		}
	} else if (opponent && opponent.socket.OPEN && !winner) {
		opponent.socket.send(Main.DisconnectMessage());
		createGameDoom({
			playerUsername: room.player,
			opponentUsername: room.opponent,
			winnerUsername: opponent.socket.username,
			gameDate: room.date_at,
		});
		Main.removeRoom(opponent.socket.username, opponent.socket.gid);
	} else if (player && player.socket.OPEN && !winner) {
		player.socket.send(Main.DisconnectMessage());
		createGameDoom({
			playerUsername: room.player,
			opponentUsername: room.opponent,
			winnerUsername: player.socket.username,
			gameDate: room.date_at,
		});
		Main.removeRoom(player.socket.username, player.socket.gid);
	} else Main.removeRoom(player.socket.username, player.socket.gid);
}

export function updatePongRoom(room, player, opponent, createGamePong) {
	room.game.update();
	let winner = room.game?.winner;
	if (opponent && opponent.socket.OPEN && player && player.socket.OPEN) {
		const { ball, leftPaddle, rightPaddle, playerScore, opponentScore, playerSound, opponentSound } = room.game;
		let clientPong = new Main.ClientPong({
			ball,
			leftPaddle,
			rightPaddle,
			sound: player.username === room.opponent ? opponentSound : playerSound,
			playerScore: player.username === room.opponent ? opponentScore : playerScore,
			opponentScore: player.username === room.opponent ? playerScore : opponentScore,
		});
		if (player.username !== room.opponent) clientPong = Main.transformFrame(clientPong);
		player.socket.send(Main.PongMessage(clientPong));
		clientPong = new Main.ClientPong({
			ball,
			leftPaddle,
			rightPaddle,
			sound: opponent.username === room.opponent ? opponentSound : playerSound,
			playerScore: opponent.username === room.opponent ? opponentScore : playerScore,
			opponentScore: opponent.username === room.opponent ? playerScore : opponentScore,
		});
		if (opponent.username !== room.opponent) clientPong = Main.transformFrame(clientPong);
		opponent.socket.send(Main.PongMessage(clientPong));
		if (winner) {
			if (winner == room.player) player.socket.send(Main.WonMessage());
			else player.socket.send(Main.LostMessage());
			if (winner == room.player) opponent.socket.send(Main.LostMessage());
			else opponent.socket.send(Main.WonMessage());
			createGamePong({
				playerUsername: room.player,
				opponentUsername: room.opponent,
				playerScore: room.game.playerScore,
				opponentScore: room.game.opponentScore,
				tournamentName: room.tournamentName,
				gameDate: room.date_at,
			});
			Main.removeRoom(winner, player.socket.gid);
		}
	} else if (opponent && opponent.socket.OPEN && !winner) {
		opponent.socket.send(Main.DisconnectMessage());
		createGamePong({
			playerUsername: room.player,
			opponentUsername: room.opponent,
			playerScore: room.game.playerScore,
			opponentScore: room.game.opponentScore,
			tournamentName: room.tournamentName,
			gameDate: room.date_at,
		});
		Main.removeRoom(opponent.socket.username, opponent.socket.gid);
	} else if (player && player.socket.OPEN && !winner) {
		player.socket.send(Main.DisconnectMessage());
		createGamePong({
			playerUsername: room.player,
			opponentUsername: room.opponent,
			playerScore: room.game.playerScore,
			opponentScore: room.game.opponentScore,
			tournamentName: room.tournamentName,
			gameDate: room.date_at,
		});
		Main.removeRoom(player.socket.username, player.socket.gid);
	} else Main.removeRoom(player.socket.username, player.socket.gid);
}

export function updateRoom(room, key, createGamePong, createGameDoom) {
	if (room.game instanceof Main.Pong) {
		let player = null;
		let opponent = null;
		try {
			player = Main.getPongPlayer(room.player);
		} catch (err) {
			console.log(err);
		}
		try {
			opponent = Main.getPongPlayer(room.opponent);
		} catch (err) {
			console.log(err);
		}
		Main.updatePongRoom(room, player, opponent, createGamePong);
	} else if (room.game instanceof Main.Doom) {
		let player = null;
		let opponent = null;
		try {
			player = Main.getDoomPlayer(room.player);
		} catch (err) {
			console.log(err);
		}
		try {
			opponent = Main.getDoomPlayer(room.opponent);
		} catch (err) {
			console.log(err);
		}
		Main.updateDoomRoom(room, player, opponent, createGameDoom);
	} else if (Date.now() - room.date_at > Main.RoomConnectionTimeout) {
		if (room.playerConnected) Main.removeRoom(room.player, key);
		else if (room.opponentConnected) Main.removeRoom(room.opponent, key);
		else Main.removeRoom('', key);
	}
}
