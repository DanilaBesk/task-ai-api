import { Request } from 'express';
import { z } from 'zod';

import { ValidationError } from '#/errors/api-error';

export const validateRequestData = async <T extends z.ZodType>({
  schema,
  req
}: {
  schema: T;
  req: Request;
}): Promise<z.infer<T>> => {
  const result = await schema.safeParseAsync(req);

  if (!result.success) {
    throw new ValidationError({
      errors: result.error.issues
    });
  }

  return result.data;
};
