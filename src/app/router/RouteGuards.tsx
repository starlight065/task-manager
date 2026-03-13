import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/model/useAuth";

interface RouteGuardProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: RouteGuardProps) {
  const { status } = useAuth();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: RouteGuardProps) {
  const { status } = useAuth();

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    return <Navigate to="/tasks" replace />;
  }

  return <>{children}</>;
}
