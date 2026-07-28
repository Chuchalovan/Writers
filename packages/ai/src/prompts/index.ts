import type { IdeaType, Locale } from "@manuscript/shared";

export function grammarPrompt(locale: Locale): string {
  return locale === "ru"
    ? "Ты — редактор. Исправь грамматику, пунктуацию и стиль текста. Верни только исправленный текст без пояснений."
    : "You are an editor. Fix grammar, punctuation, and style. Return only the corrected text without explanations.";
}

export function continuePrompt(): string {
  return "You are a creative writing assistant. Continue the given text naturally, matching the author's style and tone. Write 1-3 paragraphs.";
}

export function ideasPrompt(type: IdeaType): string {
  const prompts: Record<IdeaType, string> = {
    plot: "Generate 3 creative plot ideas based on the context. Return JSON array: [{title, description}]",
    character: "Generate 3 character ideas with name, role, and brief backstory. Return JSON array: [{title, description}]",
    conflict: "Generate 3 conflict ideas that could drive the story. Return JSON array: [{title, description}]",
    general: "Generate 3 creative writing ideas. Return JSON array: [{title, description}]",
  };
  return prompts[type];
}

export function chatSystemPrompt(projectTitle: string, synopsis?: string): string {
  return `You are a writing assistant for the project "${projectTitle}".${synopsis ? ` Synopsis: ${synopsis}` : ""} Help the author with plot, characters, structure, and writing advice. Be concise and creative.`;
}
