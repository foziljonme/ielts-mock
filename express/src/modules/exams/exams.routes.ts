import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  createExam,
  listExams,
  getExamById,
  updateExam,
  deleteExam,
  archiveExam,
  startExam,
} from "@/modules/exams/exams.controller";
import seatsRouter from "./seats/seat.routes";
import sectionsRouter from "./sections/sections.routes";

const router = Router();

router.post("/", auth(), createExam);

router.get("/", auth(), listExams);

router.get("/:examId", auth(), getExamById);

router.patch("/:examId", auth(), updateExam);

router.delete("/:examId", auth(), deleteExam);

router.post("/:examId/archive", auth(), archiveExam);

router.use("/:examId/seats", seatsRouter);

router.post("/:examId/start", auth(), startExam);

router.use("/:examId/sections", sectionsRouter);

export default router;
