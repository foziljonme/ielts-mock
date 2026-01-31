import { Router } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { auth, AuthRequest } from '../middlewares/auth';
import { validate } from '../lib/api/validate';
import { paginationSchema } from '../validators/pagination.schema';
import examSessionService from '../services/examSession.service';
import { createExamSessionSchema, updateExamSessionSchema } from '../validators/exam-session.schema';
import { PaginatedResponse } from '../types/pagination';

const router = Router();

router.post('/', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const data = validate(createExamSessionSchema, req.body);
    const session = await examSessionService.createSession({ user: req.user! }, data);
    res.status(201).json(session);
}));

router.get('/', auth(), asyncHandler(async (req: AuthRequest, res) => {
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
}));

router.get('/:sessionId', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { sessionId } = req.params;
    const session = await examSessionService.getSessionByIdWithTx({ user: req.user! }, sessionId);
    res.status(200).json(session);
}));

router.patch('/:sessionId', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { sessionId } = req.params;
    const data = validate(updateExamSessionSchema, req.body);
    const session = await examSessionService.updateSession({ user: req.user! }, sessionId, data);
    res.status(200).json(session);
}));

router.delete('/:sessionId', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { sessionId } = req.params;
    const session = await examSessionService.deleteSession({ user: req.user! }, sessionId);
    res.status(200).json(session);
}));

router.post('/:sessionId/archive', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { sessionId } = req.params;
    await examSessionService.archiveSession({ user: req.user! }, sessionId);
    res.status(200).json({ message: 'Session archived successfully' });
}));

import seatsRouter from './sessions/seats';

router.use('/:sessionId/seats', seatsRouter);

import sectionsRouter from './sessions/sections';

router.use('/:sessionId/sections', sectionsRouter);

router.post('/:sessionId/start', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { sessionId } = req.params;
    const session = await examSessionService.startSession({ user: req.user! }, sessionId);
    res.status(201).json(session);
}));

export default router;
