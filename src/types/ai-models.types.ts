import { OpenAI } from 'openai';
import { AIModels } from '#/ai-models/openai';
import { TMessage } from '#/types/ai-action.types';

export type TOpenAIModel = OpenAI.ChatModel;

export type TOpenAIChatParams = Omit<
  OpenAI.ChatCompletionCreateParams,
  'messages' | 'model' | 'stream'
>;

export type TAIModel = keyof typeof AIModels;

export type TGenerate = {
  messages: TMessage[];
  stream?: boolean;
  signal: AbortSignal;
};
export type TGenerateStream = TGenerate & { stream: true };
export type TGenerateSync = TGenerate & { stream?: false };

export type TCalculateCost = {
  messages: TMessage[];
};

export type TBeforeGeneration = {
  messages: TMessage[];
  stream?: boolean;
};

export type TAIModelConstructor<T extends string> = {
  name: T;
  model: TOpenAIModel;
  creditsPer100Tokens: number;
  systemMessage?: string;
  beforeGeneration?: ({ messages, stream }: TBeforeGeneration) => void;
  chatParams?: TOpenAIChatParams;
};
