import type { ReactNode } from "react";
import type { AuthCredentials, AuthUserDto } from "../../../shared/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUserDto | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthResponse {
  user: AuthUserDto;
}

export type AuthFormMode = "login" | "signup";

export interface AuthFormProps {
  readonly mode: AuthFormMode;
  readonly onSubmit: (credentials: AuthCredentials) => Promise<void>;
}

export interface AuthProviderProps {
  readonly children: ReactNode;
}
