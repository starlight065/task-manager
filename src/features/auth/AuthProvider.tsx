import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthCredentials, AuthUserDto } from "../../shared/types";
import { setUnauthorizedHandler } from "../../shared/api/apiClient";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "./api/authApi";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUserDto | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUserDto | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        setStatus(currentUser ? "authenticated" : "unauthenticated");
      } catch {
        if (!isMounted) {
          return;
        }

        setUser(null);
        setStatus("unauthenticated");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setStatus("unauthenticated");

      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }

    setUnauthorizedHandler(handleUnauthorized);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [location.pathname, navigate]);

  async function login(credentials: AuthCredentials) {
    const authenticatedUser = await loginRequest(credentials);

    setUser(authenticatedUser);
    setStatus("authenticated");
    navigate("/tasks", { replace: true });
  }

  async function register(credentials: AuthCredentials) {
    const authenticatedUser = await registerRequest(credentials);

    setUser(authenticatedUser);
    setStatus("authenticated");
    navigate("/tasks", { replace: true });
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      navigate("/login", { replace: true });
    }
  }

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
