require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const sequelize = require("./db");
const { createApp } = require("./app");

const PORT = process.env.SERVER_PORT || 3001;
const app = createApp();

sequelize
  .authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
