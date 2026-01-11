import { lazy } from "react";

const CandidateLoginPage = lazy(() => import("./pages/CandidateLoginPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));

export const authRoutes = {
  path: "auth",
  children: [
    {
      path: "candidate/login",
      element: <CandidateLoginPage />,
    },
    {
      path: "admin/login",
      element: <AdminLoginPage />,
    },
  ],
};
