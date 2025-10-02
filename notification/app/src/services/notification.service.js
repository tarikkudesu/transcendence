export class NotificationService
{
    constructor(repository) {
        this.repository = repository;
    }

    addNotification(notification)
    {
        const { event, sender, receiver, date, stat } = notification
        this.repository.insert(event, sender, receiver, date, stat)
    }

    deleteNotification(id) {
        this.repository.delete(id);
    }

    getNotificationByUsername(receiver) {
        return this.repository.findByreceiver(receiver);
    }
}
