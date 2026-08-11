import { Router } from "express";
import { startSectionController } from "./sections.controller";
import { auth } from "@/middlewares/auth";
import { UserRole } from "../../../../prisma/generated/enums";

const sectionsRouter = Router();

sectionsRouter.post(
  "/:sectionId/start",
  auth({
    roles: [UserRole.STAFF, UserRole.TENANT_ADMIN],
  }),
  startSectionController,
);

export default sectionsRouter;
