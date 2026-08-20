import { db } from "@/lib/db";
import {
  character,
  characterRelationship,
  manuscriptNode,
  project,
  sceneContent,
  sceneMetadata,
  sceneParticipant,
  worldArticle,
} from "@/lib/db/schema";
import { assertProjectOwner } from "@/lib/projects/ownership";
import { asc, eq } from "drizzle-orm";

export async function duplicateProject(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);

  return db.transaction(async (tx) => {
    const source = await tx.query.project.findFirst({
      where: eq(project.id, projectId),
    });
    if (!source) {
      throw new Error("Project not found");
    }

    const [nodes, characters, worldArticles, relationships] = await Promise.all([
      tx.query.manuscriptNode.findMany({
        where: eq(manuscriptNode.projectId, projectId),
        orderBy: [asc(manuscriptNode.position), asc(manuscriptNode.id)],
        with: { content: true, metadata: true, participants: true },
      }),
      tx.query.character.findMany({
        where: eq(character.projectId, projectId),
      }),
      tx.query.worldArticle.findMany({
        where: eq(worldArticle.projectId, projectId),
      }),
      tx.query.characterRelationship.findMany({
        where: eq(characterRelationship.projectId, projectId),
      }),
    ]);

    const copyTitle = source.title.length > 190 ? `${source.title.slice(0, 190)}…` : `${source.title} (copy)`;

    const [copy] = await tx
      .insert(project)
      .values({
        userId,
        title: copyTitle,
        subtitle: source.subtitle,
        description: source.description,
        logline: source.logline,
        synopsis: source.synopsis,
        genre: source.genre,
        coverUrl: source.coverUrl,
        plotMethod: source.plotMethod,
        targetWordCount: source.targetWordCount,
        totalWordCount: source.totalWordCount,
        status: "draft",
      })
      .returning();

    const characterIds = new Map<string, string>();
    for (const item of characters) {
      const [created] = await tx
        .insert(character)
        .values({
          projectId: copy.id,
          name: item.name,
          role: item.role,
          summary: item.summary,
          appearance: item.appearance,
          motivation: item.motivation,
          notes: item.notes,
          extra: item.extra ?? undefined,
          imageUrl: item.imageUrl,
        })
        .returning({ id: character.id });
      characterIds.set(item.id, created.id);
    }

    const articleIds = new Map<string, string>();
    for (const article of worldArticles) {
      const [created] = await tx
        .insert(worldArticle)
        .values({
          projectId: copy.id,
          type: article.type,
          title: article.title,
          summary: article.summary,
          contentJson: article.contentJson,
          imageUrl: article.imageUrl,
        })
        .returning({ id: worldArticle.id });
      articleIds.set(article.id, created.id);
    }

    const nodeIds = new Map<string, string>();
    for (const node of nodes) {
      const [created] = await tx
        .insert(manuscriptNode)
        .values({
          projectId: copy.id,
          parentId: null,
          type: node.type,
          title: node.title,
          position: node.position,
          status: node.status,
          synopsis: node.synopsis,
          wordCount: node.wordCount,
          deletedAt: node.deletedAt,
        })
        .returning({ id: manuscriptNode.id });
      nodeIds.set(node.id, created.id);
    }

    for (const node of nodes) {
      const newId = nodeIds.get(node.id);
      if (!newId) continue;
      const newParentId = node.parentId ? (nodeIds.get(node.parentId) ?? null) : null;
      await tx.update(manuscriptNode).set({ parentId: newParentId }).where(eq(manuscriptNode.id, newId));

      if (node.content) {
        await tx.insert(sceneContent).values({
          sceneId: newId,
          contentJson: node.content.contentJson,
          plainText: node.content.plainText,
          version: 1,
          updatedAt: new Date(),
        });
      }

      if (node.metadata) {
        await tx.insert(sceneMetadata).values({
          sceneId: newId,
          goal: node.metadata.goal,
          conflict: node.metadata.conflict,
          outcome: node.metadata.outcome,
          storyTime: node.metadata.storyTime,
          povCharacterId: node.metadata.povCharacterId
            ? (characterIds.get(node.metadata.povCharacterId) ?? null)
            : null,
          locationId: node.metadata.locationId ? (articleIds.get(node.metadata.locationId) ?? null) : null,
        });
      }

      for (const participant of node.participants) {
        const mappedCharacterId = characterIds.get(participant.characterId);
        if (!mappedCharacterId) continue;
        await tx.insert(sceneParticipant).values({
          sceneId: newId,
          characterId: mappedCharacterId,
          projectId: copy.id,
          sortOrder: participant.sortOrder,
        });
      }
    }

    for (const relation of relationships) {
      const fromId = characterIds.get(relation.fromCharacterId);
      const toId = characterIds.get(relation.toCharacterId);
      if (!fromId || !toId) continue;
      await tx.insert(characterRelationship).values({
        projectId: copy.id,
        fromCharacterId: fromId,
        toCharacterId: toId,
        type: relation.type,
        label: relation.label,
        comment: relation.comment,
        symmetric: relation.symmetric,
      });
    }

    const continueNodeId = source.continueNodeId ? (nodeIds.get(source.continueNodeId) ?? null) : null;
    if (continueNodeId) {
      await tx.update(project).set({ continueNodeId }).where(eq(project.id, copy.id));
    }

    const duplicated = await tx.query.project.findFirst({
      where: eq(project.id, copy.id),
    });
    return duplicated!;
  });
}
