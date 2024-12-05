import { AIModels } from '#/ai-models/openai';
import { z } from 'zod';

export const AI_MODEL = z.enum(
  Object.keys(AIModels) as [keyof typeof AIModels]
);

export const GenerateText = z.object({
  body: z
    .object({
      model: AI_MODEL,
      prompt: z.string()
    })
    .strict()
});
