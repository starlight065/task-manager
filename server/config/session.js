const session = require("express-session");
const sequelizeStoreFactory = require("connect-session-sequelize");
const { env } = require("./env");

// Keep signed-in users logged in for 30 days unless they log out earlier.
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const SESSION_CLEANUP_INTERVAL_MS = 1000 * 60 * 15;
const isProduction = env.nodeEnv === "production";
const SequelizeStore = sequelizeStoreFactory(session.Store);

// These cookie settings control how the browser stores the session id.
const sessionCookieConfig = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  maxAge: SESSION_TTL_MS,
};

function createSessionStore(sequelize) {
  return new SequelizeStore({
    db: sequelize,
    tableName: "sessions",
    checkExpirationInterval: SESSION_CLEANUP_INTERVAL_MS,
    expiration: SESSION_TTL_MS,
  });
}

function createSessionMiddleware(store) {
  return session({
    // The secret signs the session cookie so the browser cannot tamper with it.
    secret: env.sessionSecret,
    store,
    // Only save again when the session data actually changes.
    resave: false,
    // Do not create empty sessions for visitors who never log in.
    saveUninitialized: false,
    cookie: sessionCookieConfig,
  });
}

module.exports = {
  createSessionMiddleware,
  createSessionStore,
  sessionCookieConfig,
};
