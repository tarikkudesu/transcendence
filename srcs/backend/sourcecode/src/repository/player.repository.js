class PlayerRepository
{
    constructor(db)
    {
        this.db = db;
    }
    addPlayer(userid, tournamentid, roundlevel = 0.0)
    {
        return this.db.prepare(`
            INSERT INTO Contestants 
            (user_id, tournament_id, round_level)
            VALUES (?, ?, ?)`)
            .run(userid, tournamentid, roundlevel);
    }

    getTotalTournamentsPlayed(id)
    {
        return this.db.prepare(`
        SELECT COUNT (*) AS total FROM Contestants WHERE Contestants.user_id = ?
        `).get(id).total;
    }
    findAllContestants(id)
    {
        return this.db.prepare(`
        SELECT  users.username, users.avatar_url, Contestants.round_level
        FROM Contestants
        JOIN users ON users.id = Contestants.user_id
        WHERE Contestants.tournament_id = ?`).all(id);
    }

    findAllMatches(id)
    {
        return this.db.prepare(`
          SELECT 
            user.username AS user,
            opponent.username AS opponent,
            p.user_score,
            p.opponent_score,
            p.game_date AS date
          FROM Pongs p
          JOIN Users user ON user.id = p.user_id
          JOIN Users opponent ON opponent.id = p.opponent_id
          WHERE p.tournament_id = ?;
        `).all(id);
    }

}


export default PlayerRepository;