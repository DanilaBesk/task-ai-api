import { encodeChat } from 'gpt-tokenizer';
import { TGetTokensCount } from '#/types/tokenizer.types';

export class TokenizerService {
  static getTokensCount({ model, messages }: TGetTokensCount) {
    if (model === 'gpt-4o-2024-11-20') {
      // Данная модель не поддерживается токенизатором, поэтому используется ближайшая поддерживаемая модель
      model = 'gpt-4o-2024-08-06';
    }
    const encoded = encodeChat(messages, model);

    return encoded.length;
  }
}
