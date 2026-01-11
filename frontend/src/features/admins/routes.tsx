import { lazy } from "react";
import { AdminLayout } from "./pages/Layout";

const AdminDashboardPage = lazy(() => import("./pages/AdminDashboard"));

export const adminsRoutes = {
  path: "admin",
  element: <AdminLayout />,
  children: [
    {
      path: "dashboard",
      element: <AdminDashboardPage />,
    },
  ],
};
