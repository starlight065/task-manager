import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthCredentials, AuthUserDto } from "../../../shared/types";
import { setUnauthorizedHandler } from "../../../shared/api/apiClient";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../api/authApi";
import type { AuthProviderProps, AuthStatus } from "../types";
import { AuthContext } from "./AuthContext";

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

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      const authenticatedUser = await loginRequest(credentials);

      setUser(authenticatedUser);
      setStatus("authenticated");
      navigate("/tasks", { replace: true });
    },
    [navigate]
  );

  const register = useCallback(
    async (credentials: AuthCredentials) => {
      const authenticatedUser = await registerRequest(credentials);

      setUser(authenticatedUser);
      setStatus("authenticated");
      navigate("/tasks", { replace: true });
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const contextValue = useMemo(
    () => ({ status, user, login, register, logout }),
    [status, user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
