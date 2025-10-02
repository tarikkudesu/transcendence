export const chatSql = `
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    u_from TEXT NOT NULL,
    u_to TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    stat TEXT DEFAULT 'u',

    CHECK (stat IN ('d', 'u'))
);
`