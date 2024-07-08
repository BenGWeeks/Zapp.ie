# Zapp.ie

Zapp.ie is a web application that allows users to interact with LNBits. It provides an interface for users to manage their lightning wallet and view their balance. The application is divided into a client and a server. The client is a React application that communicates with the server. The server is a Node.js application that interacts with the Zebedee API.

## Technical Overview

Zapp.ie is built using React for the frontend and Node.js for the backend. It uses the Zebedee API to interact with the Bitcoin Lightning Network. The application is divided into several pages, including a feed, leaderboard, and bounties page. The feed page displays the latest zaps, the leaderboard page shows the top users, and the bounties page lists all active bounties and a history of awards.

## Design

The design of Zapp.ie can be viewed on [Figma](https://www.figma.com/file/i0GdiVa7Dgu1FVSNwhBpjZ/ZapVibes?type=design&node-id=1%3A16&mode=design&t=rAkAWG7TVUXqLjfH-1).

## What It Does

Zapp.ie allows users to manage their lightning wallet and view their balance. Users can also view the latest zaps, see the top users on the leaderboard, and view all active bounties and a history of awards.

## Nostr Lightning Zaps

Zapp.ie uses Nostr to send and receive zaps over the Bitcoin Lightning Network. A zap is a small amount of Bitcoin that is sent over the Lightning Network. Users can send zaps to each other as a way of tipping or rewarding each other.

## Components of the Solution

### Client

The client is a React application that provides the user interface for ZapVibes. It communicates with the server to fetch data and perform actions. The client is divided into several pages, including a feed, leaderboard, and bounties page.

For more information about the client, see the [client README](client/README.md).

### Server

The server is a Node.js application that interacts with the Zebedee API and the database. It handles requests from the client and performs actions such as fetching data, updating the database, and interacting with the Bitcoin Lightning Network.

For more information about the server, see the [server README](server/README.md).

### Database

The database stores data related to users, zaps, bounties, and rewards. It is used by the server to persist data and retrieve it when needed.

For more information about the database, see the [database README](database/README.md).


