import { Router } from "express";
import authRouter from "./auth/routes";
import examsRouter from "./exams/exams.routes";
import { getReadyTests } from "@/modules/contents/contents.controller";
import { bootstrap } from "@/modules/dev/dev-helper.controller";
import tenantsRouter from "./tenants/tenants.routes";
import usersRouter from "./users/users.routes";
import candidateRouter from "./candidate/candidate.routes";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});
router.get("/available-tests", getReadyTests);
router.post("/bootstrap", bootstrap);

router.use("/auth", authRouter);
router.use("/exams", examsRouter);
router.use("/tenants", tenantsRouter);
router.use("/users", usersRouter);
router.use("/candidate", candidateRouter);

export default router;
