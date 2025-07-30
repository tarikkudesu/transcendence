DROP TABLE IF EXISTS Tournaments;
DROP TABLE IF EXISTS Contestants;
DROP TABLE IF EXISTS Pongs;
DROP TABLE IF EXISTS Dooms;

CREATE TABLE Tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    winner_id INTEGER,
    tournament_date TEXT NOT NULL,
    tournament_name TEXT NOT NULL,
    FOREIGN KEY (winner_id) REFERENCES Users (id) ON DELETE CASCADE
);

CREATE TABLE Contestants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tournament_id INTEGER NOT NULL,
    round_level DECIMAL DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(id) ON DELETE CASCADE
);

CREATE TABLE Pongs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    tournament_id INTEGER,
    user_score INTEGER NOT NULL,
    opponent_score INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Dooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_id) REFERENCES Users(id) ON DELETE CASCADE
);
