-- Alpha knowledge + editor metadata (develop-mvp 1.4)

CREATE TYPE "RelationshipType" AS ENUM ('family', 'ally', 'enemy', 'romantic', 'mentor', 'other');

ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "plotMethod" VARCHAR(32) NOT NULL DEFAULT 'blank';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "continueNodeId" TEXT;

CREATE INDEX IF NOT EXISTS "Project_userId_updatedAt_idx" ON "Project"("userId", "updatedAt");

ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "appearance" TEXT;
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "motivation" TEXT;
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "extra" JSONB;

CREATE INDEX IF NOT EXISTS "Character_projectId_name_idx" ON "Character"("projectId", "name");
CREATE INDEX IF NOT EXISTS "ManuscriptNode_projectId_deletedAt_idx" ON "ManuscriptNode"("projectId", "deletedAt");
CREATE INDEX IF NOT EXISTS "WorldArticle_projectId_title_idx" ON "WorldArticle"("projectId", "title");

CREATE TABLE IF NOT EXISTS "SceneMetadata" (
    "sceneId" TEXT NOT NULL,
    "goal" TEXT,
    "conflict" TEXT,
    "outcome" TEXT,
    "povCharacterId" TEXT,
    "locationId" TEXT,
    "storyTime" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneMetadata_pkey" PRIMARY KEY ("sceneId")
);

CREATE TABLE IF NOT EXISTS "SceneParticipant" (
    "sceneId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SceneParticipant_pkey" PRIMARY KEY ("sceneId","characterId")
);

CREATE TABLE IF NOT EXISTS "CharacterRelationship" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fromCharacterId" TEXT NOT NULL,
    "toCharacterId" TEXT NOT NULL,
    "type" "RelationshipType" NOT NULL,
    "label" TEXT,
    "comment" TEXT,
    "symmetric" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterRelationship_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CharacterRelationship_fromCharacterId_toCharacterId_type_key"
  ON "CharacterRelationship"("fromCharacterId", "toCharacterId", "type");

CREATE INDEX IF NOT EXISTS "CharacterRelationship_projectId_idx" ON "CharacterRelationship"("projectId");
CREATE INDEX IF NOT EXISTS "SceneParticipant_projectId_idx" ON "SceneParticipant"("projectId");

ALTER TABLE "Project"
  ADD CONSTRAINT "Project_continueNodeId_fkey"
  FOREIGN KEY ("continueNodeId") REFERENCES "ManuscriptNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SceneMetadata"
  ADD CONSTRAINT "SceneMetadata_sceneId_fkey"
  FOREIGN KEY ("sceneId") REFERENCES "ManuscriptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SceneMetadata"
  ADD CONSTRAINT "SceneMetadata_povCharacterId_fkey"
  FOREIGN KEY ("povCharacterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SceneMetadata"
  ADD CONSTRAINT "SceneMetadata_locationId_fkey"
  FOREIGN KEY ("locationId") REFERENCES "WorldArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SceneParticipant"
  ADD CONSTRAINT "SceneParticipant_sceneId_fkey"
  FOREIGN KEY ("sceneId") REFERENCES "ManuscriptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SceneParticipant"
  ADD CONSTRAINT "SceneParticipant_characterId_fkey"
  FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CharacterRelationship"
  ADD CONSTRAINT "CharacterRelationship_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CharacterRelationship"
  ADD CONSTRAINT "CharacterRelationship_fromCharacterId_fkey"
  FOREIGN KEY ("fromCharacterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CharacterRelationship"
  ADD CONSTRAINT "CharacterRelationship_toCharacterId_fkey"
  FOREIGN KEY ("toCharacterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
