import { config } from '../config/env.config.js';
import Database from 'better-sqlite3';
import fp from 'fastify-plugin';

import UserRepo from '../repository/user.repository.js';
import GameRepo from '../repository/game.repository.js';
import PlayerRepo from '../repository/player.repository.js';
import TournamentRepo from '../repository/tournament.repository.js';
import GameService from '../services/game.service.js';
import { FriendRepository } from '../repository/friend.repositoy.js';
import { usersSql } from '../data/users.sql.js';
import { tournamentSql } from '../data/tournaments.sql.js';
import { pongsSql } from '../data/pongs.sql.js';
import { contestantsSql } from '../data/contestants.sql.js';
import { doomsSql } from '../data/dooms.sql.js';

export default fp(async (fastify) => {
	let db;
	try {
		db = new Database(config.db);
		db.exec(usersSql);
		db.exec(tournamentSql);
		db.exec(pongsSql);
		db.exec(contestantsSql);
		db.exec(doomsSql);
	} catch (err) {
		console.log(err);
	}

	db.pragma('foreign_keys = ON');
	const userRepo = new UserRepo(db);
	const gameRepo = new GameRepo(db);
	const playerRepo = new PlayerRepo(db);
	const tournamentRepo = new TournamentRepo(db);
	const friendRepository = new FriendRepository(db);

	const gameService = new GameService(fastify, userRepo, gameRepo, playerRepo, tournamentRepo, friendRepository);

	fastify.decorate('db', db);
	fastify.decorate('gameService', gameService);
	fastify.decorate('users_repo', userRepo);
	fastify.decorate('friendRepo', friendRepository);
});
