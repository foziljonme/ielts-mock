import { lazy } from "react";

const SessionLoginPage = lazy(() => import("./pages/SessionLoginPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));

export const authRoutes = {
  path: "auth",
  children: [
    {
      path: "join-by-code",
      element: <SessionLoginPage />,
    },
    {
      path: "admin/login",
      element: <AdminLoginPage />,
    },
  ],
};
