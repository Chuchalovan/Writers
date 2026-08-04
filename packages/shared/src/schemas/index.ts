import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  logline: z.string().max(500).optional(),
  synopsis: z.string().max(10000).optional(),
  genre: z.string().max(100).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: z.string().cuid(),
  targetWordCount: z.number().int().positive().optional(),
  status: z.enum(["draft", "in_progress", "completed", "archived"]).optional(),
});

export const CreateManuscriptNodeSchema = z.object({
  projectId: z.string().cuid(),
  parentId: z.string().cuid().optional(),
  type: z.enum(["part", "chapter", "scene"]),
  title: z.string().min(1).max(200).optional(),
});

export const UpdateManuscriptNodeSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200).optional(),
  status: z.enum(["idea", "planned", "draft", "revision", "ready"]).optional(),
  synopsis: z.string().max(5000).optional(),
  position: z.number().int().min(0).optional(),
});

export const UpdateSceneContentSchema = z.object({
  sceneId: z.string().cuid(),
  contentJson: z.record(z.unknown()).optional(),
  plainText: z.string().optional(),
});

/** @deprecated Use CreateManuscriptNodeSchema */
export const CreateChapterSchema = z.object({
  projectId: z.string().cuid(),
  title: z.string().min(1).max(200).optional(),
});

/** @deprecated Use UpdateManuscriptNodeSchema + UpdateSceneContentSchema */
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
export type CreateManuscriptNodeInput = z.infer<typeof CreateManuscriptNodeSchema>;
export type UpdateManuscriptNodeInput = z.infer<typeof UpdateManuscriptNodeSchema>;
export type UpdateSceneContentInput = z.infer<typeof UpdateSceneContentSchema>;
export type CreateChapterInput = z.infer<typeof CreateChapterSchema>;
export type UpdateChapterInput = z.infer<typeof UpdateChapterSchema>;
