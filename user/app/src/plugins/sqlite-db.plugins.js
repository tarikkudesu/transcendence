import { config } from '../config/env.config.js';
import Database from 'better-sqlite3';
import fp from 'fastify-plugin';

import UserRepo from '../repository/user.repository.js';
import { userSql } from '../data/queries.sql.js';

export default fp (
    async (fastify) => 
    {
        const db = new Database (config.db);
        const  userRepo = new UserRepo (db); 

        try {
            db.exec (userSql);
        } catch (error) {
            console.log(error);
        }
        fastify.decorate ('db', db);
        fastify.decorate ('users_repo', userRepo);

    }  
)