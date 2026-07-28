export type Locale = "ru" | "en";

export type ProjectStatus = "draft" | "in_progress" | "completed" | "archived";

export type GoalType = "daily" | "project";

export type AIProvider = "openai" | "anthropic" | "custom";

export type IdeaType = "plot" | "character" | "conflict" | "general";

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  genre: string | null;
  targetWordCount: number | null;
  totalWordCount: number;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Idea {
  title: string;
  description: string;
}
