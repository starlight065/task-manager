require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.database,
  process.env.username,
  process.env.password,
  {
    host: process.env.host,
    port: parseInt(process.env.port, 10),
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

module.exports = sequelize;
