export const contestantsSql = `CREATE TABLE IF NOT EXISTS Contestants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	alias TEXT NOT NULL,
    player_id INTEGER NOT NULL,
    tournament_id INTEGER NOT NULL,
    round_level DECIMAL DEFAULT 0.0,
    FOREIGN KEY (player_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(id) ON DELETE CASCADE
);
`;
