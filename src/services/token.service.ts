import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { CONFIG } from '#config';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  JWT_SIGNING_ALGORITHM,
  REFRESH_TOKEN_EXPIRES_IN
} from '#/constants/auth.constants';
import { TokenExpiredError, UnauthorizedError } from '#/errors/api-error';
import { prisma } from '#/providers';
import {
  AccessTokenPayloadSchema,
  RefreshTokenPayloadSchema
} from '#/schemas/token.schemas';
import {
  TCreateRefreshToken,
  TDeleteRefreshToken,
  TFindRefreshToken,
  TMakeAccessToken,
  TMakeRefreshToken,
  TUpdateRefreshToken,
  TValidateTokenPayload,
  TVerifyAccessToken,
  TVerifyRefreshToken
} from '#/types/token.types';

export class TokenService {
  private static jwtVerify(token: string, secret: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, async (error, decoded) => {
        if (error) {
          if (error instanceof jwt.JsonWebTokenError) {
            if (error instanceof jwt.TokenExpiredError) {
              return reject(new TokenExpiredError());
            }
            return reject(new UnauthorizedError());
          }
          return reject(error);
        }
        return resolve(decoded);
      });
    });
  }

  private static async validateTokenPayload<T extends z.AnyZodObject>({
    schema,
    payload
  }: TValidateTokenPayload<T>): Promise<z.infer<T>> {
    const result = await schema.safeParseAsync(payload);

    if (!result.success) {
      throw new UnauthorizedError({ message: result.error.message });
    }

    return result.data;
  }

  static findRefreshToken({ userId }: TFindRefreshToken) {
    return prisma.refreshToken.findUnique({ where: { userId } });
  }
  static createRefreshToken({ userId, refreshToken }: TCreateRefreshToken) {
    return prisma.refreshToken.create({ data: { userId, refreshToken } });
  }
  static updateRefreshToken({ userId, refreshToken }: TUpdateRefreshToken) {
    return prisma.refreshToken.update({
      where: { userId },
      data: { refreshToken }
    });
  }
  static deleteRefreshToken({ userId }: TDeleteRefreshToken) {
    return prisma.refreshToken.delete({ where: { userId } });
  }

  static async makeAccessToken({ userId, email, role }: TMakeAccessToken) {
    const payload = {
      email,
      role
    };

    return jwt.sign(payload, CONFIG.APP_JWT_ACCESS_SECRET, {
      subject: userId,
      algorithm: JWT_SIGNING_ALGORITHM,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
  }

  static async makeRefreshToken({ userId }: TMakeRefreshToken) {
    return jwt.sign({}, CONFIG.APP_JWT_REFRESH_SECRET, {
      subject: userId,
      algorithm: JWT_SIGNING_ALGORITHM,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
  }

  static async verifyRefreshToken({ refreshToken }: TVerifyRefreshToken) {
    const payload = await this.jwtVerify(
      refreshToken,
      CONFIG.APP_JWT_REFRESH_SECRET
    );

    return await this.validateTokenPayload({
      payload,
      schema: RefreshTokenPayloadSchema
    });
  }

  static async verifyAccessToken({ accessToken }: TVerifyAccessToken) {
    const payload = await this.jwtVerify(
      accessToken,
      CONFIG.APP_JWT_ACCESS_SECRET
    );

    return await this.validateTokenPayload({
      payload,
      schema: AccessTokenPayloadSchema
    });
  }
}
