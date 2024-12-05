import { UserRole } from '@prisma/client';

export const INITIAL_USER_ROLE = UserRole.client;
export const INITIAL_USER_CREDITS = 500;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 30;

export const MAX_EMAIL_LENGTH = 256;
