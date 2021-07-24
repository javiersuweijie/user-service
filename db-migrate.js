const { Client } = require("pg");
const DATABASE_URL = process.env.DATABASE_URL;
const client = new Client({
  connectionString: DATABASE_URL,
});

(async () => {
  client.on("connect", () => {
    console.log("Database is connected");
  });
  try {
    await client.connect();
    await client.query(`
    -- Just a simple user table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name varchar(200) NOT NULL,
      email varchar(200) NOT NULL,
      password_hash varchar(200) NOT NULL
    );
    
    -- Creating a unique index on email to help us search faster
    CREATE UNIQUE INDEX IF NOT EXISTS email_1 on users(email);
    `);
    console.log("Database migration completed");
  } catch (e) {
    console.log(e);
    console.log("Database migration failed");
  }
})();
