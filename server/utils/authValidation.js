function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return (
    password.length >= 14 &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  );
}

function getCredentialsFromRequest(req) {
  return {
    email: req.body.email?.trim().toLowerCase(),
    password: req.body.password,
  };
}

function hasValidCredentials(email, password) {
  return Boolean(email && password) && isValidEmail(email) && isValidPassword(password);
}

module.exports = {
  getCredentialsFromRequest,
  hasValidCredentials,
  isValidEmail,
  isValidPassword,
};
