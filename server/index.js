require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { UniqueConstraintError } = require("sequelize");
const sequelize = require("./db");
const User = require("./models/User");
const { AUTH_ERRORS } = require("./constants/messages");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
  password.length >= 14 &&
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET || "dev-only-session-secret";

app.set("trust proxy", 1);
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: SESSION_TTL_MS,
    },
  })
);

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at ?? user.createdAt,
  };
}

app.post("/api/register", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: AUTH_ERRORS.MISSING_FIELDS });
  }

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).json({ error: AUTH_ERRORS.INVALID_FORMAT });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: passwordHash });
    req.session.userId = user.id;
    await saveSession(req);

    return res.status(201).json({ success: true, user: serializeUser(user) });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({ error: AUTH_ERRORS.EMAIL_ALREADY_EXISTS });
    }

    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

app.post("/api/login", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: AUTH_ERRORS.MISSING_FIELDS });
  }

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).json({ error: AUTH_ERRORS.INVALID_FORMAT });
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

    req.session.userId = user.id;
    await saveSession(req);

    return res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

app.get("/api/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: AUTH_ERRORS.UNAUTHORIZED });
    }

    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: AUTH_ERRORS.UNAUTHORIZED });
    }

    return res.json({ user: serializeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

app.post("/api/logout", async (req, res) => {
  try {
    await destroySession(req);
    res.clearCookie("connect.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
    });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

const PORT = process.env.SERVER_PORT || 3001;

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
