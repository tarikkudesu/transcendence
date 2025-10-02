import amqplib from 'amqplib'
import fp  from 'fastify-plugin'
import { config } from '../config/env.config.js';

export default fp(async (fastify) => {
    try {
        const connection = await amqplib.connect(config.servers.rabbitmq);
        const channel = await connection.createChannel();

        await channel.assertQueue(config.notification_queue);
        fastify.decorate('channel', channel);

        fastify.addHook('onClose', async () => {
            await channel.close();
            await connection.close();
        });
    } catch (error) {
        fastify.log.error('Failed to connect to RabbitMQ:', error);
    }
});