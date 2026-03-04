export const AUTH_ERRORS = {
  EMAIL_INVALID: "Please enter a valid email",
  EMAIL_ALREADY_EXISTS: "Signup failed: email already registered",
  INVALID_CREDENTIALS: "Login failed: invalid email or password",
  INVALID_FORMAT_LOGIN: "Login failed: invalid email or password format",
  INVALID_FORMAT_SIGNUP: "Signup failed: invalid email or password format",
  FETCH_FAILED_LOGIN: "Login failed: could not fetch users",
  FETCH_FAILED_SIGNUP: "Signup failed: could not fetch users",
} as const;

export const AUTH_SUCCESS = {
  LOGIN: (email: string) => `Login successful! Welcome, ${email}`,
  SIGNUP: (email: string) => `Signup successful! Welcome, ${email}`,
} as const;

export const PASSWORD_RULES = {
  MIN_LENGTH: "At least 14 characters",
  SPECIAL_CHAR: "Minimum 1 special character",
} as const;
