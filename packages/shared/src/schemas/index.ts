import { z } from "zod";

const cuid = z.string().cuid();
const title = z.string().trim().min(1).max(200);

export const CreateProjectSchema = z.object({
  title,
  subtitle: z.string().max(200).optional(),
  logline: z.string().max(500).optional(),
  synopsis: z.string().max(20000).optional(),
  genre: z.string().max(100).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  id: cuid,
  targetWordCount: z.number().int().positive().optional(),
  status: z.enum(["draft", "in_progress", "completed", "archived"]).optional(),
  plotMethod: z.enum(["blank", "three-act", "heros-journey", "beat-sheet"]).optional(),
});

export const ListProjectsSchema = z.object({
  query: z.string().max(200).optional(),
  includeArchived: z.boolean().optional(),
});

export const CreateManuscriptNodeSchema = z.object({
  projectId: cuid,
  parentId: cuid.nullable().optional(),
  type: z.enum(["part", "chapter", "scene"]),
  title: title.optional(),
});

export const UpdateManuscriptNodeSchema = z.object({
  id: cuid,
  title: title.optional(),
  status: z.enum(["idea", "planned", "draft", "revision", "ready"]).optional(),
  synopsis: z.string().max(5000).optional(),
  position: z.number().int().min(0).optional(),
});

export const ReorderNodesSchema = z.object({
  projectId: cuid,
  parentId: cuid.nullable(),
  orderedIds: z.array(cuid).min(1),
});

export const MoveNodeSchema = z.object({
  id: cuid,
  newParentId: cuid.nullable(),
  position: z.number().int().min(0),
});

export const SetSceneStatusSchema = z.object({
  id: cuid,
  status: z.enum(["idea", "planned", "draft", "revision", "ready"]),
});

export const UpdateSceneContentSchema = z.object({
  sceneId: cuid,
  contentJson: z.record(z.unknown()),
  plainText: z.string(),
  baseVersion: z.number().int().min(1),
});

export const CreateCharacterSchema = z.object({
  projectId: cuid,
  name: title,
  role: z.string().max(100).optional(),
  summary: z.string().max(5000).optional(),
  appearance: z.string().max(5000).optional(),
  motivation: z.string().max(5000).optional(),
  notes: z.string().max(20000).optional(),
  imageUrl: z.string().url().optional(),
});

export const UpdateCharacterSchema = CreateCharacterSchema.omit({ projectId: true }).partial().extend({
  id: cuid,
});

export const UpsertCharacterRelationshipSchema = z
  .object({
    projectId: cuid,
    fromCharacterId: cuid,
    toCharacterId: cuid,
    type: z.enum(["family", "ally", "enemy", "romantic", "mentor", "other"]),
    label: z.string().max(100).optional(),
    comment: z.string().max(2000).optional(),
    symmetric: z.boolean().optional(),
  })
  .refine((value) => value.fromCharacterId !== value.toCharacterId, {
    message: "A character cannot be related to itself",
    path: ["toCharacterId"],
  })
  .refine((value) => value.type !== "other" || Boolean(value.label?.trim()), {
    message: "Label is required when type is other",
    path: ["label"],
  });

export const CreateWorldArticleSchema = z.object({
  projectId: cuid,
  type: z.enum([
    "location",
    "organization",
    "object",
    "rule",
    "culture",
    "event",
    "article",
  ]),
  title,
  summary: z.string().max(5000).optional(),
  contentJson: z.record(z.unknown()).optional(),
});

export const UpdateWorldArticleSchema = CreateWorldArticleSchema.omit({
  projectId: true,
})
  .partial()
  .extend({ id: cuid });

export const LinkCharacterToSceneSchema = z.object({
  sceneId: cuid,
  characterId: cuid,
});

export const SearchByTitleSchema = z.object({
  projectId: cuid,
  query: z.string().min(1).max(200),
});

export const UpdateSceneMetadataSchema = z.object({
  sceneId: cuid,
  goal: z.string().max(5000).nullable().optional(),
  conflict: z.string().max(5000).nullable().optional(),
  outcome: z.string().max(5000).nullable().optional(),
  povCharacterId: cuid.nullable().optional(),
  locationId: cuid.nullable().optional(),
  storyTime: z.string().max(200).nullable().optional(),
});

export const ExportScopeSchema = z.object({
  projectId: cuid,
  format: z.enum(["docx", "txt", "pdf", "markdown", "zip"]),
  scope: z.discriminatedUnion("type", [
    z.object({ type: z.literal("project") }),
    z.object({ type: z.literal("part"), partId: cuid }),
    z.object({ type: z.literal("scenes"), sceneIds: z.array(cuid).min(1) }),
  ]),
});

export const AIContextSchema = z.object({
  projectId: cuid,
  message: z.string().min(1),
  level: z.number().int().min(0).max(3),
  contextEntityIds: z.array(cuid).default([]),
  conversationId: cuid.nullable().optional(),
  selectionPlainText: z.string().optional(),
});

/** @deprecated Use AIContextSchema. Not part of the MVP contract. */
export const AIChatSchema = AIContextSchema;

/** @deprecated P2 — not a Beta blocker. */
export const SaveApiKeySchema = z.object({
  provider: z.enum(["openai", "anthropic", "custom"]),
  apiKey: z.string().min(1),
  model: z.string().optional(),
});

/** @deprecated Use CreateManuscriptNodeSchema */
export const CreateChapterSchema = z.object({
  projectId: cuid,
  title: title.optional(),
});

/** @deprecated Use UpdateManuscriptNodeSchema + UpdateSceneContentSchema */
export const UpdateChapterSchema = z.object({
  id: cuid,
  title: title.optional(),
  content: z.record(z.unknown()).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type ListProjectsInput = z.infer<typeof ListProjectsSchema>;
export type CreateManuscriptNodeInput = z.infer<typeof CreateManuscriptNodeSchema>;
export type UpdateManuscriptNodeInput = z.infer<typeof UpdateManuscriptNodeSchema>;
export type ReorderNodesInput = z.infer<typeof ReorderNodesSchema>;
export type MoveNodeInput = z.infer<typeof MoveNodeSchema>;
export type UpdateSceneContentInput = z.infer<typeof UpdateSceneContentSchema>;
export type CreateCharacterInput = z.infer<typeof CreateCharacterSchema>;
export type UpsertCharacterRelationshipInput = z.infer<typeof UpsertCharacterRelationshipSchema>;
export type CreateWorldArticleInput = z.infer<typeof CreateWorldArticleSchema>;
export type AIContextInput = z.infer<typeof AIContextSchema>;
export type ExportScopeInput = z.infer<typeof ExportScopeSchema>;
