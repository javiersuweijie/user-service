const { CreateApp } = require("./app");
(async () => {
  const app = CreateApp();
  app.listen(3000);
})();
