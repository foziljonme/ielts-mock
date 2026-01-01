// import type { PropsWithChildren } from "react";
// import { useLocation } from "react-router-dom";

// interface ProtectedRouteProps {
//   roles?: Array<"STUDENT" | "TEACHER" | "TENANT_ADMIN" | "OWNER">;
//   permissions?: string[];
// }

// export function ProtectedRoute({
//   roles,
//   permissions,
//   children,
// }: PropsWithChildren<ProtectedRouteProps>) {
//   const auth = useAuth();
//   const location = useLocation();

//   if (auth.isLoading) {
//     return <FullPageSpinner />;
//   }

//   if (!auth.isAuthenticated) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   if (roles && !roles.some((r) => auth.user!.roles.includes(r))) {
//     return <Navigate to="/403" replace />;
//   }

//   if (
//     permissions &&
//     !permissions.every((p) => auth.user!.permissions.includes(p))
//   ) {
//     return <Navigate to="/403" replace />;
//   }

//   return <>{children}</>;
// }
