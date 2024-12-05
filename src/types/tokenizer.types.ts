import { TOpenAIModel } from '#/types/ai-models.types';
import { TMessage } from '#/types/ai-action.types';

export type TGetTokensCount = {
  model: TOpenAIModel;
  messages: TMessage[];
};
