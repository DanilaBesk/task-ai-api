import { AIModel } from '#/ai-models/openai/base.model';

export const gpt_3_5_turbo = new AIModel({
  name: 'gpt-3.5-turbo' as const,
  creditsPer100Tokens: 5,
  model: 'gpt-3.5-turbo'
});

export const gpt_4o = new AIModel({
  name: 'gpt-4o' as const,
  creditsPer100Tokens: 20,
  model: 'gpt-4o'
});
