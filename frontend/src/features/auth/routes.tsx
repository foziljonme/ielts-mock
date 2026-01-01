import { lazy } from "react";

const SignupPage = lazy(() => import("./pages/SignupPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));

export const authRoutes = {
  path: "auth",
  children: [
    {
      path: "signup",
      element: <SignupPage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "forgot-password",
      element: <ForgotPasswordPage />,
    },
  ],
};
