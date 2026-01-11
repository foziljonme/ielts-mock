// auth/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthType } from "../types";

interface ProtectedRouteProps {
  requiredType?: AuthType;
}

export function ProtectedRoute({ requiredType }: ProtectedRouteProps = {}) {
  const { isLoading, isAuthenticated, type, seat, user } = useAuth();
  console.log("PROTECTEDDDD", { isAuthenticated, type, seat, user });
  const params = useParams(); // Gets { examId: string }

  // Show loading spinner while auth is validating
  if (isLoading) {
    return <div>Loading...</div>; // Or your spinner component
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    const loginPath =
      requiredType === AuthType.ADMIN
        ? "/auth/admin/login"
        : "/auth/candidate/login";
    return <Navigate to={loginPath} replace />;
  }

  // Wrong user type (e.g., admin trying to access student route)
  if (requiredType && type !== requiredType) {
    return <Navigate to="/" replace />;
  }

  // === STUDENT-SPECIFIC CONSISTENCY CHECK ===
  if (type === AuthType.CANDIDATE && seat) {
    const urlExamId = params.examId;

    // Only check if the current route actually has :examId in the path
    if (urlExamId && urlExamId !== seat.sessionId) {
      // Mismatch! Redirect to the REAL session ID
      const correctPath = location.pathname.replace(urlExamId, seat.sessionId);
      return <Navigate to={correctPath} replace />;
    }
  }

  // All good → render child routes
  return <Outlet />;
}
