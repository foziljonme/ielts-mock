import { lazy } from "react";

const UserProfilePage = lazy(
  () => import("../../shared/pages/UserProfilePage")
);
const TenantAdminDashboardPage = lazy(
  () => import("./pages/TenantAdminDashboardPage")
);
const StudentsManagerPage = lazy(
  () => import("../../shared/pages/StudentsManagerPage")
);
const TeachersManagerPage = lazy(() => import("./pages/TeachersManagerPage"));
const GroupsManagerPage = lazy(
  () => import("../../shared/pages/GroupsManagerPage")
);
const GradesManagerPage = lazy(
  () => import("../../shared/pages/GradesManagerPage")
);
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

export const tenantsRoutes = {
  path: "tenant",
  children: [
    {
      path: "profile",
      element: <UserProfilePage />,
    },
    {
      path: "dashboard",
      element: <TenantAdminDashboardPage />,
    },
    {
      path: "students",
      element: <StudentsManagerPage />,
    },
    {
      path: "teachers",
      element: <TeachersManagerPage />,
    },
    {
      path: "groups",
      element: <GroupsManagerPage />,
    },
    {
      path: "grades",
      element: <GradesManagerPage />,
    },
    {
      path: "settings",
      element: <SettingsPage />,
    },
  ],
};
