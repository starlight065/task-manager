import { apiRequest, apiRequestOrNull } from "../../../shared/api/apiClient";
import type { AuthCredentials, AuthUserDto } from "../../../shared/types";
import { AUTH_MESSAGES } from "../utils/authValidation";

interface AuthResponse {
  user: AuthUserDto;
}

export async function login(credentials: AuthCredentials): Promise<AuthUserDto> {
  const data = await apiRequest<AuthResponse>("/api/login", {
    method: "POST",
    body: credentials,
    fallbackErrorMessage: AUTH_MESSAGES.invalidCredentials,
    handleUnauthorized: false,
  });

  return data.user;
}

export async function register(credentials: AuthCredentials): Promise<AuthUserDto> {
  const data = await apiRequest<AuthResponse>("/api/register", {
    method: "POST",
    body: credentials,
    fallbackErrorMessage: AUTH_MESSAGES.serverError,
    handleUnauthorized: false,
  });

  return data.user;
}

export async function getCurrentUser(): Promise<AuthUserDto | null> {
  const data = await apiRequestOrNull<AuthResponse>("/api/me", {
    fallbackErrorMessage: AUTH_MESSAGES.sessionRestoreFailed,
  });

  return data?.user ?? null;
}

export async function logout(): Promise<void> {
  await apiRequest("/api/logout", {
    method: "POST",
    fallbackErrorMessage: AUTH_MESSAGES.serverError,
    handleUnauthorized: false,
  });
}
