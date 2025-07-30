import { format } from 'date-fns';

class TournamentRepository {
	constructor(db) {
		this.db = db;
	}
	createTournament(tournamentname, tournamentdate) {
		return this.db
			.prepare(
				`
            INSERT INTO Tournaments
            (tournament_name , tournament_date)
            VALUES (?, ?)`
			)
			.run(tournamentname, format(new Date(tournamentdate), 'yyyy-MM-dd HH:mm:ss'));
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
	findTournamentByName(tournamentName) {
		return this.db.prepare(`SELECT * FROM Tournaments WHERE tournament_name = ?`).get(tournamentName);
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

	getTournamentsHistory() {
		return this.db
			.prepare(
				`
			SELECT tournament_name, tournament_date, winner_id
			FROM Tournaments 
			WHERE winner_id IS NOT NULL`
			)
			.all();
	}
}

export default TournamentRepository;
