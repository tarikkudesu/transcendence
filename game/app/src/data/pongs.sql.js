export const pongsSql = `CREATE TABLE IF NOT EXISTS Pongs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    tournament_id INTEGER,
    player_score INTEGER NOT NULL,
    opponent_score INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES Users(id) ON DELETE CASCADE
);
`;
