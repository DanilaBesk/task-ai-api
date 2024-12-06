import { Router } from 'express';
import { AIActionController } from '#/controllers';
import { CheckAccessTokenMiddleware } from '#/middlewares';

const aiActionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Исскуственный интеллект
 */

/**
 * @swagger
 * /ai/generate:
 *   post:
 *     summary: Генерация текста от исскуственного интеллекта
 *     tags: [AI]
 *     security:
 *     - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/ai/requests/Generate'
 *     responses:
 *       200:
 *         description: Текст успешно генерируется
 *         content:
 *           text/event-stream:
 *             schema:
 *               $ref: '#/components/ai/responses/ChunkTextResponse'
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
 *       402:
 *         description: InsufficientCreditsError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/InsufficientCreditsError'
 */
aiActionRouter.post(
  '/generate',
  CheckAccessTokenMiddleware,
  AIActionController.generateText
);

export { aiActionRouter };
