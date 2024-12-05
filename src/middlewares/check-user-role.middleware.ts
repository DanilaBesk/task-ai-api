import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { PermissionDeniedError } from '#/errors/api-error';

export function CheckUserRoleMiddleware(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.accessTokenPayload!;

      if (!allowedRoles.includes(role)) {
        return next(
          new PermissionDeniedError({ message: 'Access denied. Invalid role.' })
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
