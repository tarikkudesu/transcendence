import amqplib from 'amqplib';
import fp from 'fastify-plugin';
import { config } from '../config/env.config.js';

export default fp(async (fastify) => {
	try {
		const connection = await amqplib.connect(config.servers.rabbitmq);
		const channel = await connection.createChannel();

		await channel.assertExchange("user.events", "fanout", { durable: true });
		const uGameQueue = await channel.assertQueue("user-game-queue", { durable: true });
		await channel.bindQueue(uGameQueue.queue, "user.events", "");

		fastify.decorate('mq', {
			connection,
			channel,
			uGameQueue
		});
		fastify.addHook('onClose', () => {
			channel.close();
			connection.close();
		});
	} catch (error) {
		console.log(error);
	}
});
