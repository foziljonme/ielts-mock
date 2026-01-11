import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "../features/auth/routes";
// import AppLayout from "./AppLayout";
import { adminsRoutes } from "../features/admins/routes";
import { examRoutes } from "../features/exams/routes";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import RootLayoutWithAuth from "./RootLayoutWithAuth";

export const router = createBrowserRouter([
  {
    element: <RootLayoutWithAuth />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [adminsRoutes, examRoutes],
      },
      authRoutes,
    ],
  },
]);
