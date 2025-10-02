import amqplib from 'amqplib'
import fp  from 'fastify-plugin'
import { config } from '../config/env.config.js';

export default fp (
    async (fastify) => {
        const connection = await amqplib.connect (config.servers.rabbitmq);
        const channel = await connection.createChannel ();

        fastify.decorate ('mq', {
            connection,
            channel,
        });
        fastify.addHook('onClose', () => {
            channel.close();
            connection.close();
        })
    }
)
