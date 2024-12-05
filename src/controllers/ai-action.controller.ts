import { NextFunction, Request, Response } from 'express';

import { AIAction } from '#/services';
import { GenerateText } from '#/schemas/ai-action.schemas';
import { validateRequestData } from '#/utils/validate-request-data';

export class AIActionController {
  static async generateText(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: { prompt, model }
      } = await validateRequestData({
        schema: GenerateText,
        req
      });

      const { sub: userId } = req.accessTokenPayload!;

      await AIAction.generateText({
        res,
        userId,
        model,
        prompt
      });
    } catch (error) {
      next(error);
    }
  }
}
