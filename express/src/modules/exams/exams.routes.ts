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

const examsRouter = Router();

examsRouter.post("/", auth(), createExam);

examsRouter.get("/", auth(), listExams);

examsRouter.get("/:examId", auth(), getExamById);

examsRouter.patch("/:examId", auth(), updateExam);

examsRouter.delete("/:examId", auth(), deleteExam);

examsRouter.post("/:examId/archive", auth(), archiveExam);

examsRouter.use("/:examId/seats", seatsRouter);

examsRouter.post("/:examId/start", auth(), startExam);

examsRouter.use("/:examId/sections", sectionsRouter);

export default examsRouter;
