require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const sequelize = require("./db");
require("./models/Task");
const { createSessionStore } = require("./config/session");
const { createApp } = require("./app");

const PORT = process.env.SERVER_PORT || 3001;

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
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
