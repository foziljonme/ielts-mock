import { lazy } from "react";

const SectionSelectionPage = lazy(() => import("./pages/SectionSelection"));
const ListeningModulePage = lazy(() => import("./pages/ListeningModulePage"));

export const testRoutes = {
  path: "test",
  children: [
    {
      path: ":testId/section-selection",
      element: <SectionSelectionPage />,
    },
    {
      path: ":testId/listening",
      element: <ListeningModulePage />,
    },
  ],
};
