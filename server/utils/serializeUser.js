function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at ?? user.createdAt,
  };
}

module.exports = { serializeUser };
