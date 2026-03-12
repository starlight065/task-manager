const express = require("express");
const cors = require("cors");
const { createSessionMiddleware } = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

function createApp({ sessionStore }) {
  const app = express();

  if (!sessionStore) {
    throw new Error("Session store is required");
  }

  app.use(express.json());
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(createSessionMiddleware(sessionStore));
  app.use("/api", authRoutes);
  app.use("/api", taskRoutes);

  return app;
}

module.exports = { createApp };
