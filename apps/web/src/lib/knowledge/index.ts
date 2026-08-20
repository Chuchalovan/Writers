import { AppError, ERROR_CODES } from "@manuscript/shared";
import { db } from "@/lib/db";
import { character, sceneMetadata, sceneParticipant, worldArticle } from "@/lib/db/schema";
import { assertProjectOwner } from "@/lib/projects/ownership";
import { getNodeWithAuth } from "@/lib/manuscript";
import { and, asc, desc, eq, isNull } from "drizzle-orm";

export async function listCharacters(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);
  return db
    .select({ id: character.id, name: character.name })
    .from(character)
    .where(and(eq(character.projectId, projectId), isNull(character.deletedAt)))
    .orderBy(asc(character.name));
}

export async function listWorldArticles(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);
  return db
    .select({ id: worldArticle.id, title: worldArticle.title, type: worldArticle.type })
    .from(worldArticle)
    .where(and(eq(worldArticle.projectId, projectId), isNull(worldArticle.deletedAt)))
    .orderBy(asc(worldArticle.type), asc(worldArticle.title));
}

export async function getSceneContext(userId: string, sceneId: string) {
  const node = await getNodeWithAuth(userId, sceneId);
  if (node.type !== "scene") {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene not found");
  }
  const [metadata, participants] = await Promise.all([
    db.query.sceneMetadata.findFirst({
      where: eq(sceneMetadata.sceneId, sceneId),
    }),
    db.query.sceneParticipant.findMany({
      where: eq(sceneParticipant.sceneId, sceneId),
      orderBy: asc(sceneParticipant.sortOrder),
      with: { character: { columns: { id: true, name: true } } },
    }),
  ]);
  return { metadata: metadata ?? null, participants };
}

export async function saveSceneMetadata(
  userId: string,
  input: {
    sceneId: string;
    goal?: string | null;
    conflict?: string | null;
    outcome?: string | null;
    povCharacterId?: string | null;
    locationId?: string | null;
    storyTime?: string | null;
  }
) {
  const node = await getNodeWithAuth(userId, input.sceneId);
  if (node.type !== "scene" || node.deletedAt) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene not found");
  }

  if (input.povCharacterId) {
    const found = await db.query.character.findFirst({
      where: and(
        eq(character.id, input.povCharacterId),
        eq(character.projectId, node.projectId),
        isNull(character.deletedAt)
      ),
    });
    if (!found) throw new AppError(ERROR_CODES.NOT_FOUND, "Character not found");
  }
  if (input.locationId) {
    const location = await db.query.worldArticle.findFirst({
      where: and(
        eq(worldArticle.id, input.locationId),
        eq(worldArticle.projectId, node.projectId),
        isNull(worldArticle.deletedAt)
      ),
    });
    if (!location) throw new AppError(ERROR_CODES.NOT_FOUND, "Location not found");
  }

  const [metadata] = await db
    .insert(sceneMetadata)
    .values({
      sceneId: input.sceneId,
      goal: input.goal ?? null,
      conflict: input.conflict ?? null,
      outcome: input.outcome ?? null,
      povCharacterId: input.povCharacterId ?? null,
      locationId: input.locationId ?? null,
      storyTime: input.storyTime ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: sceneMetadata.sceneId,
      set: {
        ...(input.goal !== undefined ? { goal: input.goal } : {}),
        ...(input.conflict !== undefined ? { conflict: input.conflict } : {}),
        ...(input.outcome !== undefined ? { outcome: input.outcome } : {}),
        ...(input.povCharacterId !== undefined ? { povCharacterId: input.povCharacterId } : {}),
        ...(input.locationId !== undefined ? { locationId: input.locationId } : {}),
        ...(input.storyTime !== undefined ? { storyTime: input.storyTime } : {}),
        updatedAt: new Date(),
      },
    })
    .returning();
  return { metadata, projectId: node.projectId };
}

export async function linkCharacterToScene(userId: string, sceneId: string, characterId: string) {
  const node = await getNodeWithAuth(userId, sceneId);
  if (node.type !== "scene" || node.deletedAt) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene not found");
  }
  const found = await db.query.character.findFirst({
    where: and(
      eq(character.id, characterId),
      eq(character.projectId, node.projectId),
      isNull(character.deletedAt)
    ),
  });
  if (!found) throw new AppError(ERROR_CODES.NOT_FOUND, "Character not found");

  const [last] = await db
    .select({ sortOrder: sceneParticipant.sortOrder })
    .from(sceneParticipant)
    .where(eq(sceneParticipant.sceneId, sceneId))
    .orderBy(desc(sceneParticipant.sortOrder))
    .limit(1);

  await db
    .insert(sceneParticipant)
    .values({
      sceneId,
      characterId,
      projectId: node.projectId,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    })
    .onConflictDoNothing();
  return { projectId: node.projectId };
}

export async function unlinkCharacterFromScene(userId: string, sceneId: string, characterId: string) {
  const node = await getNodeWithAuth(userId, sceneId);
  await db
    .delete(sceneParticipant)
    .where(and(eq(sceneParticipant.sceneId, sceneId), eq(sceneParticipant.characterId, characterId)));
  return { projectId: node.projectId };
}
