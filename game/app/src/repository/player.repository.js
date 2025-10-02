class PlayerRepository {
	constructor(db) {
		this.db = db;
	}

	addPlayer(userid, tournamentid, roundlevel = 0.0, alias) {
		return this.db
			.prepare(
				`
            INSERT INTO Contestants 
            (alias, player_id, tournament_id, round_level)
            VALUES (?, ?, ?, ?)`
			)
			.run(alias, userid, tournamentid, roundlevel);
	}

	getTotalTournamentsPlayed(id) {
		return this.db
			.prepare(
				`
        SELECT COUNT (*) AS total FROM Contestants WHERE Contestants.player_id = ?
        `
			)
			.get(id).total;
	}

	findAllContestants(id) {
		return this.db
			.prepare(
				`
        SELECT  users.username, users.avatar_url, Contestants.round_level, Contestants.alias
        FROM Contestants
        JOIN users ON users.id = Contestants.player_id
        WHERE Contestants.tournament_id = ?`
			)
			.all(id);
	}

	findAllMatches(id) {
		return this.db
			.prepare(
				`
          SELECT 
            user.username AS user,
            opponent.username AS opponent,
            p.player_score,
            p.opponent_score,
            p.game_date AS date
          FROM Pongs p
          JOIN Users user ON user.id = p.player_id
          JOIN Users opponent ON opponent.id = p.opponent_id
          WHERE p.tournament_id = ?;
        `
			)
			.all(id);
	}
}

export default PlayerRepository;
