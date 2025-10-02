import { NotificationRepository } from "../repositories/notification.repository.js"
import { NotificationController } from "../controllers/notification.controller.js"
import { NotificationService } from "../services/notification.service.js"

export const routes = async ( fastify ) =>
{
    const notificationRepo = new NotificationRepository(fastify.db);
    const notificationService = new NotificationService(notificationRepo);
    const notificationController = new NotificationController(fastify, notificationService);

    await fastify.waitForQueueNotifications(notificationController);

    fastify.get('/subscribe', { websocket: true }, notificationController.socketHandler.bind(notificationController));
}
