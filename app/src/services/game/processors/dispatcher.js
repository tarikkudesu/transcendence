import { format } from 'date-fns';
import * as Main from '../index.js';

export function sendGame() {
	Main.repository.players.forEach((player) => {
		try {
			if (player.socket.OPEN && player.socket.PLAYFREE === false) {
				const { roomState, game, opponent, playerTinyChat, opponentTinyChat } = Main.getRoom(player.socket.gid);
				if (game && game instanceof Main.Pong) {
					const { ball, leftPaddle, rightPaddle, playerScore, opponentScore, winner, sound } = game;
					let clientPong = new Main.ClientPong({
						ball,
						sound,
						leftPaddle,
						rightPaddle,
						won: winner === player.username,
						stop: roomState === 'disconnected',
						lost: winner !== '' && winner !== player.username,
						playerScore: player.username === opponent ? opponentScore : playerScore,
						opponentScore: player.username === opponent ? playerScore : opponentScore,
						tinychat: player.username === opponent ? playerTinyChat : opponentTinyChat,
						start: roomState !== 'connecting' && roomState !== 'player-1-connected' && roomState !== 'player-2-connected',
					});
					if (player.username !== opponent) clientPong = Main.transformFrame(clientPong);
					player.socket.send(Main.PongMessage('pong', clientPong));
					if (clientPong.won || clientPong.lost || clientPong.stop) Main.disconnectPlayer(player);
				} else if (game && game instanceof Main.Doom) {
					const { winner, myturn, timer } = game;
					const clientDoom = new Main.ClientCardOfDoom({
						cards: game.getMap(),
						won: winner === player.username,
						myturn: myturn === player.username,
						stop: roomState === 'disconnected',
						lost: winner !== '' && winner !== player.username,
						timer: Math.ceil((Main.timeLimite - (Date.now() - timer)) / 1000),
						tinychat: player.username === opponent ? playerTinyChat : opponentTinyChat,
						start: roomState !== 'connecting' && roomState !== 'player-1-connected' && roomState !== 'player-2-connected',
					});
					player.socket.send(Main.DoomMessage('doom', clientDoom));
					if (clientDoom.won || clientDoom.lost || clientDoom.stop) Main.disconnectPlayer(player);
				}
			}
		} catch (err) {
			player.socket.PLAYFREE = true;
			player.socket.gid = '';
			void err;
		}
	});
}

export function sendTournament() {
	Main.repository.players.forEach((player) => {
		if (player.socket.OPEN && player.socket.PLAYFREE === true) {
			const { name, due_date, registeredPlayers, maxPlayers, matches, state, currentLevel } = Main.repository.tournament;
			const clientMatches = new Set();
			let gid = '';
			matches.forEach((e) => {
				if (e.player === player.username || e.opponent === player.username) gid = e.GID;
				clientMatches.add({ player: e.player, opponent: e.opponent, finished: e.finished });
			});
			const m = Main.TournamentMessage(
				'pong',
				new Main.ClientTournament({
					gid,
					name,
					state,
					round: currentLevel,
					results: [...registeredPlayers],
					nextMatches: [...clientMatches],
					date: format(due_date, 'yyyy-MM-dd HH:mm'),
					emptySlots: maxPlayers - registeredPlayers.size,
					registered: [...registeredPlayers].some((e) => e.username === player.username),
				})
			);
			if (m !== player.prevTournament) {
				player.prevTournament = m;
				player.socket.send(m);
			}
		}
	});
}

export function sendInvitations() {
	Main.repository.players.forEach((player) => {
		if (player.socket.OPEN && player.socket.PLAYFREE === true) {
			const m = Main.InvitationMessage('pong', () =>
				Main.getAllPlayerInvitations(player.username)
			);
			if (m !== player.prevInvitations) {
				player.prevInvitations = m;
				player.socket.send(m);
			}
		}
	});
}

export function sendPool() {
	Main.repository.players.forEach((player) => {
		if (player.socket.OPEN && player.socket.PLAYFREE === true) {
			const m = Main.PoolMessage('pong', () => Main.getPool(player.username));
			if (m !== player.prevPool) {
				player.socket.send(m);
				player.prevPool = m;
			}
		}
	});
}
