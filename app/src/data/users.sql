DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(15) NOT NULL UNIQUE,
    avatar_url  TEXT DEFAULT 'image unavailable',
    bio  TEXT DEFAULT ''
);

INSERT INTO Users (username, avatar_url, bio) VALUES
('furina', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar197.png', 'Furina is not considered an Archon, as she neither had access to the Hydro Archons Divine Throne nor disappeared when the current Hydro Dragons full elemental authority was returned. However, as far as Teyvat is concerned, Furina is considered to have served as Fontaines Archon and abdicated that role upon the prophecys resolution.'),
('ayoub', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar17.png', 'Expert strategist in Kingdoms of Valor.'),
('fatima', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar15.png', 'Master of puzzles in Brain Quest.'),
('youssef', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar75.png', 'Champion racer in Speed Legends.'),
('salma', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar14.png', 'Top explorer in Lost Realms.'),
('hamza', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar125.png', 'Guild leader in Epic Adventures.'),
('zineb', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar171.png', 'Mystery solver in Detective Story.'),
('khalid', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar70.png', 'PvP specialist in Arena Masters.'),
('imane', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar13.png', 'Creative builder in Block World.'),
('reda', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar100.png', 'Dungeon conqueror in Shadow Quest.'),
('sara', 'https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar90.png', 'Top scorer in Galaxy Blitz.');