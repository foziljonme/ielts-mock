import { Router } from "express";
import { auth } from "../middlewares/auth";
import sectionsRouter from "./sections";
import {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession,
  archiveSession,
  startSession,
} from "@/controllers/session.controller";
import seatsRouter from "./seats";

const router = Router();

router.post("/", auth(), createSession);

router.get("/", auth(), listSessions);

router.get("/:sessionId", auth(), getSessionById);

router.patch("/:sessionId", auth(), updateSession);

router.delete("/:sessionId", auth(), deleteSession);

router.post("/:sessionId/archive", auth(), archiveSession);

router.use("/:sessionId/seats", seatsRouter);

router.use("/:sessionId/sections", sectionsRouter);

router.post("/:sessionId/start", auth(), startSession);

export default router;
