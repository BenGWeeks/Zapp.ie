# Server

This is the server for the ZapVibes project. It is a Node.js server using Express and SQLite.

Before running the server, you need to create a `.env` file in the root directory of the server. This file should contain the following environment variables:

- `ZEBEDEE_API_KEY`: Your Zebedee API key.
- `ZEBEDEE_API_ENDPOINT`: The Zebedee API endpoint.

Here is an example of what your `.env` file might look like:

```
ZEBEDEE_API_KEY="your-api-key"
ZEBEDEE_API_ENDPOINT="https://sandbox-api.zebedee.io/v0/wallet"
```

## Running the server

To start the server, navigate to the server directory and run the following command:

```bash
node server.js
```

This will start the server on port 3001.

## Stopping the server

If the server doesn't stop, you can see what is running by using:

```
ps aux | grep "node server.js"
```

Then you can use:

```
kill -9 <PID>
```

## API Endpoints

The server has the following API endpoints:

- `GET /users`: Returns a list of all users.
- `POST /users`: Creates a new user.
- `GET /zebedee/balance`: Returns the balance of the Zebedee wallet.
