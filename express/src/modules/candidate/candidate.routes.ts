import { Router } from "express";
import {
  getCurrentSectionController,
  restoreResponsesController,
  saveResponseController,
} from "./candidate.controller";
import { requireSeatSession } from "@/middlewares/requireSeatSession";

const candidateRouter = Router();

candidateRouter.use(requireSeatSession);

candidateRouter.get("/current-section", getCurrentSectionController);
candidateRouter.patch(
  "/current-section/responses/:questionId",
  saveResponseController,
);
candidateRouter.get("/responses/restore", restoreResponsesController);

export default candidateRouter;
