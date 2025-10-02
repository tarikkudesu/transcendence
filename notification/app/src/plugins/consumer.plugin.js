import { config } from "../config/env.config.js";
import fp from 'fastify-plugin'

export default fp(async (fastify) => {

    fastify.decorate('waitForQueueNotifications', async (notificationController) =>
    {
        await fastify.channel.assertQueue(config.notification_queue);
        fastify.channel.consume( config.notification_queue, async (msg) => {
            if (msg) {
                try {
                    let notification = msg.content.toString();
                    notification = JSON.parse(notification);
                    const methodName = 'send'
                                    + notification?.service?.charAt(0)?.toUpperCase() 
                                    + notification?.service?.slice(1)?.toLowerCase();
                
                    if (typeof notificationController[methodName] === 'function') {
                        notificationController[methodName](notification)
                        fastify.channel.ack(msg);
                    }
                } catch (error) {
                    console.error("Error processing notification:", error);
                }
            }
        })
    })
});
