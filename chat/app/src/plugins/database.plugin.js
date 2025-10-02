import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import { chatSql } from '../data/chat.sql.js';
import { config } from '../config/env.config.js';

export default fp(async (fastify) => {
	const db = new Database(config.db);
	try {
		db.exec(chatSql);
	} catch (error) {
		console.error(error);
	}
	fastify.decorate('db', db);
});
