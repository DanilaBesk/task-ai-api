import * as bcrypt from 'bcrypt';

import {
  UnauthorizedError,
  EmailAlreadyTakenError,
  InvalidCredentialsError,
  PermissionDeniedError
} from '#/errors/api-error';
import { prisma } from '#/providers';
import { TokenService, UserService } from '#/services';
import {
  TRegistration,
  TLogin,
  TLogout,
  TCheckPassword,
  TMakeHashPassword,
  TRefreshTokens
} from '#/types/auth.types';
import { BCRYPT_SALT_ROUNDS } from '#/constants/auth.constants';
import {
  INITIAL_USER_CREDITS,
  INITIAL_USER_ROLE
} from '#/constants/user.constants';

export class AuthService {
  static checkPassword({
    password,
    passwordHash
  }: TCheckPassword): Promise<void> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(
            new PermissionDeniedError({ message: 'Password is incorrect.' })
          );
        }
        return resolve();
      });
    });
  }

  static makeHashPassword({ password }: TMakeHashPassword): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (error, encrypted) => {
        if (error) {
          reject(error);
        }
        resolve(encrypted);
      });
    });
  }

  static async registration({ email, password }: TRegistration) {
    const emailExist = await UserService.findUserByEmail({
      email
    });

    if (emailExist) {
      throw new EmailAlreadyTakenError();
    }

    const hashPassword = await this.makeHashPassword({ password });

    const user = await UserService.createUser({
      email,
      password: hashPassword,
      role: INITIAL_USER_ROLE,
      credits: INITIAL_USER_CREDITS
    });

    const { id: userId, role } = user;

    const refreshToken = await TokenService.makeRefreshToken({ userId });
    const accessToken = await TokenService.makeAccessToken({
      userId,
      email,
      role
    });

    await TokenService.createRefreshToken({
      userId,
      refreshToken
    });

    return { accessToken, refreshToken };
  }

  static async login({ email, password }: TLogin) {
    const user = await UserService.findUserByEmail({ email });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    try {
      await this.checkPassword({
        password,
        passwordHash: user.password
      });
    } catch (error) {
      throw new InvalidCredentialsError();
    }

    const { id: userId, role } = user;

    const refreshToken = await TokenService.makeRefreshToken({ userId });
    const accessToken = await TokenService.makeAccessToken({
      userId,
      email,
      role
    });

    const tokenData = await TokenService.findRefreshToken({ userId });
    if (tokenData) {
      await TokenService.updateRefreshToken({ userId, refreshToken });
    } else {
      await TokenService.createRefreshToken({
        userId,
        refreshToken
      });
    }

    return { accessToken, refreshToken };
  }
  static async logout({ userId }: TLogout) {
    await TokenService.deleteRefreshToken({ userId });
  }

  static async refreshTokens({ userId, refreshToken }: TRefreshTokens) {
    const [user, tokenData] = await Promise.all([
      UserService.findUserById({ userId }),
      TokenService.findRefreshToken({ userId })
    ]);

    if (!user || !tokenData || tokenData.refreshToken !== refreshToken) {
      throw new UnauthorizedError();
    }

    const { email, role } = user;

    const newRefreshToken = await TokenService.makeRefreshToken({ userId });
    const accessToken = await TokenService.makeAccessToken({
      userId,
      email,
      role
    });

    await TokenService.updateRefreshToken({
      userId,
      refreshToken: newRefreshToken
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
