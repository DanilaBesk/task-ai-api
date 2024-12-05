import { Router } from 'express';
import { authRouter } from '#/routes/auth.routes';
import { userRouter } from '#/routes/user.routes';
import { aiActionRouter } from '#/routes/ai-action.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/ai', aiActionRouter);

export { router };
