import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '#/errors/api-error';

export function RouteNotFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(new NotFoundError({ message: '404 - not found.' }));
}
