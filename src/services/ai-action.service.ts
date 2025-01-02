import { AIModels } from '#/ai-models/openai';
import {
  InsufficientCreditsError,
  UnauthorizedError
} from '#/errors/api-error';
import { prisma } from '#/providers';
import { UserService } from '#/services';
import {
  TCreateChankText,
  TGenerateText,
  TMessage
} from '#/types/ai-action.types';

export class AIActionService {
  private static createChunkText(chunk: TCreateChankText) {
    return `data: ${JSON.stringify(chunk)}\n\n`;
  }

  static async generateText({ res, userId, model, prompt }: TGenerateText) {
    const user = await UserService.findUserById({ userId });

    if (!user) {
      throw new UnauthorizedError();
    }

    const userMessage: TMessage = {
      role: 'user',
      content: prompt
    };
    const assistantMessage: TMessage = {
      role: 'assistant',
      content: ''
    };

    const AIModel = AIModels[model];

    let cost = AIModel.calculateCost({ messages: [userMessage] });
    if (user.credits - cost < 0) {
      throw new InsufficientCreditsError();
    }

    const abortGeneration = new AbortController();

    res.req.on('close', () => {
      abortGeneration.abort();
      res.end();
    });

    try {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await AIModel.generate({
        messages: [userMessage],
        stream: true,
        signal: abortGeneration.signal
      });

      for await (const chunk of stream) {
        if (res.writableEnded) break;
        if (chunk.content) {
          assistantMessage.content += chunk.content;

          cost = AIModel.calculateCost({
            messages: [userMessage, assistantMessage]
          });

          if (user.credits - cost < 0) {
            abortGeneration.abort();
            res.write(this.createChunkText({ finish_reason: 'limit' }));
            break;
          }

          res.write(
            this.createChunkText({
              finish_reason: 'null',
              content: chunk.content
            })
          );
        }
      }
      if (!res.writableEnded) {
        res.write(this.createChunkText({ finish_reason: 'stop' }));
      }
    } catch (error) {
      if (!res.writableEnded) {
        res.write(this.createChunkText({ finish_reason: 'error' }));
      }
    } finally {
      if (!res.writableEnded) {
        res.end();
      }

      await prisma.$transaction([
        prisma.balanceChange.create({
          data: {
            userId,
            count: cost,
            type: 'reduce',
            sourceType: 'generation_text'
          }
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            credits: { decrement: cost }
          }
        })
      ]);
    }
  }
  static getAIModelsInfo() {
    return Object.entries(AIModels).map(([_, model]) => ({
      name: model.name,
      creditsPer100Tokens: model.creditsPer100Tokens
    }));
  }
}
