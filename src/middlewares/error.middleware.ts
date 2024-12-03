import { NextFunction, Request, Response } from "express";

import { CONFIG } from "#config";
import { ValidationError, ApiError } from "#/errors/api-error";

export function ErrorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const defaultStatus = 500;
  const defaultMessage = "Something went wrong. Please try again later.";
  const defaultName = "InternalError";

  let status = defaultStatus;
  const body: Record<string, unknown> = {
    name: defaultName,
    message: defaultMessage,
  };

  if (error instanceof ApiError) {
    status = error.status;
    body.message = error.message;
    body.name = error.name;

    if (error instanceof ValidationError) {
      body.errors = error.errors;
    }
  }

  if (CONFIG.NODE_ENV !== "production") {
    if (error instanceof ApiError) {
      console.log("Operational error: ", error);
    } else {
      console.log("Unknown error: ", error);
    }
  }

  res.status(status).json(body);
}
