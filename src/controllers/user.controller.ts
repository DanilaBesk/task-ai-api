import { NextFunction, Request, Response } from 'express';

import { UserService } from '#/services';
import { validateRequestData } from '#/utils/validate-request-data';
import { AdjustCreditsSchema } from '#/schemas/user.schemas';

export class UserController {
  static async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: userId } = req.accessTokenPayload!;

      const { user } = await UserService.getUserInfo({ userId });

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async adjustCredits(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: { userId, count, operation }
      } = await validateRequestData({
        schema: AdjustCreditsSchema,
        req
      });

      const adminId = req.accessTokenPayload!.sub;

      await UserService.adjustCredits({
        adminId,
        userId,
        count,
        operation
      });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.accessTokenPayload!.sub;

      await UserService.deleteUser({ userId });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}
