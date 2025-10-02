export const usersSql = `

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(15) NOT NULL UNIQUE,
    avatar_url  TEXT DEFAULT 'image unavailable',
    bio  TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS Friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    u_from TEXT NOT NULL,
    u_to TEXT NOT NULL
);
`
