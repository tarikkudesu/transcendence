import amqplib from 'amqplib'
import fp  from 'fastify-plugin'
import { config } from '../config/env.config.js';

export default fp (
    async (fastify) => {
       try {
            const connection = await amqplib.connect (config.servers.rabbitmq);
            const channel = await connection.createChannel ();

            await channel?.assertExchange('user.events', 'fanout', { durable: true });
            const uFreindQueue =  await channel?.assertQueue("user-friend-queue", { durable: true });
            await channel?.bindQueue(uFreindQueue.queue, 'user.events', '');

            fastify.decorate ('mq', {
                connection,
                channel,
                uFreindQueue
            });
            fastify.addHook('onClose', () => {
                channel.close();
                connection.close();
            })
       } catch (error) {
            console.log(error);
       }
    }
)
