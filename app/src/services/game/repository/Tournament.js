import { adjectives, starWars, uniqueNamesGenerator } from 'unique-names-generator';
import * as Main from '../index.js';
import { randomUUID } from 'crypto';

export class Tournament {
	constructor() {
		this.name = '';
		this.due_date = 0;
		this.state = 'new';
		this.maxPlayers = 4;
		this.currentLevel = 0;
		this.matches = new Set();
		this.registeredPlayers = new Set();
	}
}

function levelup(player) {
	for (const p of Main.repository.tournament.registeredPlayers) if (p.username === player) p.level += 1;
}

export function newTournament() {
	const customConfig = {
		dictionaries: [adjectives, starWars],
		separator: '-',
		length: 2,
	};
	const date = new Date();
	Main.repository.tournament.matches.clear();
	Main.repository.tournament.currentLevel = 0;
	Main.repository.tournament.state = 'not open';
	Main.repository.tournament.registeredPlayers.clear();
	Main.repository.tournament.name = uniqueNamesGenerator(customConfig);
	Main.repository.tournament.due_date = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes() + 1
	).getTime();
}

export function registerRoomResult(room, key) {
	Main.repository.tournament.matches.forEach((match) => {
		if (match.GID === key) {
			if (room.game) {
				if (room.game.winner === match.player) levelup(match.player);
				else levelup(match.opponent);
			}
			Main.repository.tournament.matches.delete(match);
			return;
		}
	});
}

/***************************************************************************************************************
 *                                        TOURNAMENT TABLE MANIPULATION                                        *
 ***************************************************************************************************************/
export function createTournamentMatch(player, opponent) {
	const GID = randomUUID();
	Main.repository.tournament.matches.add({
		player: player.username,
		opponent: opponent.username,
		playerAlias: player.alias,
		opponentAlias: opponent.alias,
		finished: false,
		GID,
	});
	Main.repository.rooms.set(GID, new Main.Room(player.username, opponent.username, Main.repository.tournament.name));
}
export function register(username, alias) {
	if (Date.now() < Main.repository.tournament.due_date) throw new Error('Registration is not open yet my friend');
	if (Main.repository.tournament.registeredPlayers.size >= Main.repository.tournament.maxPlayers) throw new Error('Tournament is Full');
	if (![...Main.repository.tournament.registeredPlayers].some((e) => e.username === username))
		Main.repository.tournament.registeredPlayers.add({ alias, username, level: 0 });
	if (Main.repository.tournament.registeredPlayers.size === Main.repository.tournament.maxPlayers)
		Main.repository.tournament.state = 'playing';
}
export function updateTournament(createTournament, addPlayerToTournament, updateTournamentWinner) {
	switch (Main.repository.tournament.state) {
		case 'new': {
			newTournament();
			createTournament({
				tournamentName: Main.repository.tournament.name,
				tournamentDate: Main.repository.tournament.due_date,
			});
			Main.repository.tournament.state = 'not open';
			break;
		}
		case 'not open': {
			if (Date.now() >= Main.repository.tournament.due_date) Main.repository.tournament.state = 'open';
			break;
		}
		case 'open': {
			break;
		}
		case 'playing': {
			[...Main.repository.tournament.matches].forEach((ele) => {
				if (ele.finished) Main.repository.tournament.matches.delete(ele);
			});
			if (Main.repository.tournament.matches.size === 0) {
				const winners = [...Main.repository.tournament.registeredPlayers]
					.filter((e) => e.level === Main.repository.tournament.currentLevel)
					.sort();
				if (winners.length === 1 || winners.length === 0) Main.repository.tournament.state = 'finished';
				else {
					Main.repository.tournament.matches.clear();
					for (let i = 0; i < winners.length; i++) {
						if (i + 1 < winners.length) {
							createTournamentMatch(winners[i], winners[i + 1]);
							i++;
						} else {
							Main.repository.tournament.levelup(winners[i].username);
						}
					}
					Main.repository.tournament.currentLevel += 1;
				}
			}
			break;
		}
		case 'finished': {
			let winner = '';
			let level = 0;
			for (const p of Main.repository.tournament.registeredPlayers)
				if (p.level > level) {
					level = p.level;
					winner = p.username;
				}
			for (const p of Main.repository.tournament.registeredPlayers)
				addPlayerToTournament({ username: p.username, tournamentName: Main.repository.tournament.name, roundLevel: p.level });
			updateTournamentWinner({ tournamentName: Main.repository.tournament.name, winner });
			Main.repository.tournament.state = 'new';
			break;
		}
	}
}
