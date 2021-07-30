require("dotenv").config();
const { CreateApp } = require("./app");
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
(async () => {
  const app = await CreateApp(JWT_SECRET, DATABASE_URL);
  app.listen(process.env.PORT || 3000);
})();
