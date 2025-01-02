import { NextFunction, Request, Response } from 'express';
import { RefreshTokenCookieSchema } from '#/schemas/auth.schemas';
import { TokenService } from '#/services';
import { TRefreshTokenPayload } from '#/types/token.types';
import { validateRequestData } from '#/utils/validate-request-data';
import { UnauthorizedError, ValidationError } from '#/errors/api-error';

declare global {
  namespace Express {
    interface Request {
      refreshTokenPayload?: TRefreshTokenPayload;
      refreshToken?: string;
    }
  }
}

export async function CheckRefreshTokenMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    const {
      cookies: { refreshToken }
    } = await validateRequestData({
      req,
      schema: RefreshTokenCookieSchema
    });

    const payload = await TokenService.verifyRefreshToken({ refreshToken });

    req.refreshTokenPayload = payload;
  } catch (error) {
    if (error instanceof ValidationError) {
      next(new UnauthorizedError({ message: error.errors[0].message }));
    }
    next(error);
  }
  next();
}
