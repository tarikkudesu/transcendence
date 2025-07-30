import { config } from '../config/env.config.js';
import Database from 'better-sqlite3';
import fp from 'fastify-plugin';
import fs from 'fs/promises';

import UserRepo from '../repository/user.repository.js';
import GameRepo from '../repository/game.repository.js';
import PlayerRepo from '../repository/player.repository.js';
import TournamentRepo from '../repository/tournament.repository.js'
import GameService  from '../services/game.service.js';


export default fp
(
    async (fastify) => 
    {
        const filePath = new URL ('../data/queries.sql', import.meta.url);
        const queries = await fs.readFile (filePath, 'utf-8');
        const db = new Database (config.db_path);
        
        const  userRepo = new UserRepo (db); 
        const gameRepo = new GameRepo (db);
        const playerRepo = new PlayerRepo (db);
        const tournamentRepo = new TournamentRepo (db);

        const gameService = new GameService(userRepo, gameRepo, playerRepo, tournamentRepo);

        db.pragma ('foreign_keys = ON');
        db.exec (queries);
        fastify.decorate ('db', db);
        fastify.decorate ('gameService', gameService);
    }  
)