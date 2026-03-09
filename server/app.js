const express = require("express");
const cors = require("cors");
const { createSessionMiddleware } = require("./config/session");
const authRoutes = require("./routes/authRoutes");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(createSessionMiddleware());
  app.use("/api", authRoutes);

  return app;
}

module.exports = { createApp };
