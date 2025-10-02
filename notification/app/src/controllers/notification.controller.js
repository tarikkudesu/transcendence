import getTemplate from "../utils/getTemplate.js";

export class NotificationController
{
    constructor(fastify, notificationService)
    {
        this.connections = new Map();
        this.fastify = fastify;
        this.notificationService = notificationService;
    }

    socketHandler(connection, request)
    {
        const username = request.headers['x-auth-user'];
		if (username)
		{
            if (this.connections.has(username))
            {
                connection.close();
                return ;
            }
			this.#addConnection(username, connection);
			this.#fetchNotification(username);
			connection.on('message', (msg) =>  this.#processMesasge(username, msg));
			connection.on('close', () => this.#removeConnection(connection.username));
			connection.on('error', (err) => console.log(err));
		}
		else connection.close();
    }

    #processMesasge(username, message)
    {
        try {
            message = message.toString();
            message = JSON.parse(message);
            if (message?.id)
                this.notificationService.deleteNotification(message.id);	
            this.#fetchNotification(username);
        } catch (error) {
            console.log(error);
        }
    }

    #addConnection(username, connection)
    {
        connection.username = username
        this.connections.set(username, connection);
    }

    #removeConnection(username)
    {
        this.connections.delete(username);
    }

    #fetchNotification(username)
    {
        let notifications = this.notificationService.getNotificationByUsername(username);
		this.connections.get(username)?.send(JSON.stringify(notifications))
    }

    async sendMail(notification)
    {
        const html = await getTemplate(notification.type, notification.body);
        await this.fastify.mailer.sendMail({
            to: notification.to,
            subject: notification.subject,
            html
        });
    }

    sendChat(notification)
    {
        this.notificationService.addNotification(notification)
        if (this.connections.has(notification.receiver))
            this.#fetchNotification(notification.receiver);
    }
    
    sendFriend(notification)
    {
        this.notificationService.addNotification(notification)
        if (this.connections.has(notification.receiver))
            this.#fetchNotification(notification.receiver);
    }
    
    sendGame(notification)
    {
        this.notificationService.addNotification(notification)
        if (this.connections.has(notification.receiver)) {
            this.#fetchNotification(notification.receiver);
        }
    }

    sendTournament(notification)
    {
        for (const [_, tocket] of this.connections)
        {
            notification.receiver = tocket.username;
            this.notificationService.addNotification(notification)
            this.#fetchNotification(notification.receiver);
        }
    }
}
