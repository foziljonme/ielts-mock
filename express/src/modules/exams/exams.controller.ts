import { validate } from "@/shared/utils/validate";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { AuthRequest } from "@/middlewares/auth";
import examService from "./exams.service";
import { PaginatedResponse } from "@/shared/types/pagination";
import { createExamSchema, updateExamSchema } from "./exam.schema";
import { paginationSchema } from "@/shared/validators/pagination.schema";

export const createExam = asyncHandler(async (req: AuthRequest, res) => {
  const data = validate(createExamSchema, req.body);
  const exam = await examService.createExam({ user: req.user! }, data);
  res.status(201).json(exam);
});

export const listExams = asyncHandler(async (req: AuthRequest, res) => {
  const { page, pageSize } = validate(paginationSchema, req.query);
  const { items, totalItems } = await examService.getExams(
    { user: req.user! },
    page,
    pageSize,
  );

  const totalPages = Math.ceil(totalItems / pageSize);

  const response: PaginatedResponse<(typeof items)[number]> = {
    results: items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };

  res.status(200).json(response);
});

export const getExamById = asyncHandler(async (req: AuthRequest, res) => {
  const { examId } = req.params as { examId: string };
  const exam = await examService.getExamByIdWithTx({ user: req.user! }, examId);
  res.status(200).json(exam);
});

export const updateExam = asyncHandler(async (req: AuthRequest, res) => {
  const { examId } = req.params as { examId: string };
  const data = validate(updateExamSchema, req.body);
  // @ts-expect-error
  const exam = await examService.updateExam({ user: req.user! }, examId, data);
  res.status(200).json(exam);
});

export const deleteExam = asyncHandler(async (req: AuthRequest, res) => {
  const { examId } = req.params as { examId: string };
  const exam = await examService.deleteExam({ user: req.user! }, examId);
  res.status(200).json(exam);
});

export const archiveExam = asyncHandler(async (req: AuthRequest, res) => {
  const { examId } = req.params as { examId: string };
  await examService.archiveExam({ user: req.user! }, examId);
  res.status(200).json({ message: "Archived successfully" });
});

export const startExam = asyncHandler(async (req: AuthRequest, res) => {
  const { examId } = req.params as { examId: string };
  const exam = await examService.startExam({ user: req.user! }, examId);
  res.status(201).json(exam);
});
