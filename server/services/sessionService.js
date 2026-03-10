const { sessionCookieConfig } = require("../config/session");
const User = require("../models/User");

function destroySession(req) {
  return new Promise((resolve, reject) => {
    // Removes the session record on the server during logout.
    req.session.destroy((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function signInUser(req, user) {
  // After login, store only the user's id in the session.
  req.session.userId = user.id;
}

function getSessionUserId(req) {
  // Later requests can read this id back from the session cookie.
  return req.session.userId;
}

async function getAuthenticatedUser(req) {
  // Turn the stored id into a full user record when a route needs it.
  const userId = getSessionUserId(req);
  if (!userId) {
    return null;
  }

  return User.findByPk(userId);
}

function clearSessionCookie(res) {
  // Also tell the browser to remove its session cookie after logout.
  res.clearCookie("connect.sid", {
    httpOnly: sessionCookieConfig.httpOnly,
    sameSite: sessionCookieConfig.sameSite,
    secure: sessionCookieConfig.secure,
    path: "/",
  });
}

module.exports = {
  clearSessionCookie,
  destroySession,
  getAuthenticatedUser,
  getSessionUserId,
  signInUser,
};
