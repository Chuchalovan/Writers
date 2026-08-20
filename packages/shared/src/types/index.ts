export type Locale = "ru" | "en";

export type ProjectStatus = "draft" | "in_progress" | "completed" | "archived";

export type ManuscriptNodeType = "part" | "chapter" | "scene";

export type SceneStatus = "idea" | "planned" | "draft" | "revision" | "ready";

export type WorldArticleType =
  | "location"
  | "organization"
  | "object"
  | "rule"
  | "culture"
  | "event"
  | "article";

export type PlotMethod = "blank" | "three-act" | "heros-journey" | "beat-sheet";

export type RelationshipType =
  | "family"
  | "ally"
  | "enemy"
  | "romantic"
  | "mentor"
  | "other";

export type GoalType = "daily" | "project";

export type AIProvider = "openai" | "anthropic" | "custom";

export interface Project {
  id: string;
  userId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  logline: string | null;
  synopsis: string | null;
  genre: string | null;
  coverUrl: string | null;
  templateId: string | null;
  plotMethod: PlotMethod;
  continueNodeId: string | null;
  targetWordCount: number | null;
  totalWordCount: number;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export interface ManuscriptNode {
  id: string;
  projectId: string;
  parentId: string | null;
  type: ManuscriptNodeType;
  title: string;
  position: number;
  status: SceneStatus | null;
  synopsis: string | null;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface SceneContent {
  sceneId: string;
  contentJson: Record<string, unknown>;
  plainText: string | null;
  version: number;
  updatedAt: Date;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  role: string | null;
  summary: string | null;
  appearance: string | null;
  motivation: string | null;
  notes: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterRelationship {
  id: string;
  projectId: string;
  fromCharacterId: string;
  toCharacterId: string;
  type: RelationshipType;
  label: string | null;
  comment: string | null;
  symmetric: boolean;
}

export interface WorldArticle {
  id: string;
  projectId: string;
  type: WorldArticleType;
  title: string;
  summary: string | null;
  contentJson: Record<string, unknown>;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** @deprecated Use ManuscriptNode with type "chapter" or "scene" */
export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  content: Record<string, unknown>;
  plainText: string | null;
  wordCount: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyStat {
  id: string;
  userId: string;
  projectId: string | null;
  date: Date;
  wordsWritten: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type IdeaType = "plot" | "character" | "conflict" | "general";

export interface Idea {
  title: string;
  description: string;
}
