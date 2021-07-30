const { Client } = require("pg");
const { connectToDb, startMigration } = require("./index");
const DATABASE_URL = process.env.DATABASE_URL;

(async () => {
  try {
    const client = await connectToDb(DATABASE_URL);
    client.on("connect", () => {
      console.log("Database is connected");
    });
    await startMigration(client);
    await client.end();
    console.log("Database migration completed");
  } catch (e) {
    console.log(e);
    console.log("Database migration failed");
  }
})();
