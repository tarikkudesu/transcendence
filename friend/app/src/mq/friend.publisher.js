import { config } from "../config/env.config.js";

export const friendPublisher = async (fastify, data) => {
    await fastify.mq?.channel.assertQueue(config.friend_queue, { durable: true });
    await fastify.mq?.channel.sendToQueue(
        config.friend_queue,
        Buffer.from(
            JSON.stringify (data)
        ),
		{ persistent: true }
    );
}
