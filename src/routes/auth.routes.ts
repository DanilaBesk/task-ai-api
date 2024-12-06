import { Router } from 'express';
import { AuthController } from '#/controllers';
import { CheckAccessTokenMiddleware } from '#/middlewares';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентификация и авторизация
 */

/**
 * @swagger
 * /auth/registration:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/auth/requests/Registration'
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/auth/responses/AuthResponse'
 *         headers:
 *           $ref: '#/components/auth/responses/RefreshTokenCookieHeader'
 *       400:
 *         description: ValidationError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/ValidationError'
 *       409:
 *         description: EmailAlreadyTakenError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/EmailAlreadyTakenError'
 */
authRouter.post('/registration', AuthController.registration);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход существующего пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/auth/requests/Login'
 *     responses:
 *       200:
 *         description: Пользователь успешно вошел в систему
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/auth/responses/AuthResponse'
 *         headers:
 *           $ref: '#/components/auth/responses/RefreshTokenCookieHeader'
 *       400:
 *         description: ValidationError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/ValidationError'
 *       401:
 *         description: InvalidCredentialsError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/InvalidCredentialsError'
 */
authRouter.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Auth]
 *     security:
 *     - BearerAuth: []
 *     responses:
 *       200:
 *         description: Пользователь успешно вышел из системы
 *         content:
 *           text/plain:
 *             schema:
 *             $ref: '#/components/common/responses/ResponseOK'
 *       401:
 *         description: UnauthorizedError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/UnauthorizedError'
 *
 */
authRouter.post('/logout', CheckAccessTokenMiddleware, AuthController.logout);

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Обновить токен доступа
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Токен доступа успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/auth/responses/AuthResponse'
 *         headers:
 *           $ref: '#/components/auth/responses/RefreshTokenCookieHeader'
 *       400:
 *         description: ValidationError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/ValidationError'
 *       401:
 *         description: UnauthorizedError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/UnauthorizedError'
 */
authRouter.post('/refresh-tokens', AuthController.refreshTokens);

export { authRouter };
