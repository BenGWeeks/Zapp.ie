-- Write your CREATE SQL statements here
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    nPub TEXT
);

CREATE TABLE rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    reward TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
