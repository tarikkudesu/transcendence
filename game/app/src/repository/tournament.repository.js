class TournamentRepository {
	constructor(db) {
		this.db = db;
	}

	createTournament(userid, tournamentname, tournamentdate, max) {
		return this.db
			.prepare(
				`
				INSERT INTO Tournaments
				(user_id, tournament_name, tournament_date, max)
				VALUES (?, ?, ?, ?)`
			)
			.run(userid, tournamentname, tournamentdate, max);
	}

	updateTournamentWinner(tournamentname, winner_id) {
		return this.db
			.prepare(
				`
            UPDATE Tournaments
            SET winner_id = ?
            WHERE tournament_name = ?`
			)
			.run(winner_id, tournamentname);
	}

	findTournamentByUserId(user_id) {
		return this.db.prepare(`SELECT * FROM Tournaments WHERE user_id = ? AND state = 'l'`).get(user_id);
	}

	findTournamentById(id) {
		return this.db.prepare(`SELECT * FROM Tournaments WHERE id = ?`).get(id);
	}

	findTournamentByName(tournamentName) {
		return this.db.prepare(`SELECT * FROM Tournaments WHERE tournament_name = ?`).get(tournamentName);
	}

	getTournamentState(id) {
		const row = this.db
			.prepare(
				`
			SELECT state FROM Tournaments WHERE id = ? AND state = 'f';
		`
			)
			.get(id);
		return row ? true : false;
	}

	updateTournamentState(id) {
		const query = `
			UPDATE Tournaments 
			SET state = 'f'
			WHERE id = ?
		`;
		try {
			this.db.prepare(query).run([id]);
		} catch (error) {
			console.log(error);
		}
	}

	getTotalTournamentsWinns(id) {
		return this.db
			.prepare(
				`
			SELECT COUNT (*) AS total
        	FROM Tournaments
			WHERE Tournaments.winner_id = ? AND winner_id IS NOT NULL`
			)
			.get(id).total;
	}

	getTournamentsHistory(begin = 0, end = -1) {
		return this.db
			.prepare(
				`
			SELECT tournament_name, tournament_date, winner_id
			FROM Tournaments 
			WHERE winner_id IS NOT NULL
			ORDER BY tournament_date DESC
			LIMIT ?, ?
		`
			)
			.all([begin, end]);
	}
}

export default TournamentRepository;
