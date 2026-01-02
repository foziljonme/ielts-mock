import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "../features/auth/routes";
// import AppLayout from "./AppLayout";
import { adminsRoutes } from "../features/admins/routes";
import { testRoutes } from "../features/test/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    // element: <AppLayout />,
    children: [adminsRoutes, testRoutes],
  },
  authRoutes,
]);
