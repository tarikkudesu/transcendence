
export const tournamentSql = `CREATE TABLE IF NOT EXISTS Tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    max INTEGER,
    user_id INTEGER,
    winner_id INTEGER,
    tournament_date TEXT NOT NULL,
    tournament_name TEXT NOT NULL,
    state TEXT DEFAULT 'l',

    CHECK (state IN ('l', 'f')),
    FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES Users (id) ON DELETE CASCADE
);
`
