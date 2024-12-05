import { Router } from 'express';
import { UserController } from '#/controllers';
import {
  CheckAccessTokenMiddleware,
  CheckUserRoleMiddleware
} from '#/middlewares';

const userRouter = Router();

userRouter.get('/info', CheckAccessTokenMiddleware, UserController.getUserInfo);
userRouter.post(
  '/adjust-credits',
  CheckAccessTokenMiddleware,
  CheckUserRoleMiddleware(['admin']),
  UserController.adjustCredits
);
userRouter.post(
  '/delete',
  CheckAccessTokenMiddleware,
  UserController.deleteUser
);

export { userRouter };
