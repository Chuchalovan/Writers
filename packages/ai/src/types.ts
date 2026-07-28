export interface CompleteParams {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIProviderInterface {
  name: string;
  complete(params: CompleteParams): Promise<string>;
  stream(params: CompleteParams): AsyncIterable<string>;
}

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}
