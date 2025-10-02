import amqplib from 'amqplib'
import fp from 'fastify-plugin'
import { config } from '../config/env.config.js'

export default fp(async (fastify) =>
{
    const connection = await amqplib.connect(config.servers.RABBITMQ);
    const channel = await connection.createChannel(); 
    fastify.decorate('sendToQueue', async (queue, data) => {
        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    });

    fastify.addHook('onClose', async () => {
        await channel.close();
        await connection.close();
    });
});