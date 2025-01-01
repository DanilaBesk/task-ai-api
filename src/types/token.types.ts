import { z } from 'zod';

import {
  AccessTokenPayloadSchema,
  RefreshTokenPayloadSchema
} from '#/schemas/token.schemas';
import { UserRole } from '@prisma/client';

export type TAccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
export type TRefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;

export type TValidateTokenPayload<T extends z.AnyZodObject> = {
  payload: unknown;
  schema: T;
};

export type TCreateRefreshToken = {
  userId: string;
  refreshToken: string;
};

export type TUpdateRefreshToken = {
  userId: string;
  refreshToken: string;
};

export type TFindRefreshToken = {
  userId: string;
};

export type TDeleteRefreshToken = {
  userId: string;
};

export type TMakeAccessToken = {
  email: string;
  userId: string;
  role: UserRole;
};

export type TMakeRefreshToken = {
  userId: string;
};

export type TVerifyRefreshToken = {
  refreshToken: string;
};

export type TVerifyAccessToken = {
  accessToken: string;
};
