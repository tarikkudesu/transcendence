export const doomsSql = `CREATE TABLE IF NOT EXISTS Dooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_id) REFERENCES Users(id) ON DELETE CASCADE
);
`;
