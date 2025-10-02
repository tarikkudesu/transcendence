export const notificationSql = `CREATE TABLE IF NOT EXISTS Notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    date TEXT NOT NULL,
    stat TEXT DEFAULT 'u',

    check (stat IN ('u', 'd'))    
);
`
