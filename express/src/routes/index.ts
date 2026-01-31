import { Router } from 'express';
import helloRouter from './hello';
import authRouter from './auth';
import availableTestsRouter from './available-tests';
import bootstrapRouter from './bootstrap';
import sessionsRouter from './sessions';

const router = Router();

router.use('/hello', helloRouter);
router.use('/auth', authRouter);
router.use('/available-tests', availableTestsRouter);
router.use('/bootstrap', bootstrapRouter);
router.use('/sessions', sessionsRouter);

import tenantsRouter from './tenants';

router.use('/tenants', tenantsRouter);

import usersRouter from './users';

router.use('/users', usersRouter);

export default router;
