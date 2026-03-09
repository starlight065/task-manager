const { sessionCookieConfig } = require("../config/session");
const User = require("../models/User");

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

function signInUser(req, user) {
  req.session.userId = user.id;
}

function getSessionUserId(req) {
  return req.session.userId;
}

async function getAuthenticatedUser(req) {
  const userId = getSessionUserId(req);
  if (!userId) {
    return null;
  }

  return User.findByPk(userId);
}

function clearSessionCookie(res) {
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
