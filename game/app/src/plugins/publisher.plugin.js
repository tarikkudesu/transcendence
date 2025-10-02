import { config } from '../config/env.config.js';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	try {
		fastify.decorate('publishInNotifQueue', async (data) => {
			await fastify?.mq?.channel.assertQueue(config.notification_queue);
			await fastify?.mq?.channel.sendToQueue(config.notification_queue, Buffer.from(JSON.stringify(data)));
		});
	} catch (error) {
		console.log(error);
	}
});
