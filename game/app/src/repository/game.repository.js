class GameRepository {
	constructor(db) {
		this.db = db;
	}
	addGamePong(userid, opponentid, playerscore, opponentscore, winner_id, tournament_id, game_date) {
		return this.db
			.prepare(
				`
			INSERT INTO Pongs 
			(player_id, opponent_id, tournament_id, player_score, opponent_score, game_date, winner_id)
			VALUES (?, ?, ?, ?, ?, ?, ?)`
			)
			.run(userid, opponentid, tournament_id, playerscore, opponentscore, game_date, winner_id);
	}

	addGameDoom(userid, opponentid, winner_id, gamedate) {
		return this.db
			.prepare(
				`
			INSERT INTO Dooms 
			(player_id, opponent_id, game_date, winner_id)
			VALUES (?, ?, ?, ?)`
			)
			.run(userid, opponentid, gamedate, winner_id);
	}

	getTotalPongGamesById(id) {
		return this.db
			.prepare(
				`
			SELECT COUNT (*) AS total
			FROM Pongs WHERE player_id = ? OR  opponent_id = ?`
			)
			.get(id, id).total;
	}

	getTotalGamesDoomById(id) {
		return this.db
			.prepare(
				`
			SELECT COUNT (*) AS total
			FROM Dooms WHERE player_id = ? OR  opponent_id = ?`
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

	getHistoryUserPong(id, begin = 0, end = -1) {
		return this.db
			.prepare(
				`SELECT u1.id AS player_id,
						u1.username AS player_username,
						u1.avatar_url AS player_avatar_url,
						u2.id AS player_id,
						u2.username AS opponent_username,
						u2.avatar_url AS opponent_avatar_url,
						pongs.player_score,
						pongs.opponent_score,
						pongs.game_date
					FROM pongs
					JOIN users u1 ON u1.id = pongs.player_id
					JOIN users u2 ON u2.id = pongs.opponent_id
					WHERE u1.id = ? OR u2.id = ?
					ORDER BY game_date DESC
					LIMIT ?, ?	
			`)
			.all([id, id, begin, end]);
	}

	getHistoryUserDoom(id, begin = 0, end = -1) {
		return this.db
			.prepare(
				`SELECT
						player.id AS player_id,
						player.username AS player_username,
						player.avatar_url AS player_avatar_url,
						opponent.username AS opponent_username,
						opponent.avatar_url AS opponent_avatar_url,
						winner.username AS winner_username,
						d.game_date
					FROM Dooms d
					JOIN Users player	ON player.id = d.player_id
					JOIN Users opponent ON opponent.id = d.opponent_id
					JOIN Users winner	ON winner.id = d.winner_id
					WHERE player.id = ? OR opponent.id = ?
					LIMIT ?, ?	
			`)
			.all([id, id, begin, end]);
	}

	getLeaderBoardPong(from, limit) {
		return this.db
			.prepare(
				`		 
				SELECT users.id, users.username, users.avatar_url,
				COUNT (*) AS winns
				FROM Pongs
				JOIN users ON users.id = winner_id
				GROUP BY users.id
				ORDER BY winns DESC
				LIMIT ?, ?
			`
			)
			.all(from, limit);
	}

	getLeaderBoardDoom(from, limit) {
		return this.db
			.prepare(
				`		 
				SELECT users.id, users.username, users.avatar_url,
				COUNT (*) AS winns
				FROM Dooms
				JOIN users ON users.id = winner_id
				GROUP BY users.id
				ORDER BY winns DESC
				LIMIT ?, ?
			`
			)
			.all(from, limit);
	}
}

export default GameRepository;
