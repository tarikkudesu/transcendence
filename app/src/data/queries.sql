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

INSERT INTO Tournaments (winner_id, tournament_date, tournament_name) VALUES
(7, '2025-07-13', 'Tournament_1'),
(1, '2025-07-08', 'Tournament_2'),
(4, '2025-07-19', 'Tournament_3'),
(7, '2025-07-13', 'Tournament_4');

INSERT INTO Pongs (user_id, opponent_id, tournament_id, user_score, opponent_score, winner_id, game_date) VALUES
(8, 4, 2, 2, 7, 4, '2025-07-11'),
(9, 2, 1, 1, 7, 10, '2025-07-21'),
(5, 2, 3, 4, 7, 7, '2025-07-14'),
(2, 2, 3, 1, 7, 10, '2025-06-27'),
(1, 7, 2, 7, 5, 1, '2025-07-24'),
(7, 2, 4, 0, 7, 8, '2025-07-08'),
(2, 1, 2, 4, 7, 1, '2025-07-08'),
(4, 2, 1, 5, 7, 4, '2025-07-13'),
(10, 6, 2, 3, 7, 6, '2025-07-23'),
(8, 6, 2, 1, 7, 6, '2025-07-17');

