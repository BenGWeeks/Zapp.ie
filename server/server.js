const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(cors());
const port = 3001;

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');

  db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, nPub TEXT)`, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Created users table');
  });
});

app.use(express.json());

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.post('/users', (req, res) => {
  const { name, nPub } = req.body;
  db.run(`INSERT INTO users(name, nPub) VALUES(?, ?)`, [name, nPub], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.send({ id: this.lastID, name, nPub });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
