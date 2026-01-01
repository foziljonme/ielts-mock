import { lazy } from "react";
import GroupsManagerPage from "../../shared/pages/GroupsManagerPage";

const UserProfilePage = lazy(
  () => import("../../shared/pages/UserProfilePage")
);
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const GradesManagerPage = lazy(
  () => import("../../shared/pages/GradesManagerPage")
);

export const studentsRoutes = {
  path: "student",
  children: [
    {
      path: "profile",
      element: <UserProfilePage />,
    },
    {
      path: "dashboard",
      element: <DashboardPage />,
    },
    {
      path: "grades",
      element: <GradesManagerPage />,
    },
    {
      path: "groups",
      element: <GroupsManagerPage />,
    },
  ],
};
