export class ChatRepository
{
    constructor(db)
    {
        this.db = db
    }

    insertMessage({ sender, receiver, message, date })
    {
        const query = `INSERT INTO messages(u_from, u_to, message, date) VALUES(?, ?, ?, ?)`
        try {
            this.db.prepare(query).run([sender, receiver, message, date])
        } catch (error) {
            console.log(error);
        }
    }

    update(from, to)
    {
        const query = `
            UPDATE messages 
            SET stat = 'd'
            WHERE u_from = ? AND u_to = ?
        `
        try {
            this.db.prepare(query).run([from, to])
        } catch (error) {
            console.log(error);
        }
    }

    findAll(sender, receiver)
    {
        const query = `
            SELECT u_from AS sender, u_to AS receiver, message, date
            FROM messages
            WHERE (u_from = ? AND u_to = ?)
                OR (u_from = ? AND u_to = ?)
        `
        try {
            const messages = this.db.prepare(query).all([sender, receiver, receiver, sender]);
            return messages;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    findMessage(from)
    {
        const query = `SELECT * FROM messages WHERE u_from = ?`
        try {
            return this.db.prepare(query).all(from)
        } catch (error) {
            console.log(error);
        }
    }

    findGroupMessages(to)
    {
        const query = `
            SELECT DISTINCT u_from AS friend FROM messages WHERE u_to = ?
            UNION
            SELECT DISTINCT u_to AS friend FROM messages WHERE u_from = ?
        `;
        try {
            const messages = this.db.prepare(query).all([ to, to ]);
            return messages;
        } catch (error) {
            console.log(error);
            return []
        }
    }

    findLastMessage(from, to)
    {
        const query = `
            SELECT u_from AS sender, u_to AS receiver, message, date
            FROM messages
            WHERE (u_to = ? AND u_from = ?) OR (u_to = ? AND u_from = ?)
            ORDER BY id DESC
            LIMIT 1
        `;
        try {
            const message = this.db.prepare(query).get([to, from, from, to]);
            return message;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}
