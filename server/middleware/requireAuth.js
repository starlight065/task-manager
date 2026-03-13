const { getAuthenticatedUser } = require("../services/sessionService");
const { AUTH_MESSAGES } = require("../validators/authValidator");

async function requireAuth(req, res, next) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return res.status(401).json({ error: AUTH_MESSAGES.unauthorized });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: AUTH_MESSAGES.serverError });
  }
}

module.exports = { requireAuth };
