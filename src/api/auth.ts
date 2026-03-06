import type { AuthUser } from "../types";

async function sendAuthRequest(
  path: "/api/login" | "/api/register",
  email: string,
  password: string,
): Promise<void> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
}

export function login(email: string, password: string): Promise<void> {
  return sendAuthRequest("/api/login", email, password);
}

export function register(email: string, password: string): Promise<void> {
  return sendAuthRequest("/api/register", email, password);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/me", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to restore session");
  }

  const data: { user: AuthUser } = await response.json();
  return data.user;
}
