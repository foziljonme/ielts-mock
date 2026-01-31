import { validate } from "@/lib/api/validate";
import { asyncHandler } from "@/lib/utils/asyncHandler";
import { AuthRequest } from "@/middlewares/auth";
import examSeatsService from "@/services/examSeat.service";
import { PaginatedResponse } from "@/types/pagination";
import { createExamSeatSchema } from "@/validators/exam-seat.schema";
import { paginationSchema } from "@/validators/pagination.schema";

export const createSeat = asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params as { sessionId: string };
  const createExamSeatData = validate(createExamSeatSchema, req.body);
  const examSeat = await examSeatsService.createSeat(
    { user: req.user! },
    sessionId,
    createExamSeatData,
  );
  res.status(201).json(examSeat);
});

export const listSeats = asyncHandler(async (req: AuthRequest, res) => {
  const { sessionId } = req.params as { sessionId: string };
  const { page, pageSize } = validate(paginationSchema, req.query);

  const { items, totalItems } = await examSeatsService.getSeats(
    { user: req.user! },
    sessionId,
    page,
    pageSize,
  );

  const response: PaginatedResponse<(typeof items)[number]> = {
    results: items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    },
  };

  res.status(200).json(response);
});
