import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "./id";

const timestamps = {
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const projectStatus = pgEnum("ProjectStatus", ["draft", "in_progress", "completed", "archived"]);
export const manuscriptNodeType = pgEnum("ManuscriptNodeType", ["part", "chapter", "scene"]);
export const sceneStatus = pgEnum("SceneStatus", ["idea", "planned", "draft", "revision", "ready"]);
export const worldArticleType = pgEnum("WorldArticleType", [
  "location",
  "organization",
  "object",
  "rule",
  "culture",
  "event",
  "article",
]);
export const relationshipType = pgEnum("RelationshipType", [
  "family",
  "ally",
  "enemy",
  "romantic",
  "mentor",
  "other",
]);
export const goalType = pgEnum("GoalType", ["daily", "project"]);

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    image: text("image"),
    locale: text("locale").default("ru").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("user_email_key").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt", { precision: 3, mode: "date" }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("session_token_key").on(table.token)]
);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { precision: 3, mode: "date" }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { precision: 3, mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  ...timestamps,
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { precision: 3, mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const project = pgTable(
  "Project",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    logline: text("logline"),
    synopsis: text("synopsis"),
    genre: text("genre"),
    coverUrl: text("coverUrl"),
    templateId: text("templateId"),
    plotMethod: text("plotMethod").default("blank").notNull(),
    continueNodeId: text("continueNodeId").references((): AnyPgColumn => manuscriptNode.id, {
      onDelete: "set null",
    }),
    targetWordCount: integer("targetWordCount"),
    totalWordCount: integer("totalWordCount").default(0).notNull(),
    status: projectStatus("status").default("draft").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    archivedAt: timestamp("archivedAt", { precision: 3, mode: "date" }),
  },
  (table) => [
    index("Project_userId_idx").on(table.userId),
    index("Project_userId_status_idx").on(table.userId, table.status),
    index("Project_userId_updatedAt_idx").on(table.userId, table.updatedAt),
  ]
);

export const manuscriptNode = pgTable(
  "ManuscriptNode",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    parentId: text("parentId").references((): AnyPgColumn => manuscriptNode.id, { onDelete: "set null" }),
    type: manuscriptNodeType("type").notNull(),
    title: text("title").notNull(),
    position: integer("position").default(0).notNull(),
    status: sceneStatus("status"),
    synopsis: text("synopsis"),
    wordCount: integer("wordCount").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deletedAt", { precision: 3, mode: "date" }),
  },
  (table) => [
    index("ManuscriptNode_projectId_idx").on(table.projectId),
    index("ManuscriptNode_projectId_parentId_position_idx").on(table.projectId, table.parentId, table.position),
    index("ManuscriptNode_projectId_type_idx").on(table.projectId, table.type),
    index("ManuscriptNode_projectId_deletedAt_idx").on(table.projectId, table.deletedAt),
  ]
);

export const sceneContent = pgTable("SceneContent", {
  sceneId: text("sceneId")
    .primaryKey()
    .references(() => manuscriptNode.id, { onDelete: "cascade" }),
  contentJson: jsonb("contentJson").$type<Record<string, unknown>>().default({}).notNull(),
  plainText: text("plainText"),
  version: integer("version").default(1).notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const character = pgTable(
  "Character",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    role: text("role"),
    summary: text("summary"),
    appearance: text("appearance"),
    motivation: text("motivation"),
    notes: text("notes"),
    extra: jsonb("extra").$type<Record<string, unknown>>(),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deletedAt", { precision: 3, mode: "date" }),
  },
  (table) => [
    index("Character_projectId_idx").on(table.projectId),
    index("Character_projectId_name_idx").on(table.projectId, table.name),
  ]
);

export const worldArticle = pgTable(
  "WorldArticle",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: worldArticleType("type").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    contentJson: jsonb("contentJson").$type<Record<string, unknown>>().default({}).notNull(),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deletedAt", { precision: 3, mode: "date" }),
  },
  (table) => [
    index("WorldArticle_projectId_idx").on(table.projectId),
    index("WorldArticle_projectId_type_idx").on(table.projectId, table.type),
    index("WorldArticle_projectId_title_idx").on(table.projectId, table.title),
  ]
);

export const sceneMetadata = pgTable("SceneMetadata", {
  sceneId: text("sceneId")
    .primaryKey()
    .references(() => manuscriptNode.id, { onDelete: "cascade" }),
  goal: text("goal"),
  conflict: text("conflict"),
  outcome: text("outcome"),
  povCharacterId: text("povCharacterId").references(() => character.id, { onDelete: "set null" }),
  locationId: text("locationId").references(() => worldArticle.id, { onDelete: "set null" }),
  storyTime: text("storyTime"),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sceneParticipant = pgTable(
  "SceneParticipant",
  {
    sceneId: text("sceneId")
      .notNull()
      .references(() => manuscriptNode.id, { onDelete: "cascade" }),
    characterId: text("characterId")
      .notNull()
      .references(() => character.id, { onDelete: "cascade" }),
    projectId: text("projectId").notNull(),
    sortOrder: integer("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.sceneId, table.characterId] }),
    index("SceneParticipant_projectId_idx").on(table.projectId),
  ]
);

export const characterRelationship = pgTable(
  "CharacterRelationship",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    fromCharacterId: text("fromCharacterId")
      .notNull()
      .references(() => character.id, { onDelete: "cascade" }),
    toCharacterId: text("toCharacterId")
      .notNull()
      .references(() => character.id, { onDelete: "cascade" }),
    type: relationshipType("type").notNull(),
    label: text("label"),
    comment: text("comment"),
    symmetric: boolean("symmetric").default(true).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("CharacterRelationship_fromCharacterId_toCharacterId_type_key").on(
      table.fromCharacterId,
      table.toCharacterId,
      table.type
    ),
    index("CharacterRelationship_projectId_idx").on(table.projectId),
  ]
);

export const dailyStat = pgTable(
  "DailyStat",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: text("projectId").references(() => project.id, { onDelete: "cascade" }),
    date: date("date", { mode: "date" }).notNull(),
    wordsWritten: integer("wordsWritten").default(0).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("DailyStat_userId_projectId_date_key").on(table.userId, table.projectId, table.date),
    index("DailyStat_userId_date_idx").on(table.userId, table.date),
    index("DailyStat_projectId_date_idx").on(table.projectId, table.date),
  ]
);

export const userApiKey = pgTable(
  "UserApiKey",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    encryptedKey: text("encryptedKey").notNull(),
    keyHint: text("keyHint").notNull(),
    model: text("model"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("UserApiKey_userId_provider_key").on(table.userId, table.provider)]
);

export const writingGoal = pgTable("WritingGoal", {
  id: text("id").primaryKey().$defaultFn(createId),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  projectId: text("projectId").references(() => project.id, { onDelete: "cascade" }),
  type: goalType("type").notNull(),
  targetWords: integer("targetWords").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  projects: many(project),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, { fields: [project.userId], references: [user.id] }),
  continueNode: one(manuscriptNode, {
    fields: [project.continueNodeId],
    references: [manuscriptNode.id],
  }),
  nodes: many(manuscriptNode),
  characters: many(character),
  worldArticles: many(worldArticle),
  relationships: many(characterRelationship),
}));

export const manuscriptNodeRelations = relations(manuscriptNode, ({ one, many }) => ({
  project: one(project, { fields: [manuscriptNode.projectId], references: [project.id] }),
  parent: one(manuscriptNode, {
    fields: [manuscriptNode.parentId],
    references: [manuscriptNode.id],
    relationName: "NodeTree",
  }),
  children: many(manuscriptNode, { relationName: "NodeTree" }),
  content: one(sceneContent),
  metadata: one(sceneMetadata),
  participants: many(sceneParticipant),
}));

export const sceneContentRelations = relations(sceneContent, ({ one }) => ({
  scene: one(manuscriptNode, { fields: [sceneContent.sceneId], references: [manuscriptNode.id] }),
}));

export const sceneMetadataRelations = relations(sceneMetadata, ({ one }) => ({
  scene: one(manuscriptNode, { fields: [sceneMetadata.sceneId], references: [manuscriptNode.id] }),
  povCharacter: one(character, { fields: [sceneMetadata.povCharacterId], references: [character.id] }),
  location: one(worldArticle, { fields: [sceneMetadata.locationId], references: [worldArticle.id] }),
}));

export const sceneParticipantRelations = relations(sceneParticipant, ({ one }) => ({
  scene: one(manuscriptNode, { fields: [sceneParticipant.sceneId], references: [manuscriptNode.id] }),
  character: one(character, { fields: [sceneParticipant.characterId], references: [character.id] }),
}));

export const characterRelations = relations(character, ({ one, many }) => ({
  project: one(project, { fields: [character.projectId], references: [project.id] }),
  participations: many(sceneParticipant),
  relationsFrom: many(characterRelationship, { relationName: "RelFrom" }),
  relationsTo: many(characterRelationship, { relationName: "RelTo" }),
}));

export const characterRelationshipRelations = relations(characterRelationship, ({ one }) => ({
  project: one(project, { fields: [characterRelationship.projectId], references: [project.id] }),
  from: one(character, {
    fields: [characterRelationship.fromCharacterId],
    references: [character.id],
    relationName: "RelFrom",
  }),
  to: one(character, {
    fields: [characterRelationship.toCharacterId],
    references: [character.id],
    relationName: "RelTo",
  }),
}));

export const worldArticleRelations = relations(worldArticle, ({ one, many }) => ({
  project: one(project, { fields: [worldArticle.projectId], references: [project.id] }),
  sceneLocations: many(sceneMetadata),
}));

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Project = typeof project.$inferSelect;
export type ProjectStatus = (typeof projectStatus.enumValues)[number];
export type ManuscriptNode = typeof manuscriptNode.$inferSelect;
export type ManuscriptNodeType = (typeof manuscriptNodeType.enumValues)[number];
export type SceneStatus = (typeof sceneStatus.enumValues)[number];
export type SceneContent = typeof sceneContent.$inferSelect;
export type SceneMetadata = typeof sceneMetadata.$inferSelect;
export type SceneParticipant = typeof sceneParticipant.$inferSelect;
export type Character = typeof character.$inferSelect;
export type CharacterRelationship = typeof characterRelationship.$inferSelect;
export type WorldArticle = typeof worldArticle.$inferSelect;
export type WorldArticleType = (typeof worldArticleType.enumValues)[number];
export type RelationshipType = (typeof relationshipType.enumValues)[number];
export type DailyStat = typeof dailyStat.$inferSelect;
export type UserApiKey = typeof userApiKey.$inferSelect;
export type WritingGoal = typeof writingGoal.$inferSelect;
export type GoalType = (typeof goalType.enumValues)[number];
