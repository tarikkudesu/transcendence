import amqplib from 'amqplib'
import fp  from 'fastify-plugin'
import { config } from '../config/env.config.js';

export default fp(async (fastify) => {
    let ch = null;
    try {
        const connection = await amqplib.connect(config.servers.rabbitmq);
        ch = await connection.createChannel();

        fastify.addHook('onClose', async () => {
            await ch?.close();
            await connection?.close();
        });
    } catch (error) {
        fastify.log.error('Failed to connect to RabbitMQ:', error);
    }

    const channel = {
        sendToQueue : async (data) => {
            try {
                await ch?.assertQueue(config.notification_queue);
                ch?.sendToQueue(
                    config.notification_queue,
                    Buffer.from(
                    JSON.stringify(data)
                    )
                )
            } catch (error) {
                console.log(error);
            }
        },

    }
    fastify.decorate('channel', channel);

});
