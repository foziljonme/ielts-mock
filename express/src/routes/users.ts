import { Router } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { auth, AuthRequest } from '../middlewares/auth';
import { validate } from '../lib/api/validate';
import { paginationSchema } from '../validators/pagination.schema';
import userService from '../services/user.service';
import { PaginatedResponse } from '../types/pagination';
import { updateUserSchema } from '../validators/user.schema';

const router = Router();

router.get('/', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { page, pageSize } = validate(paginationSchema, req.query);
    const { items, totalItems } = await userService.getUsers(page, pageSize);

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

router.get('/:userId', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
}));

router.patch('/:userId', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { userId } = req.params;
    const updateUserData = validate(updateUserSchema, req.body);
    const user = await userService.updateUser(userId, updateUserData);
    res.status(200).json(user);
}));

router.delete('/:userId', auth(), asyncHandler(async (req: AuthRequest, res) => {
    const { userId } = req.params;
    const user = await userService.deleteUser(userId);
    res.status(200).json(user);
}));

export default router;
