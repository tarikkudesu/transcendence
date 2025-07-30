class UserRepository 
{
    constructor (db)
    {
        this.db = db;
    }

    findUserByEmail(email) 
    {
        return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }

    findUserByUsername(username) 
    {
        return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    } 

    createUser(email, username ,password)
    {
        return this.db.prepare('INSERT INTO users (email, username, password) VALUES (?, ?, ?)').run(email, username, password);
    }

    getUserById(id) 
    {
        return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }
    setPasswordByEmail (email , newPassword)
    {
        return this.db.prepare ('UPDATE users SET password=? WHERE email = ?').run(newPassword, email);
    }

    setPasswordByUsername (username , newPassword)
    {
        return this.db.prepare ('UPDATE users SET password=? WHERE username = ?').run(newPassword, username);
    }

    setUsername (username, newusername)
    {    
        return this.db.prepare('UPDATE users SET username=?  WHERE username = ?').run(newusername, username);
    }
    setAvatarurl(username, avatarUrl) 
    {
        return this.db.prepare('UPDATE users SET avatar_url=?  WHERE username = ?').run(avatarUrl, username);
    }
    setBio(username, bio) 
    {
        return this.db.prepare('UPDATE users SET bio=?  WHERE username = ?').run(bio, username);
    }
    verifyUser (username)
    {
        return this.db.prepare('UPDATE users SET is_verified=TRUE WHERE username=?').run(username);
    }
};


export default UserRepository;