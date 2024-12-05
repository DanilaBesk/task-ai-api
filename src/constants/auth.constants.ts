import { CookieOptions } from 'express';

export const BCRYPT_SALT_ROUNDS = 10;

export const JWT_SIGNING_ALGORITHM = 'HS512';

export const ACCESS_TOKEN_EXPIRES_IN = 5 * 60;
export const REFRESH_TOKEN_EXPIRES_IN = 14 * 24 * 60 * 60;

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
  path: '/api/auth',
  domain: 'localhost',
  secure: false,
  httpOnly: true,
  sameSite: 'strict'
};
