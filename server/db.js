const { Sequelize } = require("sequelize");
const { env } = require("./config/env");

const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);

module.exports = sequelize;
