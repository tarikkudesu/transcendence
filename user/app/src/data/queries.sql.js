export const userSql = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR (21) NOT NULL,
    avatar_url  TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    twofa BOOLEAN DEFAULT FALSE,
    bio  TEXT DEFAULT ''
);
`;
