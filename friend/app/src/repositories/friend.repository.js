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
        return this.db.prepare(query).run(params);
    }

    findAll()
    {
        return this.db.prepare('SELECT * FROM friends').all();
    }

    findOne(u_from, u_to)
    {
        const query = `SELECT * FROM friends WHERE (u_from = ? AND u_to = ?) OR (u_from = ? AND u_to = ?)`;
        const params = [u_from, u_to, u_to, u_from];
        return this.db.prepare(query).get(params);
    }

    findAllFriends(username, begin = 0, end = -1) {
        const query = `
            SELECT u.username, u.avatar_url, stat
            FROM users u
            JOIN friends f ON (u.username = f.u_from OR u.username = f.u_to)
            WHERE (f.u_from = ? OR f.u_to = ?)
                AND u.username <> ?
            LIMIT ?, ?
        `;
        const params = [username, username, username, begin, end]
        let friends = this.db.prepare(query).all(params);
        return friends;
    }

    findBlocked(user, begin = 0, end = -1)
    {
        const query = `
            SELECT f.u_to AS username, u.avatar_url, f.stat
            FROM users u
            JOIN friends f ON u.username = f.u_from
            WHERE f.u_from = ?
				AND f.stat = 'blocked'
            LIMIT ?, ?
        `;
        const params = [user, begin, end];
        const data = this.db.prepare(query).all(params);
		return data;
    }

    findRequest(user, begin = 0, end = -1)
    {
        const query = `
            SELECT u.username, u.avatar_url, stat
            FROM users u
            JOIN friends f ON (u.username = f.u_from OR u.username = f.u_to)
            WHERE f.u_to = ?
                AND f.stat = 'pending'
                AND u.username <> ?
            LIMIT ?, ?
        `;
        const params = [user, user , begin, end];;
        return this.db.prepare(query).all(params);
    }

    update(data)
    {
        const query = `UPDATE friends SET stat = ?, u_from = ?, u_to = ? WHERE (u_from = ? AND u_to = ?) OR (u_from = ? AND u_to = ?)`;
        const params = [data.stat, data.u_from, data.u_to, data.u_from, data.u_to, data.u_to, data.u_from];
        return this.db.prepare(query).run(params);
    }

	updateUsername(username, newusername) {
		this.db.prepare('UPDATE Friends SET u_from=? WHERE u_from=?').run([newusername, username]);
		this.db.prepare('UPDATE Friends SET u_to=? WHERE u_to=?').run([newusername, username]);
	}


    delete(u_from, u_to)
    {
        const query = `DELETE FROM friends WHERE (u_from = ? AND u_to = ?) OR (u_from = ? AND u_to = ?)`;
        const params = [u_from, u_to, u_to, u_from];
        return this.db.prepare(query).run(params);
    }
}
