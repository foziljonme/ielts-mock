import { Router } from 'express';
import { asyncHandler } from '../../lib/utils/asyncHandler';
import { auth, AuthRequest } from '../../middlewares/auth';
import { validate } from '../../lib/api/validate';
import { paginationSchema } from '../../validators/pagination.schema';
import examSeatsService from '../../services/examSeat.service';
import { createExamSeatSchema } from '../../validators/exam-seat.schema';
import { PaginatedResponse } from '../../types/pagination';

const router = Router({ mergeParams: true });

router.post('/', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { sessionId } = req.params;
    const createExamSeatData = validate(createExamSeatSchema, req.body);
    const examSeat = await examSeatsService.createSeat(
        { user: req.user! },
        sessionId,
        createExamSeatData,
    );
    res.status(201).json(examSeat);
}));

router.get('/', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { sessionId } = req.params;
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
}));

export default router;
