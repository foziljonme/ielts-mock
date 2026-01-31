import { Router } from 'express';
import { asyncHandler } from '../lib/utils/asyncHandler';
import { auth } from '../middlewares/auth';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

router.get('/', auth({ candidateCanAccess: true }), asyncHandler(async (req, res) => {
    const readyTestsPath = path.join(__dirname, '..', 'data', 'ready-tests.json');
    const readyTests = await fs.readFile(readyTestsPath, 'utf-8');
    res.status(200).json(JSON.parse(readyTests));
}));

export default router;
