import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  genre: z.string().max(100).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.string().cuid(),
  targetWordCount: z.number().int().positive().optional(),
  status: z.enum(["draft", "in_progress", "completed", "archived"]).optional(),
});

export const CreateChapterSchema = z.object({
  projectId: z.string().cuid(),
  title: z.string().min(1).max(200).optional(),
});

export const UpdateChapterSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.unknown()).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const SaveApiKeySchema = z.object({
  provider: z.enum(["openai", "anthropic", "custom"]),
  apiKey: z.string().min(1),
  model: z.string().optional(),
});

export const AIGrammarSchema = z.object({
  text: z.string().min(1),
  projectId: z.string().cuid().optional(),
  locale: z.enum(["ru", "en"]).default("ru"),
});

export const AIContinueSchema = z.object({
  text: z.string().min(1),
  projectId: z.string().cuid().optional(),
  maxTokens: z.number().int().positive().max(4000).default(500),
});

export const AIIdeasSchema = z.object({
  type: z.enum(["plot", "character", "conflict", "general"]),
  context: z.string().optional(),
  projectId: z.string().cuid().optional(),
});

export const AIChatSchema = z.object({
  message: z.string().min(1),
  projectId: z.string().cuid(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .default([]),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type CreateChapterInput = z.infer<typeof CreateChapterSchema>;
export type UpdateChapterInput = z.infer<typeof UpdateChapterSchema>;
