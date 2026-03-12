import authConfig from "../../../../shared/auth.json";

const emailRegex = new RegExp(authConfig.emailPattern);
const passwordSpecialCharacterRegex = new RegExp(
  authConfig.passwordSpecialCharacterPattern,
);

export const AUTH_MESSAGES = authConfig.messages;

export const PASSWORD_RULES = {
  minLength: AUTH_MESSAGES.passwordMinLength,
  specialCharacter: AUTH_MESSAGES.passwordSpecialCharacter,
} as const;

export function getPasswordValidation(password: string) {
  const normalizedPassword = typeof password === "string" ? password : "";
  const hasMinLength = normalizedPassword.length >= authConfig.passwordMinLength;
  const hasSpecialCharacter = passwordSpecialCharacterRegex.test(normalizedPassword);

  return {
    hasMinLength,
    hasSpecialCharacter,
    isValid: hasMinLength && hasSpecialCharacter,
  };
}

export function isValidEmail(email: string) {
  return emailRegex.test(email.trim());
}

export function validateAuthCredentials(email: string, password: string) {
  const passwordValidation = getPasswordValidation(password);

  return {
    isEmailValid: isValidEmail(email),
    isPasswordValid: passwordValidation.isValid,
    ...passwordValidation,
  };
}
