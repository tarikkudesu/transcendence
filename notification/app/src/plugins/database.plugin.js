import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import { NotificationRepository } from '../repositories/notification.repository.js';
import { config } from '../config/env.config.js';
import { notificationSql } from '../data/notification.sql.js';

export default fp(async (fastify) => {
    const db = new Database(config.db);
    const notificationRepo = new NotificationRepository (db);

    try {
        db.exec(notificationSql);
    } catch (error) {
        console.error('Error executing database schemas:', error);
    }
    
    fastify.decorate('db', db);
    fastify.decorate('notifRepo', notificationRepo);
});
