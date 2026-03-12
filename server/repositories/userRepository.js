const User = require("../models/User");

function createUser({ email, passwordHash }) {
  return User.create({ email, password_hash: passwordHash });
}

function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

function findUserById(id) {
  return User.findByPk(id);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
