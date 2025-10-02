export class NotificationRepository
{
    constructor(db)
    {
        this.db = db
    }

    insert(event, sender = 'tournament', receiver = 'all', date, stat = 'u')
    {
        this.db.prepare(`
            INSERT INTO Notifications (event, sender, receiver, date, stat)
            VALUES (?, ?, ?, ?, ?)
        `).run ([event, sender, receiver, date, stat]);
    }

    findByreceiver(receiver)
    {
        return this.db.prepare(`
            SELECT id, event, sender, receiver, date
            FROM Notifications
            WHERE receiver = ?
        `).all([receiver])
    }

    delete(id)
    {
        this.db.prepare(`
            DELETE FROM Notifications
            WHERE id = ?
        `).run([id]);
    }
}
