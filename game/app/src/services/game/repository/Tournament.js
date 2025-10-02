import { randomUUID } from 'crypto';
import * as Main from '../index.js';

export class Tournament {
	constructor(name, max, creator) {
		this.name = name;
		this.state = 'open';
		this.currentLevel = 0;
		this.creator = creator;
		this.date = Date.now();
		this.maxPlayers = max;
		this.matches = new Set();
		this.registeredPlayers = new Set();
	}
	register(username, alias) {
		if (this.registeredPlayers.size >= this.maxPlayers) throw new Error('Tournament is Full');
		if (alias.length >= 20) throw new Error('Alias must be 20 or less characters long');
		if (![...this.registeredPlayers].some((e) => e.username === username)) this.registeredPlayers.add({ alias, username, level: 0 });
		if (this.registeredPlayers.size === this.maxPlayers) this.state = 'playing';
	}
	createTournamentMatch(player, opponent) {
		const GID = randomUUID();
		this.matches.add({
			player: player.username,
			opponent: opponent.username,
			playerAlias: player.alias,
			opponentAlias: opponent.alias,
			finished: false,
			GID,
		});
		Main.repository.rooms.set(GID, new Main.Room(player.username, opponent.username, this.name));
	}
	levelup(player) {
		for (const p of this.registeredPlayers) if (p.username === player) p.level += 1;
	}
}

export function registerRoomResult(winner, key) {
	const tournament = Array.from(Main.repository.tournaments.values()).find((t) => [...t.matches].some((e) => e.GID === key));
	if (tournament) {
		tournament.matches.forEach((match) => {
			if (match.GID === key) {
				if (winner === match.player) tournament.levelup(match.player);
				else if (winner === match.opponent) tournament.levelup(match.opponent);
				tournament.matches.delete(match);
				return;
			}
		});
	}
}

export function newTournament(name, max, creator) {
	Main.repository.tournaments.set(creator, new Tournament(name, max, creator));
}
export function removeTournament(creator) {
	Main.repository.tournaments.delete(creator);
}
