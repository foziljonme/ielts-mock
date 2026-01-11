import { lazy } from "react";

const CandidateWaitingRoomPage = lazy(
  () => import("./pages/CandidateWaitingRoom")
);
const SectionSelectionPage = lazy(() => import("./pages/SectionSelection"));
const ListeningModulePage = lazy(() => import("./pages/ListeningModulePage"));

export const examRoutes = {
  path: "exam",
  children: [
    {
      path: ":examId/waiting-room",
      element: <CandidateWaitingRoomPage />,
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
