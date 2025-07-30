class GameRepository
{
    constructor(db)
    {
        this.db = db;
    }
    addGamePong(userid, opponentid, userscore, opponentscore, gamedate)
    {
        let winner_id = userid;
        if (opponentscore > userscore)
            winner_id = opponentid;
        return this.db.prepare(`
            INSERT INTO Pongs 
            (user_id, opponent_id, user_score, opponent_score, game_date, winner_id)
            VALUES (?, ?, ?, ?, ?, ?)`)
            .run(userid, opponentid, userscore, opponentscore, gamedate, winner_id);
    }

    addGameDoom(userid, opponentid, userscore, opponentscore, gamedate)
    {
        let winner_id = userid;
        if (opponentscore > userscore)
            winner_id = opponentid;
        return this.db.prepare(`
            INSERT INTO Pongs 
            (user_id, opponent_id, user_score, opponent_score, game_date, winner_id)
            VALUES (?, ?, ?, ?, ?, ?)`)
            .run(userid, opponentid, userscore, opponentscore, gamedate, winner_id);
    }

    getTotalPongGamesById(id)
    {
        return this.db.prepare(`
            SELECT COUNT (*) AS total
            FROM Pongs WHERE user_id = ? OR  opponent_id = ?`).get(id, id).total;
    }

    getTotalGamesDoomById(id)
    {
        return this.db.prepare(`
            SELECT COUNT (*) AS total
            FROM Dooms WHERE user_id = ? OR  opponent_id = ?`).get(id, id).total;
    }

    getTotalWinsPongById(id)
    {
        return this.db.prepare(`
        SELECT COUNT (*) AS total
        FROM Pongs WHERE (Pongs.winner_id = ?)
        `).get(id).total;
    }

    getTotalWinsDoomById(id)
    {
        return this.db.prepare(`
        SELECT COUNT (*) AS total
        FROM Dooms WHERE (Dooms.winner_id = ?)
        `).get(id).total;
    }

    getTotalLossesPongById(id)
    {
        return this.db.prepare(`
        SELECT COUNT (*) AS total
        FROM Pongs WHERE (user_id = ? AND user_score < opponent_score)
        OR (opponent_id = ? AND opponent_score < user_score)
        `).get(id, id).total;
    }

    getHistoryUserPong(id)
    {
        return this.db.prepare(`SELECT
        player.id AS user_id,
        player.username AS user_username,
        player.avatar_url AS player_avatar_url,
        opponent.username AS opponent_username,
        opponent.avatar_url AS opponent_avatar_url,
        p.user_score,
        p.opponent_score,
        p.game_date
        FROM Pongs p
        JOIN users player ON player.id = p.user_id OR player.id = p.opponent_id
        JOIN users opponent 
        ON (opponent.id = CASE 
                        WHEN player.id = p.user_id THEN p.opponent_id
                        ELSE p.user_id
                        END)
        WHERE player.id = ?`).all(id);
    }

    getHistoryUserDoom(id)
    {
        return this.db.prepare(`SELECT
        player.id AS user_id,
        player.username AS player_username,
        player.avatar_url AS player_avatar_url,
        opponent.username AS opponent_username,
        opponent.avatar_url AS opponent_avatar_url,
        p.game_date,
        CASE
            WHEN player.id = p.winner_id THEN TRUE
            ELSE FALSE
        END AS is_winnner
        FROM dooms p
        JOIN users player ON player.id = p.user_id OR player.id = p.opponent_id
        JOIN users opponent 
            ON (opponent.id = CASE 
                            WHEN player.id = p.user_id THEN p.opponent_id
                            ELSE p.user_id
                          END)
        WHERE player.id = ?`).all(id);
    }

    getLeaderBoardPong()
    {
        return this.db.prepare(`        
            SELECT users.id, users.username, users.avatar_url,
            COUNT (*) AS winns
            FROM Pongs
            JOIN users ON users.id = winner_id
            GROUP BY users.id
            ORDER BY winns DESC
            `).all();
    }

    getLeaderBoardDoom()
    {
        return this.db.prepare(`        
            SELECT users.id, users.username, users.avatar_url,
            COUNT (*) AS winns
            FROM Doom
            JOIN users ON users.id = winner_id
            GROUP BY users.id
            ORDER BY winns DESC
            `).all();
    }
}

export default GameRepository;