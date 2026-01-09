import { lazy } from "react";

const StudentWaitingRoomPage = lazy(() => import("./pages/StudentWaitingRoom"));
const SectionSelectionPage = lazy(() => import("./pages/SectionSelection"));
const ListeningModulePage = lazy(() => import("./pages/ListeningModulePage"));

export const examsRoutes = {
  path: "exams",
  children: [
    {
      path: ":examId/waiting-room",
      element: <StudentWaitingRoomPage />,
    },
    {
      path: ":examId/sections",
      element: <SectionSelectionPage />,
    },
    {
      path: ":examId/listening",
      element: <ListeningModulePage />,
    },
  ],
};
