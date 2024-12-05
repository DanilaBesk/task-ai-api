import { AIModels } from '#/ai-models/openai';
import { Response } from 'express';

export type TMessageRole = 'system' | 'user' | 'assistant';

export type TMessage = {
  role: TMessageRole;
  name?: string;
  content: string;
};

export type TGenerateText = {
  res: Response;
  userId: string;
  model: keyof typeof AIModels;
  prompt: string;
};

export type TCreateChankText =
  | {
      finish_reason: 'null';
      content: string;
    }
  | {
      finish_reason: 'limit' | 'stop' | 'error';
    };
