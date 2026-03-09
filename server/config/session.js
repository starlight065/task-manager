const session = require("express-session");

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET || "dev-only-session-secret";

const sessionCookieConfig = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  maxAge: SESSION_TTL_MS,
};

function createSessionMiddleware() {
  return session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: sessionCookieConfig,
  });
}

module.exports = {
  createSessionMiddleware,
  sessionCookieConfig,
};
