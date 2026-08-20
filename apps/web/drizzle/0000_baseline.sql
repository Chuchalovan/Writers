CREATE TYPE "public"."GoalType" AS ENUM('daily', 'project');--> statement-breakpoint
CREATE TYPE "public"."ManuscriptNodeType" AS ENUM('part', 'chapter', 'scene');--> statement-breakpoint
CREATE TYPE "public"."ProjectStatus" AS ENUM('draft', 'in_progress', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."RelationshipType" AS ENUM('family', 'ally', 'enemy', 'romantic', 'mentor', 'other');--> statement-breakpoint
CREATE TYPE "public"."SceneStatus" AS ENUM('idea', 'planned', 'draft', 'revision', 'ready');--> statement-breakpoint
CREATE TYPE "public"."WorldArticleType" AS ENUM('location', 'organization', 'object', 'rule', 'culture', 'event', 'article');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp (3),
	"refreshTokenExpiresAt" timestamp (3),
	"scope" text,
	"password" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Character" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"summary" text,
	"appearance" text,
	"motivation" text,
	"notes" text,
	"extra" jsonb,
	"imageUrl" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"deletedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "CharacterRelationship" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"fromCharacterId" text NOT NULL,
	"toCharacterId" text NOT NULL,
	"type" "RelationshipType" NOT NULL,
	"label" text,
	"comment" text,
	"symmetric" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DailyStat" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text,
	"date" date NOT NULL,
	"wordsWritten" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ManuscriptNode" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"parentId" text,
	"type" "ManuscriptNodeType" NOT NULL,
	"title" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"status" "SceneStatus",
	"synopsis" text,
	"wordCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"deletedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "Project" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"logline" text,
	"synopsis" text,
	"genre" text,
	"coverUrl" text,
	"templateId" text,
	"plotMethod" text DEFAULT 'blank' NOT NULL,
	"continueNodeId" text,
	"targetWordCount" integer,
	"totalWordCount" integer DEFAULT 0 NOT NULL,
	"status" "ProjectStatus" DEFAULT 'draft' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"archivedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "SceneContent" (
	"sceneId" text PRIMARY KEY NOT NULL,
	"contentJson" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"plainText" text,
	"version" integer DEFAULT 1 NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SceneMetadata" (
	"sceneId" text PRIMARY KEY NOT NULL,
	"goal" text,
	"conflict" text,
	"outcome" text,
	"povCharacterId" text,
	"locationId" text,
	"storyTime" text,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SceneParticipant" (
	"sceneId" text NOT NULL,
	"characterId" text NOT NULL,
	"projectId" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "SceneParticipant_sceneId_characterId_pk" PRIMARY KEY("sceneId","characterId")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"locale" text DEFAULT 'ru' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserApiKey" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"provider" text NOT NULL,
	"encryptedKey" text NOT NULL,
	"keyHint" text NOT NULL,
	"model" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorldArticle" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"type" "WorldArticleType" NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"contentJson" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	"deletedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "WritingGoal" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text,
	"type" "GoalType" NOT NULL,
	"targetWords" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Character" ADD CONSTRAINT "Character_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharacterRelationship" ADD CONSTRAINT "CharacterRelationship_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharacterRelationship" ADD CONSTRAINT "CharacterRelationship_fromCharacterId_Character_id_fk" FOREIGN KEY ("fromCharacterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharacterRelationship" ADD CONSTRAINT "CharacterRelationship_toCharacterId_Character_id_fk" FOREIGN KEY ("toCharacterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DailyStat" ADD CONSTRAINT "DailyStat_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DailyStat" ADD CONSTRAINT "DailyStat_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ManuscriptNode" ADD CONSTRAINT "ManuscriptNode_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ManuscriptNode" ADD CONSTRAINT "ManuscriptNode_parentId_ManuscriptNode_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."ManuscriptNode"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_continueNodeId_ManuscriptNode_id_fk" FOREIGN KEY ("continueNodeId") REFERENCES "public"."ManuscriptNode"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SceneContent" ADD CONSTRAINT "SceneContent_sceneId_ManuscriptNode_id_fk" FOREIGN KEY ("sceneId") REFERENCES "public"."ManuscriptNode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SceneMetadata" ADD CONSTRAINT "SceneMetadata_sceneId_ManuscriptNode_id_fk" FOREIGN KEY ("sceneId") REFERENCES "public"."ManuscriptNode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SceneMetadata" ADD CONSTRAINT "SceneMetadata_povCharacterId_Character_id_fk" FOREIGN KEY ("povCharacterId") REFERENCES "public"."Character"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SceneMetadata" ADD CONSTRAINT "SceneMetadata_locationId_WorldArticle_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."WorldArticle"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SceneParticipant" ADD CONSTRAINT "SceneParticipant_sceneId_ManuscriptNode_id_fk" FOREIGN KEY ("sceneId") REFERENCES "public"."ManuscriptNode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SceneParticipant" ADD CONSTRAINT "SceneParticipant_characterId_Character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserApiKey" ADD CONSTRAINT "UserApiKey_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WorldArticle" ADD CONSTRAINT "WorldArticle_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WritingGoal" ADD CONSTRAINT "WritingGoal_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WritingGoal" ADD CONSTRAINT "WritingGoal_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Character_projectId_idx" ON "Character" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "Character_projectId_name_idx" ON "Character" USING btree ("projectId","name");--> statement-breakpoint
CREATE UNIQUE INDEX "CharacterRelationship_fromCharacterId_toCharacterId_type_key" ON "CharacterRelationship" USING btree ("fromCharacterId","toCharacterId","type");--> statement-breakpoint
CREATE INDEX "CharacterRelationship_projectId_idx" ON "CharacterRelationship" USING btree ("projectId");--> statement-breakpoint
CREATE UNIQUE INDEX "DailyStat_userId_projectId_date_key" ON "DailyStat" USING btree ("userId","projectId","date");--> statement-breakpoint
CREATE INDEX "DailyStat_userId_date_idx" ON "DailyStat" USING btree ("userId","date");--> statement-breakpoint
CREATE INDEX "DailyStat_projectId_date_idx" ON "DailyStat" USING btree ("projectId","date");--> statement-breakpoint
CREATE INDEX "ManuscriptNode_projectId_idx" ON "ManuscriptNode" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "ManuscriptNode_projectId_parentId_position_idx" ON "ManuscriptNode" USING btree ("projectId","parentId","position");--> statement-breakpoint
CREATE INDEX "ManuscriptNode_projectId_type_idx" ON "ManuscriptNode" USING btree ("projectId","type");--> statement-breakpoint
CREATE INDEX "ManuscriptNode_projectId_deletedAt_idx" ON "ManuscriptNode" USING btree ("projectId","deletedAt");--> statement-breakpoint
CREATE INDEX "Project_userId_idx" ON "Project" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Project_userId_status_idx" ON "Project" USING btree ("userId","status");--> statement-breakpoint
CREATE INDEX "Project_userId_updatedAt_idx" ON "Project" USING btree ("userId","updatedAt");--> statement-breakpoint
CREATE INDEX "SceneParticipant_projectId_idx" ON "SceneParticipant" USING btree ("projectId");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_key" ON "session" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_key" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "UserApiKey_userId_provider_key" ON "UserApiKey" USING btree ("userId","provider");--> statement-breakpoint
CREATE INDEX "WorldArticle_projectId_idx" ON "WorldArticle" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "WorldArticle_projectId_type_idx" ON "WorldArticle" USING btree ("projectId","type");--> statement-breakpoint
CREATE INDEX "WorldArticle_projectId_title_idx" ON "WorldArticle" USING btree ("projectId","title");