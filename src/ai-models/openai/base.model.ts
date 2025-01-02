import { openai } from '#/providers';
import { TokenizerService } from '#/services';
import {
  TAIModelConstructor,
  TBeforeGeneration,
  TCalculateCost,
  TGenerate,
  TGenerateStream,
  TGenerateSync,
  TOpenAIChatParams,
  TOpenAIModel
} from '#/types/ai-models.types';

export class AIModel<T extends string> {
  public name: T;

  private model: TOpenAIModel;
  public creditsPer100Tokens: number;
  private chatParams: TOpenAIChatParams;
  private systemMessage?: string;
  private beforeGeneration?({ messages, stream }: TBeforeGeneration): void;

  constructor({
    name,
    model,
    creditsPer100Tokens,
    systemMessage,
    beforeGeneration,
    chatParams
  }: TAIModelConstructor<T>) {
    this.name = name;
    this.model = model;
    this.creditsPer100Tokens = creditsPer100Tokens;
    this.systemMessage = systemMessage;
    this.beforeGeneration = beforeGeneration;
    this.chatParams = chatParams ?? {};
  }
  public generate({
    messages,
    stream,
    signal
  }: TGenerateStream): Promise<
    AsyncGenerator<{ content: string | null | undefined }>
  >;

  public generate({ messages, stream, signal }: TGenerateSync): Promise<{
    content: string | null;
  }>;

  public async generate({ messages, stream, signal }: TGenerate) {
    this.beforeGeneration?.({ messages, stream });

    if (this.systemMessage) {
      messages.unshift({ role: 'system', content: this.systemMessage });
    }

    const response = await openai.chat.completions.create(
      {
        ...this.chatParams,
        model: this.model,
        messages,
        stream
      },
      { signal, timeout: 15000 }
    );

    if (Symbol.asyncIterator in response) {
      return (async function* () {
        for await (const chunk of response) {
          const content = chunk.choices[0].delta.content;
          yield { content };
        }
      })();
    } else if (!stream) {
      const content = response.choices[0].message.content;
      return { content };
    }
  }

  public calculateCost({ messages }: TCalculateCost) {
    const tokensCount = TokenizerService.getTokensCount({
      model: this.model,
      messages
    });

    return Math.ceil((tokensCount / 100) * this.creditsPer100Tokens);
  }
}
