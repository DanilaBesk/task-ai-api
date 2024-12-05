import { Router } from 'express';
import { AuthController } from '#/controllers';
import { CheckAccessTokenMiddleware } from '#/middlewares';

const authRouter = Router();

authRouter.post('/registration', AuthController.registration);
authRouter.post('/login', AuthController.login);
authRouter.post('/logout', CheckAccessTokenMiddleware, AuthController.logout);
authRouter.post('/refresh-tokens', AuthController.refreshTokens);

export { authRouter };
