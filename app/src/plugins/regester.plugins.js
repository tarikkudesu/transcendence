import fp from 'fastify-plugin';
import dbplugin from './sqlite-db.plugins.js';
import cors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import redisPlugin from './redis.plugin.js';
import amqpPlugin from "./amqp.plugin.js"

export default fp(async function registerPlugins(fastify) {
	await fastify.register(cors);
	await fastify.register(fastifyWebsocket);
	await fastify.register(dbplugin);
	await fastify.register(redisPlugin);
	await fastify.register(amqpPlugin);
});
