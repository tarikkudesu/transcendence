import fp from 'fastify-plugin';
import amqpPlugin from './amqp.plugin.js';
import fastifyMetrics from 'fastify-metrics';
import dbplugin from './sqlite-db.plugins.js';
import fastifyWebsocket from '@fastify/websocket';
import userConsumers from '../mq/user.consumer.js';
import publisherPlugin from './publisher.plugin.js';
import friendConsumer from '../mq/friend.consumer.js';

export default fp(async function registerPlugins(fastify) {
	await fastify.register(fastifyMetrics, {
		endpoint: '/metrics',
	});
	await fastify.register(fastifyWebsocket);
	await fastify.register(amqpPlugin);
	await fastify.register(publisherPlugin);
	await fastify.register(dbplugin);
	await userConsumers(fastify);
	await friendConsumer(fastify);
});
