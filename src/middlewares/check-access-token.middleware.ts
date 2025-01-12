import { NextFunction, Request, Response } from 'express';
import { AuthorizationHeaderSchema } from '#/schemas/auth.schemas';
import { TokenService } from '#/services';
import { TAccessTokenPayload } from '#/types/token.types';
import { validateRequestData } from '#/utils/validate-request-data';
import { UnauthorizedError, ValidationError } from '#/errors/api-error';

declare global {
  namespace Express {
    interface Request {
      accessTokenPayload?: TAccessTokenPayload;
    }
  }
}

export async function CheckAccessTokenMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    const {
      headers: { authorization: accessToken }
    } = await validateRequestData({
      req,
      schema: AuthorizationHeaderSchema
    });

    const payload = await TokenService.verifyAccessToken({ accessToken });

    req.accessTokenPayload = payload;
  } catch (error) {
    if (error instanceof ValidationError) {
      next(new UnauthorizedError({ message: error.errors[0].message }));
    }
    next(error);
  }
  next();
}
