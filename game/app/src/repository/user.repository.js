class UserRepository {
	constructor(db) {
		this.db = db;
	}

	findUserByUsername(username) {
		return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
	}

	createUser(username, avatar_url) {
		return this.db.prepare('INSERT INTO users (username, avatar_url) VALUES (?, ?)').run(username, avatar_url);
	}

	findUserById(id) {
		return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
	}

	getUserAvatar(username) {
		return this.db.prepare('SELECT avatar_url FROM Users WHERE username = ?').run(username);
	}

	updateUsername(username, newusername) {
		return this.db.prepare('UPDATE users SET username=?  WHERE username = ?').run(newusername, username);
	}

	updateAvatarurl(username, avatarUrl) {
		return this.db.prepare('UPDATE users SET avatar_url=?  WHERE username = ?').run(avatarUrl, username);
	}
}

export default UserRepository;
