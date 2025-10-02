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
    findAllUsernames() 
    {
        return this.db.prepare('SELECT username FROM users').all();
    } 

    createUser(email, username ,password)
    {
        const created_at = Date.now()
        return this.db.prepare(`
            INSERT INTO users (email, username, password, created_at) 
            VALUES (?, ?, ?, ?)
        `).run(email, username, password, created_at);
    }

    getUserById(id) 
    {
        return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }
    // updatePasswordByEmail (email , newPassword)
    // {
    //     return this.db.prepare ('UPDATE users SET password=? WHERE email = ?').run(newPassword, email);
    // }

    updatePasswordByUsername (username , newPassword)
    {
        return this.db.prepare ('UPDATE users SET password=? WHERE username = ?').run(newPassword, username);
    }

    updateUsername (username, newusername)
    {    
        return this.db.prepare('UPDATE users SET username=?  WHERE username = ?').run(newusername, username);
    }

    updateBio(username, bio) 
    {
        return this.db.prepare('UPDATE users SET bio=?  WHERE username = ?').run(bio, username);
    }

    updateTwoFa(username, activeState) 
    {
		return this.db.prepare('UPDATE users SET twofa=?  WHERE username = ?').run(Number(activeState), username);
    }
    
    updateAvatarurl(username, avatarUrl) 
    {

        return this.db.prepare('UPDATE users SET avatar_url=?  WHERE username = ?').run(avatarUrl, username);
    }

    verifyUser (username)
    {
        return this.db.prepare('UPDATE users SET is_verified=TRUE WHERE username=?').run(username);
    }

    deleteByUsername (username) {
        return this.db.prepare('DELETE FROM Users WHERE username = ?').run([ username ]);
    }
};


export default UserRepository;