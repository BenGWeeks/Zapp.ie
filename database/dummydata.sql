-- Principles
INSERT INTO principles (principle) VALUES ("We are transparent");
INSERT INTO principles (principle) VALUES ("We are knowledgeable");

-- Rewards
INSERT INTO rewards (title, description, amount) VALUES ("Secretlabs Magnus Pro Desk", "A high-quality desk for gaming and work", 500);
INSERT INTO rewards (title, description, amount) VALUES ("Samsung Odyssey G5 Screen", "A top-tier gaming monitor", 300);
INSERT INTO rewards (title, description, amount) VALUES ("Corsair ST50 Stand", "A sturdy stand for your headphones", 50);
-- Bounties
INSERT INTO bounties (title, description, amount, expiry_date, type) VALUES ("Become a Microsoft MVP", "Become a recognized expert in Microsoft technologies", 40000000, "2023-12-31", "Achievement");
INSERT INTO bounties (title, description, amount, expiry_date, type) VALUES ("Pass a Microsoft Certified: Power Platform Solution Architect", "Pass the certification exam for Power Platform Solution Architect", 1000000, "2023-12-31", "Certification");

-- Relays
INSERT INTO relays (name, address) VALUES ("Damus", "wss://relay.damus.io");

-- Users
INSERT INTO users (name, nPub) VALUES ("Ben Weeks", "npub1jutptdc2m8kgjmudtws095qk2tcale0eemvp4j2xnjnl4nh6669slrf04x");
