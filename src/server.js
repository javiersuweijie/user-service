require("dotenv").config();
const { CreateApp } = require("./app");
(async () => {
  const app = await CreateApp();
  app.listen(process.env.PORT || 3000);
})();
