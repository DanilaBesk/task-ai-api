import { z } from 'zod';

import { EMAIL, USER_ROLE } from '#/schemas/common.schemas';

export const TIMESTAMP_UNTIL_NOW = z.number().int().min(0).max(Date.now());
export const TIMESTAMP_ANY = z.number().int().min(0);

export const RefreshTokenPayloadSchema = z
  .object({
    sub: z.string().uuid(),
    iat: TIMESTAMP_UNTIL_NOW,
    exp: TIMESTAMP_ANY
  })
  .strict();

export const AccessTokenPayloadSchema = z
  .object({
    sub: z.string().uuid(),
    email: EMAIL,
    role: USER_ROLE,
    iat: TIMESTAMP_UNTIL_NOW,
    exp: TIMESTAMP_ANY
  })
  .strict();
