import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import { config } from '../config/env.config.js';
import { friendSql } from '../data/friend.sql.js';
import { UserRepository } from '../repositories/user.repository.js';
import { FriendRepository } from '../repositories/friend.repository.js';

export default fp(async (fastify) => {
    const db = new Database(config.db);
    const userRepo = new UserRepository (db);
    const friendRepo = new FriendRepository (db);

    try {
        db.exec(friendSql);
    } catch (error) {
        console.error('Error executing database schemas:', error);
    }

    fastify.decorate('db', db);
    fastify.decorate('users_repo', userRepo);
    fastify.decorate('friendRepo', friendRepo);
});
