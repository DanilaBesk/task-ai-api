import { BalanceChangeType, UserRole } from '@prisma/client';

export type TCreateUser = {
  email: string;
  password: string;
  role: UserRole;
  credits: number;
};

export type TFindUserByEmail = {
  email: string;
};

export type TFindUserById = {
  userId: string;
};

export type TGetUserInfo = {
  userId: string;
};

export type TAdjustCredits = {
  adminId: string;
  userId: string;
  count: number;
  operation: BalanceChangeType;
};

export type TDeleteUser = {
  userId: string;
};
