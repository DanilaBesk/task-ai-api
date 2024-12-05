import { Router } from 'express';
import { AIActionController } from '#/controllers';
import { CheckAccessTokenMiddleware } from '#/middlewares';

const aiActionRouter = Router();

aiActionRouter.post(
  '/generate',
  CheckAccessTokenMiddleware,
  AIActionController.generateText
);

export { aiActionRouter };
