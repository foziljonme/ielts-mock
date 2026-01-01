import { lazy } from "react";
import GroupsManagerPage from "../../shared/pages/GroupsManagerPage";

const UserProfilePage = lazy(
  () => import("../../shared/pages/UserProfilePage")
);
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const GradesManagerPage = lazy(
  () => import("../../shared/pages/GradesManagerPage")
);
const StudentsManagerPage = lazy(
  () => import("../../shared/pages/StudentsManagerPage")
);

export const teachersRoutes = {
  path: "teacher",
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
      path: "students",
      element: <StudentsManagerPage />,
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
