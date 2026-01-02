import { lazy } from "react";

const AdminDashboardPage = lazy(() => import("./pages/AdminDashboard"));

export const adminsRoutes = {
  path: "admin",
  children: [
    {
      path: "dashboard",
      element: <AdminDashboardPage />,
    },
  ],
};
