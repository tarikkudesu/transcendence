class TournamentRepository
{
    constructor(db)
    {
        this.db = db;
    }
    createTournament(tournamentname, tournamentdate, winnerid)
    {
        return this.db.prepare(`
            INSERT INTO Tournaments
            (tournament_name , tournament_date, winner_id)
            VALUES (?, ?, ?)`)
            .run(tournamentname, tournamentdate, winnerid);
    }
    findTournamentByName(tournamentName)
    {
        return this.db.prepare('SELECT * FROM Tournaments WHERE tournament_name = ?')
            .get(tournamentName);
    }

    getTotalTournamentsWinns(id)
    {
        return this.db.prepare(`SELECT COUNT (*) AS total
        FROM Tournaments WHERE Tournaments.winner_id = ?`).get(id).total;
    }

    getTournamentsHistory(id)
    {
        return this.db.prepare(`SELECT tournament_name, tournament_date, winner_id FROM Tournaments`).all();
    }
}


export default TournamentRepository;