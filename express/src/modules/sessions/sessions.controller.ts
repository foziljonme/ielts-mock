import { validate } from "@/shared/utils/validate";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { AuthRequest } from "@/middlewares/auth";
import examSessionService from "./sessions.service";
import { PaginatedResponse } from "@/shared/types/pagination";
import {
  createExamSessionSchema,
  updateExamSessionSchema,
} from "./exam-session.schema";
import { paginationSchema } from "@/shared/validators/pagination.schema";

export const createSession = asyncHandler(async (req: AuthRequest, res) => {
  const data = validate(createExamSessionSchema, req.body);
  const session = await examSessionService.createSession(
    { user: req.user! },
    data,
  );
  res.status(201).json(session);
});

export const listSessions = asyncHandler(async (req: AuthRequest, res) => {
  const { page, pageSize } = validate(paginationSchema, req.query);
  const { items, totalItems } = await examSessionService.getSessions(
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

export const getSessionById = asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params as { sessionId: string };
  const session = await examSessionService.getSessionByIdWithTx(
    { user: req.user! },
    sessionId,
  );
  res.status(200).json(session);
});

export const updateSession = asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params as { sessionId: string };
  const data = validate(updateExamSessionSchema, req.body);
  const session = await examSessionService.updateSession(
    { user: req.user! },
    sessionId,
    data,
  );
  res.status(200).json(session);
});

export const deleteSession = asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params as { sessionId: string };
  const session = await examSessionService.deleteSession(
    { user: req.user! },
    sessionId,
  );
  res.status(200).json(session);
});

export const archiveSession = asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params as { sessionId: string };
  await examSessionService.archiveSession({ user: req.user! }, sessionId);
  res.status(200).json({ message: "Session archived successfully" });
});

export const startSession = asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params as { sessionId: string };
  const session = await examSessionService.startSession(
    { user: req.user! },
    sessionId,
  );
  res.status(201).json(session);
});
