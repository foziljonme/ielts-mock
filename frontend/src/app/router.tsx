import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "../features/auth/routes";
import AppLayout from "./AppLayout";
import { studentsRoutes } from "../features/students/routes";
import { teachersRoutes } from "../features/teachers/routes";
import { tenantsRoutes } from "../features/admins/routes";
import { saasAdminRoutes } from "../features/saas/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [studentsRoutes, teachersRoutes, tenantsRoutes, saasAdminRoutes],
  },
  authRoutes,
]);
