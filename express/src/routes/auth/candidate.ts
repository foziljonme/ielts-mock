import { Router } from 'express';
import { validate } from '../../lib/api/validate';
import { loginCandidateSchema } from '../../validators/auth.schema';
import authService from '../../services/auth.service';
import { CANDIDATE_TOKEN_EXPIRES_IN } from '../../lib/constants';
import { asyncHandler } from '../../lib/utils/asyncHandler';
import { auth, AuthRequest } from '../../middlewares/auth';

const router = Router();

router.post('/login', asyncHandler(async (req, res) => {
    const loginData = validate(loginCandidateSchema, req.body);
    const result = await authService.loginCandidate(loginData);
    const { accessToken, ...rest } = result;

    res.cookie('auth_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: CANDIDATE_TOKEN_EXPIRES_IN,
    });

    res.status(200).json(rest);
}));

router.get('/me', auth({ candidateCanAccess: true }), asyncHandler(async (req: AuthRequest, res) => {
    const result = await authService.getMeCandidate({ user: req.user! });
    return res.status(200).json(result);
}));

export default router;
