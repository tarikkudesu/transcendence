import { config } from "../config/env.config.js";

export class FriendRepository
{
    constructor(db)
    {
        this.db = db;
    }

    insert(friend)
    {
        const query = `INSERT INTO friends (u_from, u_to, stat) VALUES (?, ?, ?)`;
        const params = [friend.u_from, friend.u_to, friend.stat];
        try {
            return this.db.prepare(query).run(params);
        } catch (error) {
            console.error("DB update error:", error.message, friend);
            return null;
        }
    }

    findAll()
    {
        try {
            return this.db.prepare('SELECT * FROM friends').all();
        } catch (error) {
            console.error("DB update error:", error.message);
            return null;
        }
    }

    findAllFriends(username) {
        const query = `
            SELECT u.username, u.avatar_url
            FROM users u
            JOIN friends f ON (u.username = f.u_from OR u.username = f.u_to)
            WHERE (f.u_from = ? OR f.u_to = ?)
                AND f.stat <> 'blocked'
                AND u.username <> ?
        `;
        try {
            let friends = this.db.prepare(query).all([username, username, username]);
            return friends;
        } catch (error) {
            console.error("DB update error:", error.message, username);
            return [];
        }
    }

    update(data) {
        const query = `UPDATE friends SET stat = ? WHERE u_from = ? AND u_to = ?`;
        const params = [data.stat, data.u_from, data.u_to];
        try {
            const result = this.db.prepare(query).run(params);
            return result;
        } catch (error) {
            console.error("DB update error:", error.message, data);
            return null;
        }
    }
    

    delete(u_from, u_to)
    {
        try {
            const query = `DELETE FROM friends WHERE u_from = ? OR u_to = ?`;
            const params = [u_from, u_to];
            const result = this.db.prepare(query).run(params);
            return result
        } catch (error) {
            console.error("DB update error:", error.message, { u_from, u_to } );
            return null;
        }
    }
    
    async findFriendShip(u_from, u_to)
    {
        try {
            const response = await fetch(`${config.servers.friend}/internal/friends?from=${u_from}&to=${u_to}`);
            if (!response.ok)
                return null;
            const friendship = await response.json();
            return friendship.friend; 
        } catch (error) {
            console.error("DB update error:", error.message, { u_from, u_to } );
            return null;
        }
    }
    
    async getUserByUsername(username)
    {
        try {
            const response = await fetch(`${config.servers.friend}/internal/users/${username}`);
            if (!response.ok)
				return null;
            return await response.json();
        } catch (error) {
            console.error("DB update error:", error.message, username);
            return null;
        }
    }
}



