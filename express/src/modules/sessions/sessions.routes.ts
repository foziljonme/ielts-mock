import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession,
  archiveSession,
  startSession,
} from "@/modules/sessions/sessions.controller";
import seatsRouter from "./seats/seat.routes";

const router = Router();

router.post("/", auth(), createSession);

router.get("/", auth(), listSessions);

router.get("/:sessionId", auth(), getSessionById);

router.patch("/:sessionId", auth(), updateSession);

router.delete("/:sessionId", auth(), deleteSession);

router.post("/:sessionId/archive", auth(), archiveSession);

router.use("/:sessionId/seats", seatsRouter);

router.post("/:sessionId/start", auth(), startSession);

export default router;
