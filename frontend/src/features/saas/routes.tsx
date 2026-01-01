import { lazy } from "react";

const SaasAdminDashboardPage = lazy(
  () => import("./pages/SaasAdminDashboardPage")
);
const TenantsManagerPage = lazy(() => import("./pages/TenantsManagerPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

export const saasAdminRoutes = {
  path: "saas",
  children: [
    {
      path: "dashboard",
      element: <SaasAdminDashboardPage />,
    },
    {
      path: "tenants",
      element: <TenantsManagerPage />,
    },
    {
      path: "analytics",
      element: <AnalyticsPage />,
    },
    {
      path: "settings",
      element: <SettingsPage />,
    },
  ],
};
