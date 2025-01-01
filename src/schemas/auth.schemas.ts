import { z } from 'zod';

import { EMAIL, PASSWORD } from '#/schemas/common.schemas';

export const AUTHORIZATION_HEADER = z
  .custom((header) => {
    if (typeof header !== 'string') {
      return false;
    }
    const [scheme, token] = header.split(' ');
    return scheme === 'Bearer' && !!token;
  }, 'Invalid authorization header. Expected format: Bearer <token>')
  .transform((header) => (header as string).split(' ')[1]);

export const RegistrationSchema = z.object({
  body: z
    .object({
      email: EMAIL,
      password: PASSWORD
    })
    .strict()
});

export const LoginSchema = z.object({
  body: z
    .object({
      email: EMAIL,
      password: PASSWORD
    })
    .strict()
});

export const RefreshTokenCookieSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ message: 'Invalid refresh token.' })
  })
});

export const AuthorizationHeaderSchema = z.object({
  headers: z.object({
    authorization: AUTHORIZATION_HEADER
  })
});
