import { z } from 'zod';
import { AIModels } from '#/ai-models/openai';
import { MAX_PROMPT_LENGTH } from '#/constants/ai-action.constants';

export const AI_MODEL = z.enum(
  Object.keys(AIModels) as [keyof typeof AIModels]
);

const PROMPT = z.string().max(MAX_PROMPT_LENGTH);

export const GenerateText = z.object({
  body: z
    .object({
      model: AI_MODEL,
      prompt: PROMPT
    })
    .strict()
});
