const express = require("express");
const bcrypt = require("bcrypt");
const { UniqueConstraintError } = require("sequelize");
const { AUTH_ERRORS } = require("../constants/messages");
const User = require("../models/User");
const {
  getCredentialsFromRequest,
  hasValidCredentials,
} = require("../utils/authValidation");
const { serializeUser } = require("../utils/serializeUser");
const {
  clearSessionCookie,
  destroySession,
  getAuthenticatedUser,
  signInUser,
} = require("../services/sessionService");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = getCredentialsFromRequest(req);

  if (!email || !password) {
    return res.status(400).json({ error: AUTH_ERRORS.MISSING_FIELDS });
  }

  if (!hasValidCredentials(email, password)) {
    return res.status(400).json({ error: AUTH_ERRORS.INVALID_FORMAT });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: passwordHash });
    signInUser(req, user);

    return res.status(201).json({ success: true, user: serializeUser(user) });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({ error: AUTH_ERRORS.EMAIL_ALREADY_EXISTS });
    }

    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = getCredentialsFromRequest(req);

  if (!email || !password) {
    return res.status(400).json({ error: AUTH_ERRORS.MISSING_FIELDS });
  }

  if (!hasValidCredentials(email, password)) {
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

    signInUser(req, user);

    return res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

router.get("/me", async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: AUTH_ERRORS.UNAUTHORIZED });
    }

    return res.json({ user: serializeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

router.post("/logout", async (req, res) => {
  try {
    await destroySession(req);
    clearSessionCookie(res);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  }
});

module.exports = router;
