import { Router } from "express";
import authRouter from "./auth";
import sessionsRouter from "./sessions";
import usersRouter from "./users";
import { getReadyTests } from "@/controllers/test-content.controller";
import { bootstrap } from "@/controllers/dev-helper.controller";
import tenantsRouter from "./tenants";

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
