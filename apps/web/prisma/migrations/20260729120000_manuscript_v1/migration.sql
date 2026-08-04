-- Migration: align schema with PRD v1.0 (ManuscriptNode model)
-- Run: npx pnpm db:migrate (may require `prisma migrate reset` if drift from old Chapter schema)

-- CreateEnum
CREATE TYPE "ManuscriptNodeType" AS ENUM ('part', 'chapter', 'scene');
CREATE TYPE "SceneStatus" AS ENUM ('idea', 'planned', 'draft', 'revision', 'ready');
CREATE TYPE "WorldArticleType" AS ENUM ('location', 'organization', 'object', 'rule', 'culture', 'event', 'article');

-- AlterTable Project: add PRD fields
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "subtitle" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "logline" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "synopsis" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "coverUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "templateId" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

-- Drop legacy Chapter table (Sprint 1 schema)
DROP TABLE IF EXISTS "Chapter";

-- CreateTable ManuscriptNode
CREATE TABLE IF NOT EXISTS "ManuscriptNode" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentId" TEXT,
    "type" "ManuscriptNodeType" NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "status" "SceneStatus",
    "synopsis" TEXT,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ManuscriptNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable SceneContent
CREATE TABLE IF NOT EXISTS "SceneContent" (
    "sceneId" TEXT NOT NULL,
    "contentJson" JSONB NOT NULL DEFAULT '{}',
    "plainText" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneContent_pkey" PRIMARY KEY ("sceneId")
);

-- CreateTable Character
CREATE TABLE IF NOT EXISTS "Character" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "summary" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable WorldArticle
CREATE TABLE IF NOT EXISTS "WorldArticle" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "WorldArticleType" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "contentJson" JSONB NOT NULL DEFAULT '{}',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorldArticle_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "ManuscriptNode_projectId_idx" ON "ManuscriptNode"("projectId");
CREATE INDEX IF NOT EXISTS "ManuscriptNode_projectId_parentId_position_idx" ON "ManuscriptNode"("projectId", "parentId", "position");
CREATE INDEX IF NOT EXISTS "ManuscriptNode_projectId_type_idx" ON "ManuscriptNode"("projectId", "type");
CREATE INDEX IF NOT EXISTS "Character_projectId_idx" ON "Character"("projectId");
CREATE INDEX IF NOT EXISTS "WorldArticle_projectId_idx" ON "WorldArticle"("projectId");
CREATE INDEX IF NOT EXISTS "WorldArticle_projectId_type_idx" ON "WorldArticle"("projectId", "type");

-- ForeignKeys
ALTER TABLE "ManuscriptNode" ADD CONSTRAINT "ManuscriptNode_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ManuscriptNode" ADD CONSTRAINT "ManuscriptNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ManuscriptNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SceneContent" ADD CONSTRAINT "SceneContent_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "ManuscriptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Character" ADD CONSTRAINT "Character_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorldArticle" ADD CONSTRAINT "WorldArticle_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
