import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../lib/auth-client";

type Props = {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "SELLER" | "BUYER")[];
  redirectTo?: string;
};

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = "/login" 
}: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}