import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../prisma/generated/client";
import {
  activateTenant,
  createTenant,
  listTenants,
  deactivateTenant,
} from "@/modules/tenants/tenant.controller";

const router = Router();

router.post("/", auth({ roles: [UserRole.PLATFORM_ADMIN] }), createTenant);

router.get("/", auth({ roles: [UserRole.PLATFORM_ADMIN] }), listTenants);

router.post(
  "/:tenantId/activate",
  auth({ roles: [UserRole.PLATFORM_ADMIN] }),
  activateTenant,
);

router.post(
  "/:tenantId/deactivate",
  auth({ roles: [UserRole.PLATFORM_ADMIN] }),
  deactivateTenant,
);

export default router;
