import { Router } from 'express';
import { UserController } from '#/controllers';
import {
  CheckAccessTokenMiddleware,
  CheckUserRoleMiddleware
} from '#/middlewares';

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Пользователь
 */

/**
 * @swagger
 * /user/info:
 *   get:
 *     summary: Получить информацию пользователя
 *     description: Возвращает информацию аутентифицированного пользователя на основе токена доступа.
 *     tags: [User]
 *     security:
 *     - BearerAuth: []
 *     responses:
 *       200:
 *         description: Пользовательская информация успешно извлечена.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/user/responses/UserInfo'
 *       401:
 *         description: UnauthorizedError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/UnauthorizedError'
 */
userRouter.get('/info', CheckAccessTokenMiddleware, UserController.getUserInfo);

/**
 * @swagger
 * /user/adjust-credits:
 *   post:
 *     summary: Обновить кредиты пользователя (только для администратора)
 *     description: Обновить информацию о кредитах (добавить, уменьшить или установить значение). Только для администратора.
 *     tags: [User]
 *     security:
 *     - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/user/requests/AdjustCredits'
 *     responses:
 *       200:
 *         description: Успешное обновление кредитов пользователя.
 *         content:
 *           text/plain:
 *             schema:
 *               $ref: '#/components/common/responses/ResponseOK'
 *       401:
 *         description: UnauthorizedError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/UnauthorizedError'
 *       403:
 *         description: PermissionDeniedError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/PermissionDeniedError'
 *       404:
 *         description: NotFoundError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/NotFoundError'
 *
 */
userRouter.post(
  '/adjust-credits',
  CheckAccessTokenMiddleware,
  CheckUserRoleMiddleware(['admin']),
  UserController.adjustCredits
);

/**
 * @swagger
 * /user/delete:
 *   post:
 *     summary: Удалить пользователя
 *     tags: [User]
 *     security:
 *     - BearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное удаление пользователя.
 *         content:
 *           text/plain:
 *             schema:
 *               $ref: '#/components/common/responses/ResponseOK'
 *       401:
 *         description: UnauthorizedError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/UnauthorizedError'
 */
userRouter.post(
  '/delete',
  CheckAccessTokenMiddleware,
  UserController.deleteUser
);

export { userRouter };
