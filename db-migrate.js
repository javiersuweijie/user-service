const { Client } = require("pg");
const connectionString = "postgresql://postgres:password@localhost";
const client = new Client({
  connectionString,
});

(async () => {
  client.on("connect", () => {
    console.log("Database is connected");
  });
  try {
    await client.connect();
    console.log(await client.query(`DELETE FROM users;`));
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
    process.exit();
  } catch (e) {
    console.log(e);
    console.log("Database migration failed");
    process.exit(1);
  }
})();
