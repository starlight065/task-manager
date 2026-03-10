const session = require("express-session");

// Keep signed-in users logged in for 30 days unless they log out earlier.
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET || "dev-only-session-secret";

// These cookie settings control how the browser stores the session id.
const sessionCookieConfig = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  maxAge: SESSION_TTL_MS,
};

function createSessionMiddleware() {
  return session({
    // The secret signs the session cookie so the browser cannot tamper with it.
    secret: sessionSecret,
    // Only save again when the session data actually changes.
    resave: false,
    // Do not create empty sessions for visitors who never log in.
    saveUninitialized: false,
    cookie: sessionCookieConfig,
  });
}

module.exports = {
  createSessionMiddleware,
  sessionCookieConfig,
};
