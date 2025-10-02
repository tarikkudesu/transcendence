export class UserRepository
{
    constructor(db)
    {
        this.db = db;
    }

    insert(data)
    {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const params = Object.values(data);

        const query = `INSERT INTO users (${columns}) VALUES (${placeholders})`;
        return this.db.prepare(query).run(params);
    }

    findAll()
    {
        const query = `SELECT * FROM users`;
        return this.db.prepare(query).all();
    }

    findOne(field)
    {
        const column = Object.keys(field)[0];
        const value = field[column];

        const query = `SELECT * FROM users WHERE ${column} = ?`;
        return this.db.prepare(query).get(value);
    }

    async update(field, data)
    {
        const column = Object.keys(field)[0];
        const params = [...Object.values(data), field[column]];
        const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');

        const query = `UPDATE users SET ${updates} WHERE ${column} = ?`;
        return this.db.prepare(query).run(params);
    }

    delete(field)
    {
        const column = Object.keys(field)[0];
        const value = field[column];
        const query = `DELETE FROM users WHERE ${column} = ?`;
        return this.db.prepare(query).run(value);
    }

    updateUsername(username, newusername) 
    {
        return this.db.prepare('UPDATE users SET username=?  WHERE username = ?').run(newusername, username);
    }

    updateAvatarurl(username, avatarUrl) 
    {
        return this.db.prepare('UPDATE users SET avatar_url=?  WHERE username = ?').run(avatarUrl, username);
    }

    createUser(username, avatar_url) 
    {
        return this.db.prepare('INSERT INTO users (username, avatar_url) VALUES (?, ?)').run(username, avatar_url);
    }

    findByKeyword(authUser, keyword, begin = 0, end = -1)
    {
        return this.db.prepare(`
            SELECT username, avatar_url
            FROM Users
            WHERE username LIKE ? AND username <> ?
            LIMIT ?, ?    
        `)
        .all([`%${keyword}%`, authUser, begin, end]);
    }
}
