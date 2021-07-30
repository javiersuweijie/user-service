const { Client } = require("pg");
const migration = `
-- Just a simple user table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name varchar(200) NOT NULL,
  email varchar(200) NOT NULL,
  password_hash varchar(200) NOT NULL
);

-- Creating a unique index on email to help us search fas
CREATE UNIQUE INDEX IF NOT EXISTS email_1 on users(email)
`;

async function connectToDb(connectionString) {
  const client = new Client({
    connectionString,
  });
  await client.connect();
  return client;
}

async function startMigration(client) {
  return client.query(migration);
}

async function truncateTables(client, tables) {
  for (const table of tables) {
    const query = `TRUNCATE TABLE FROM ${table};`;
    return client.query(query);
  }
}

async function dropDatabase(connectionString, databaseName) {
  const client = await connectToDb(connectionString);
  const query = `DROP DATABASE ${databaseName}`;
  await client.query(query);
  return client.end();
}

async function createDatabase(connectionString, databaseName) {
  const client = await connectToDb(connectionString);
  const query = `CREATE DATABASE ${databaseName}`;
  await client.query(query);
  return await client.end();
}

module.exports = {
  startMigration,
  truncateTables,
  createDatabase,
  dropDatabase,
  connectToDb,
};
