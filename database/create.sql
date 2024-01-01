-- Write your CREATE SQL statements here
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    nPub TEXT,
    birthday TEXT,
    email TEXT
);

CREATE TABLE rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    amount INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE principles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    principle TEXT
);

CREATE TABLE zaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    amount INTEGER,
    principle_id INTEGER,
    description TEXT,
    date_sent TEXT,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id),
    FOREIGN KEY(principle_id) REFERENCES principles(id)
);
