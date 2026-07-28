import type { AIProviderInterface, AIProviderConfig } from "../types";

// TODO: implement OpenAI provider in Sprint 5
export function createOpenAIProvider(_config: AIProviderConfig): AIProviderInterface {
  throw new Error("Not implemented");
}

// TODO: implement custom OpenAI-compatible provider
export function createCustomProvider(_config: AIProviderConfig): AIProviderInterface {
  throw new Error("Not implemented");
}

export function createProvider(
  provider: "openai" | "custom",
  config: AIProviderConfig
): AIProviderInterface {
  switch (provider) {
    case "openai":
      return createOpenAIProvider(config);
    case "custom":
      return createCustomProvider(config);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
