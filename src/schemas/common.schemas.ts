import { z } from 'zod';

import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH
} from '#/constants/user.constants';
import { UserRole } from '@prisma/client';

export const USER_ROLE = z.enum(
  Object.keys(UserRole) as [keyof typeof UserRole]
);

export const PASSWORD = z
  .string()
  .min(MIN_PASSWORD_LENGTH)
  .max(MAX_PASSWORD_LENGTH);

export const EMAIL = z.string().email().max(MAX_EMAIL_LENGTH);
