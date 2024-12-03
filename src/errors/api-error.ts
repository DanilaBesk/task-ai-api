export class ApiError extends Error {
  status: number;

  constructor({
    status,
    message,
    cause,
  }: {
    status: number;
    message: string;
    cause?: unknown;
  }) {
    super(message, { cause });
    this.status = status;
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends ApiError {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super({ status: 400, message, cause });
  }
}

export class ValidationError extends BadRequestError {
  errors: unknown[];

  constructor({ errors, cause }: { errors: unknown[]; cause?: unknown }) {
    super({ message: "Validation error occurred.", cause });

    this.errors = errors;
  }
}

export class UnauthorizedError extends ApiError {
  constructor({ message }: { message: string }) {
    super({ status: 401, message });
  }
}
export class NotFoundError extends ApiError {
  constructor({ message }: { message: string }) {
    super({ status: 404, message });
  }
}
