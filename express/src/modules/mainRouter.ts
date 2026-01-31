import { Router } from "express";
import authRouter from "./auth/routes";
import sessionsRouter from "./sessions/sessions.routes";
import { getReadyTests } from "@/modules/contents/contents.controller";
import { bootstrap } from "@/modules/dev/dev-helper.controller";
import tenantsRouter from "./tenants/tenants.routes";
import usersRouter from "./users/users.routes";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});
router.get("/available-tests", getReadyTests);
router.post("/bootstrap", bootstrap);

router.use("/auth", authRouter);
router.use("/sessions", sessionsRouter);
router.use("/tenants", tenantsRouter);
router.use("/users", usersRouter);

export default router;
