import {
  UnauthorizedError,
  NotFoundError,
  PermissionDeniedError
} from '#/errors/api-error';
import { prisma } from '#/providers';
import {
  TAdjustCredits,
  TCreateUser,
  TDeleteUser,
  TFindUserByEmail,
  TFindUserById,
  TGetUserInfo
} from '#/types/user.types';

export class UserService {
  static createUser({ email, password, role, credits }: TCreateUser) {
    return prisma.user.create({
      data: {
        email,
        password,
        role,
        credits
      }
    });
  }

  static findUserByEmail({ email }: TFindUserByEmail) {
    return prisma.user.findUnique({ where: { email } });
  }

  static findUserById({ userId }: TFindUserById) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  static async getUserInfo({ userId }: TGetUserInfo) {
    const user = await this.findUserById({ userId });

    if (!user) {
      throw new UnauthorizedError();
    }

    const { id, role, credits, email, createdAt } = user;

    return { user: { id, role, credits, email, createdAt } };
  }

  private static balanceOperations = {
    reduce: 'decrement',
    increase: 'increment',
    set: 'set'
  } as const;

  static async adjustCredits({
    adminId,
    userId,
    count,
    operation
  }: TAdjustCredits) {
    const admin = await this.findUserById({ userId: adminId });

    if (!admin) {
      throw new UnauthorizedError();
    }
    if (admin.role !== 'admin') {
      throw new PermissionDeniedError({
        message: 'Access denied. Invalid role.'
      });
    }

    const user = await this.findUserById({ userId });

    if (!user) {
      throw new NotFoundError({ message: 'User not found.' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { [this.balanceOperations[operation]]: count }
      }
    });
  }

  static deleteUser({ userId }: TDeleteUser) {
    return prisma.user.delete({
      where: { id: userId }
    });
  }
}
