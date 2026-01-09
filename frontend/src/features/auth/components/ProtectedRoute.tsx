// auth/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  requiredType?: "admin" | "student";
}

export function ProtectedRoute({ requiredType }: ProtectedRouteProps = {}) {
  const { isLoading, isAuthenticated, type, student } = useAuth();
  const params = useParams(); // Gets { examId: string }

  // Show loading spinner while auth is validating
  if (isLoading) {
    return <div>Loading...</div>; // Or your spinner component
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    const loginPath =
      requiredType === "admin" ? "/auth/login/admin" : "/auth/join-by-code";
    return <Navigate to={loginPath} replace />;
  }

  // Wrong user type (e.g., admin trying to access student route)
  if (requiredType && type !== requiredType) {
    return <Navigate to="/" replace />;
  }

  // === STUDENT-SPECIFIC CONSISTENCY CHECK ===
  if (type === "student" && student) {
    const urlExamId = params.examId;

    // Only check if the current route actually has :examId in the path
    if (urlExamId && urlExamId !== student.schedule.id) {
      // Mismatch! Redirect to the REAL session ID
      const correctPath = location.pathname.replace(
        urlExamId,
        student.schedule.id
      );
      return <Navigate to={correctPath} replace />;
    }
  }

  // All good → render child routes
  return <Outlet />;
}
