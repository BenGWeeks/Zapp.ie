import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
import cors from 'cors';
import pkg from 'sqlite3';
const { verbose } = pkg;
const sqlite3 = verbose();
import fetch from 'node-fetch';
const app = express();
app.use(cors());
const port = 3001;

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');

  startServer();
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

app.get('/zebedee/balance', async (req, res) => {
  const apiKey = process.env.ZEBEDEE_API_KEY;
  const apiEndpoint = process.env.ZEBEDEE_API_ENDPOINT;
  console.log(`Received request to /zebedee/balance with API key: ${apiKey}`);
  const response = await fetch(`${apiEndpoint}`, {
    headers: {
      //'Content-Type': 'application/json',
      'apikey': `${apiKey}`,
    },
  });
  console.log(`Received response from Zebedee API: ${JSON.stringify(response, null, 2)}`);
  const data = await response.json();
  console.log(`Parsed data from response: ${JSON.stringify(data, null, 2)}`);
  res.send(data.balance);
});

app.get('/lightning-address/:nPub', async (req, res) => {
  const nPub = req.params.nPub;
  // Connect to the default Relay
  // This assumes that there is a function getRelay() that returns the default Relay
  const relay = getRelay();
  // Determine the Lightning Address using the nostr protocol
  // This assumes that there is a function getLightningAddress(nPub, relay) that returns the Lightning Address
  const lightningAddress = getLightningAddress(nPub, relay);
  res.send(lightningAddress);
});

function startServer() {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
