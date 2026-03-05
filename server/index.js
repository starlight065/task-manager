require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sequelize = require("./db");
const User = require("./models/User");
const { AUTH_ERRORS } = require("./constants/messages");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: AUTH_ERRORS.MISSING_FIELDS });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: AUTH_ERRORS.INVALID_CREDENTIALS });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: AUTH_ERRORS.INVALID_CREDENTIALS });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

const PORT = process.env.SERVER_PORT || 3001;

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
