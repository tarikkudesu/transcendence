class GameRepository {
	constructor(db) {
		this.db = db;
	}
	addGamePong(userid, opponentid, userscore, opponentscore, winner_id, tournament_id, game_date) {
		return this.db
			.prepare(
				`
            INSERT INTO Pongs 
            (user_id, opponent_id, tournament_id, user_score, opponent_score, game_date, winner_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`
			)
			.run(userid, opponentid, tournament_id, userscore, opponentscore, game_date, winner_id);
	}

	addGameDoom(userid, opponentid, winner_id, gamedate) {
		return this.db
			.prepare(
				`
            INSERT INTO Dooms 
            (user_id, opponent_id, game_date, winner_id)
            VALUES (?, ?, ?, ?)`
			)
			.run(userid, opponentid, gamedate, winner_id);
	}

	getTotalPongGamesById(id) {
		return this.db
			.prepare(
				`
            SELECT COUNT (*) AS total
            FROM Pongs WHERE user_id = ? OR  opponent_id = ?`
			)
			.get(id, id).total;
	}

	getTotalGamesDoomById(id) {
		return this.db
			.prepare(
				`
            SELECT COUNT (*) AS total
            FROM Dooms WHERE user_id = ? OR  opponent_id = ?`
			)
			.get(id, id).total;
	}

	getTotalWinsPongById(id) {
		return this.db
			.prepare(
				`
        SELECT COUNT (*) AS total
        FROM Pongs WHERE (Pongs.winner_id = ?)
        `
			)
			.get(id).total;
	}

	getTotalWinsDoomById(id) {
		return this.db
			.prepare(
				`
        SELECT COUNT (*) AS total
        FROM Dooms WHERE (Dooms.winner_id = ?)
        `
			)
			.get(id).total;
	}

	// getTotalLossesPongById(id)
	// {
	//     return this.db.prepare(`
	//     SELECT COUNT (*) AS total
	//     FROM Pongs WHERE (user_id = ? AND user_score < opponent_score)
	//     OR (opponent_id = ? AND opponent_score < user_score)
	//     `).get(id, id).total;
	// }

	getHistoryUserPong(id) {
		return this.db
			.prepare(
				`SELECT u1.id AS user_id,
						u1.username AS player_username,
						u1.avatar_url AS player_avatar_url,
						u2.id AS user_id,
						u2.username AS opponent_username,
						u2.avatar_url AS opponent_avatar_url,
						pongs.user_score,
						pongs.opponent_score
						FROM pongs
						JOIN users u1 ON u1.id = pongs.user_id
						JOIN users u2 ON u2.id = pongs.opponent_id
						WHERE u1.id = ? OR u2.id = ?
						ORDER BY game_date DESC`
			)
			.all(id, id);
	}

	getHistoryUserDoom(id) {
		return this.db
			.prepare(
				`SELECT
					player.id AS user_id,
					player.username AS player_username,
					player.avatar_url AS player_avatar_url,
					opponent.username AS opponent_username,
					opponent.avatar_url AS opponent_avatar_url,
					p.game_date,
					FROM dooms p
					JOIN users player ON player.id = p.user_id
					JOIN users opponent ON player.id = p.opponent_id
					WHERE player.id = ? OR opponent.id = ?`
			)
			.all(id, id);
	}

	getLeaderBoardPong() {
		return this.db
			.prepare(
				`        
            SELECT users.id, users.username, users.avatar_url,
            COUNT (*) AS winns
            FROM Pongs
            JOIN users ON users.id = winner_id
            GROUP BY users.id
            ORDER BY winns DESC
            `
			)
			.all();
	}

	getLeaderBoardDoom() {
		return this.db
			.prepare(
				`        
            SELECT users.id, users.username, users.avatar_url,
            COUNT (*) AS winns
            FROM Doom
            JOIN users ON users.id = winner_id
            GROUP BY users.id
            ORDER BY winns DESC
            `
			)
			.all();
	}
}

export default GameRepository;
