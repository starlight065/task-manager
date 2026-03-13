const sequelize = require("./db");
require("./models/Task");
const { env } = require("./config/env");
const { createSessionStore } = require("./config/session");
const { createApp } = require("./app");

sequelize
  .authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => {
    const sessionStore = createSessionStore(sequelize);

    return sessionStore.sync({ alter: true }).then(() => sessionStore);
  })
  .then((sessionStore) => {
    const app = createApp({ sessionStore });

    console.log("Connected to database");
    app.listen(env.serverPort, () => console.log(`Server running on port ${env.serverPort}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
