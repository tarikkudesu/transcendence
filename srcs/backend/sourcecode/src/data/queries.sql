
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR (21) NOT NULL,
    avatar_url  TEXT DEFAULT 'image unavailable',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    bio  TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS  Tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    winner_id INTEGER NOT NULL,
    tournament_date TEXT NOT NULL,
    tournament_name TEXT NOT NULL,
    FOREIGN KEY (winner_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  Contestants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tournament_id INTEGER NOT NULL,
    round_level DECIMAL DEFAULT 0.0,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  Pongs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    tournament_id INTEGER,
    user_score INTEGER NOT NULL,
    opponent_score INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS  Dooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_id) REFERENCES users(id) ON DELETE CASCADE
);

