export class ApiError extends Error {
  status: number;

  constructor({
    status,
    message,
    cause
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
    super({ message: 'Validation error occurred.', cause });

    this.errors = errors;
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super({ status: 401, message: 'User is not authorized.' });
  }
}

export class InsufficientCreditsError extends ApiError {
  constructor() {
    super({
      status: 402,
      message: 'Insufficient credits. Please top up your balance.'
    });
  }
}

export class PermissionDeniedError extends ApiError {
  constructor({ message }: { message: string }) {
    super({ status: 403, message });
  }
}

export class NotFoundError extends ApiError {
  constructor({ message }: { message: string }) {
    super({ status: 404, message });
  }
}

export class EmailAlreadyTakenError extends ApiError {
  constructor() {
    super({
      status: 409,
      message: 'This email address is taken. Please try another.'
    });
  }
}

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super({
      status: 401,
      message: 'Email or password incorrect.'
    });
  }
}

export class TokenExpiredError extends ApiError {
  constructor() {
    super({ status: 419, message: 'Token has expired.' });
  }
}
