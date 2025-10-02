export class FriendRepository {
	constructor(db) {
		this.db = db;
	}

	countFriendship(u_from, u_to) {
		const res = this.db
			.prepare(
				`
            SELECT COUNT(id) as count
            FROM Friends
            WHERE (u_from = ? AND u_to = ?)
            OR (u_from = ? AND u_to = ?)
        `
			)
			.get(u_from, u_to, u_to, u_from);
		return res;
	}

	insertFriendship(u_from, u_to) {
		return this.db.prepare('INSERT INTO Friends (u_from, u_to) VALUES (?, ?)').run([u_from, u_to]);
	}

	updateUsername(username, newusername) {
		this.db.prepare('UPDATE Friends SET u_from=? WHERE u_from=?').run([newusername, username]);
		this.db.prepare('UPDATE Friends SET u_to=? WHERE u_to=?').run([newusername, username]);
	}

	delete(u_from, u_to) {
		return this.db.prepare('DELETE FROM Friends WHERE (u_from = ? AND u_to = ?) OR (u_from = ? AND u_to = ?)').run(u_from, u_to, u_to, u_from);
	}
}
