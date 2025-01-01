import { NextFunction, Request, Response } from 'express';

import { REFRESH_COOKIE_OPTIONS } from '#/constants/auth.constants';
import { LoginSchema, RegistrationSchema } from '#/schemas/auth.schemas';
import { AuthService } from '#/services';
import { validateRequestData } from '#/utils/validate-request-data';

export class AuthController {
  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: { email, password }
      } = await validateRequestData({ schema: RegistrationSchema, req });

      const { accessToken, refreshToken } = await AuthService.registration({
        email,
        password
      });

      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(201).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: { email, password }
      } = await validateRequestData({ schema: LoginSchema, req });

      const { accessToken, refreshToken } = await AuthService.login({
        email,
        password
      });

      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: userId } = req.accessTokenPayload!;

      await AuthService.logout({ userId });

      res.clearCookie('refreshToken', { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.refreshToken!;
      const { sub: userId } = req.refreshTokenPayload!;

      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.refreshTokens({
          userId,
          refreshToken
        });

      res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}
