import { NotFoundError } from "#/errors/api-error";
import { NextFunction, Request, Response } from "express";

export function RouteNotFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(new NotFoundError({ message: "404 - not found." }));
}
