import { gpt_3_5_turbo, gpt_4o } from '#/ai-models/openai/fabric';

export const AIModels = {
  [gpt_3_5_turbo.name]: gpt_3_5_turbo,
  [gpt_4o.name]: gpt_4o
} as const;
