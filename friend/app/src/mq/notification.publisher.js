import { config } from "../config/env.config.js";

export const notificationPublisher = async (fastify, data) => {
    await fastify.mq?.channel.assertQueue(config.notification_queue, { durable: true });
    await fastify.mq?.channel.sendToQueue(
        config.notification_queue,
        Buffer.from(
            JSON.stringify (data)
        ),
		{ persistent: true }
    );
}