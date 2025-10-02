import * as Main from '../index.js';

export function sendTournament() {
	Main.repository.players.forEach((player) => {
		if (player.socket.OPEN) {
			const tournament = Array.from(Main.repository.tournaments.values()).find((t) =>
				[...t.registeredPlayers].some((e) => e.username === player.username)
			);
			let restriction = '';
			if (Main.repository.tournaments.size >= 4)
				restriction = 'The maximum of 4 active tournaments has been reached. Please try again after one has finished.';
			if (Main.repository.tournaments.has(player.socket.username)) restriction = 'You can only host one live tournament at a time.';
			if (!tournament) {
				const m = Main.TournamentMessage('pong', { ...Main.ClientTournament.instance, state: 'not registered', restriction });
				if (m !== player.prevTournament) {
					player.prevTournament = m;
					player.socket.send(m);
				}
			} else {
				let gid = '';
				const clientMatches = new Set();
				const { name, date, registeredPlayers, maxPlayers, matches, state, currentLevel } = tournament;
				matches.forEach((e) => {
					const { opponentAlias, playerAlias } = e;
					if (e.player === player.username || e.opponent === player.username) gid = e.GID;
					clientMatches.add({ player: e.player, opponent: e.opponent, finished: e.finished, playerAlias, opponentAlias });
				});
				const m = Main.TournamentMessage(
					'pong',
					new Main.ClientTournament({
						emptySlots: maxPlayers - registeredPlayers.size,
						nextMatches: [...clientMatches],
						results: [...registeredPlayers],
						round: currentLevel,
						registered: true,
						restriction,
						state,
						date,
						name,
						gid,
					})
				);
				if (m !== player.prevTournament) {
					player.prevTournament = m;
					player.socket.send(m);
				}
			}
		}
	});
	Main.repository.players.forEach((player) => {
		if (player.socket.OPEN) {
			const tournaments = [];
			Main.repository.tournaments.forEach((t) => {
				const { name, state, creator, date } = t;
				tournaments.push({ name, date, creator, state });
			});
			const message = Main.TournamentsMessage({ tournaments });
			if (message !== player.prevTournaments) {
				player.prevTournaments = message;
				player.socket.send(message);
			}
		}
	});
}

export function sendInvitations() {
	Main.repository.players.forEach((player) => {
		if (player.socket.OPEN) {
			const m = Main.InvitationMessage('pong', () => Main.getAllPlayerInvitations(player.username));
			if (m !== player.prevInvitations) {
				player.prevInvitations = m;
				player.socket.send(m);
			}
		}
	});
}

export function sendPool(amIAFriendOfHis) {
	Main.repository.players.forEach((player) => {
		if (player.socket.OPEN) {
			const m = Main.PoolMessage('pong', () => Main.getPool(player.username, amIAFriendOfHis));
			if (m !== player.prevPool) {
				player.socket.send(m);
				player.prevPool = m;
			}
		}
	});
}
