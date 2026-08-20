import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { assertProjectOwner } from "@/lib/projects/ownership";

export async function duplicateProject(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);

  return prisma.$transaction(async (tx) => {
    const source = await tx.project.findUniqueOrThrow({
      where: { id: projectId },
      include: {
        nodes: {
          orderBy: [{ position: "asc" }, { id: "asc" }],
          include: { content: true, metadata: true, participants: true },
        },
        characters: true,
        worldArticles: true,
        relationships: true,
      },
    });

    const copyTitle = source.title.length > 190 ? `${source.title.slice(0, 190)}…` : `${source.title} (copy)`;

    const copy = await tx.project.create({
      data: {
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
      },
    });

    const characterIds = new Map<string, string>();
    for (const character of source.characters) {
      const created = await tx.character.create({
        data: {
          projectId: copy.id,
          name: character.name,
          role: character.role,
          summary: character.summary,
          appearance: character.appearance,
          motivation: character.motivation,
          notes: character.notes,
          extra: character.extra === null ? undefined : (character.extra as Prisma.InputJsonValue),
          imageUrl: character.imageUrl,
        },
      });
      characterIds.set(character.id, created.id);
    }

    const articleIds = new Map<string, string>();
    for (const article of source.worldArticles) {
      const created = await tx.worldArticle.create({
        data: {
          projectId: copy.id,
          type: article.type,
          title: article.title,
          summary: article.summary,
          contentJson: article.contentJson as Prisma.InputJsonValue,
          imageUrl: article.imageUrl,
        },
      });
      articleIds.set(article.id, created.id);
    }

    const nodeIds = new Map<string, string>();
    for (const node of source.nodes) {
      const created = await tx.manuscriptNode.create({
        data: {
          projectId: copy.id,
          parentId: null,
          type: node.type,
          title: node.title,
          position: node.position,
          status: node.status,
          synopsis: node.synopsis,
          wordCount: node.wordCount,
          deletedAt: node.deletedAt,
        },
      });
      nodeIds.set(node.id, created.id);
    }

    for (const node of source.nodes) {
      const newId = nodeIds.get(node.id);
      if (!newId) continue;
      const newParentId = node.parentId ? (nodeIds.get(node.parentId) ?? null) : null;
      await tx.manuscriptNode.update({
        where: { id: newId },
        data: { parentId: newParentId },
      });

      if (node.content) {
        await tx.sceneContent.create({
          data: {
            sceneId: newId,
            contentJson: node.content.contentJson as Prisma.InputJsonValue,
            plainText: node.content.plainText,
            version: 1,
            updatedAt: new Date(),
          },
        });
      }

      if (node.metadata) {
        await tx.sceneMetadata.create({
          data: {
            sceneId: newId,
            goal: node.metadata.goal,
            conflict: node.metadata.conflict,
            outcome: node.metadata.outcome,
            storyTime: node.metadata.storyTime,
            povCharacterId: node.metadata.povCharacterId
              ? (characterIds.get(node.metadata.povCharacterId) ?? null)
              : null,
            locationId: node.metadata.locationId
              ? (articleIds.get(node.metadata.locationId) ?? null)
              : null,
          },
        });
      }

      for (const participant of node.participants) {
        const characterId = characterIds.get(participant.characterId);
        if (!characterId) continue;
        await tx.sceneParticipant.create({
          data: {
            sceneId: newId,
            characterId,
            projectId: copy.id,
            sortOrder: participant.sortOrder,
          },
        });
      }
    }

    for (const relation of source.relationships) {
      const fromId = characterIds.get(relation.fromCharacterId);
      const toId = characterIds.get(relation.toCharacterId);
      if (!fromId || !toId) continue;
      await tx.characterRelationship.create({
        data: {
          projectId: copy.id,
          fromCharacterId: fromId,
          toCharacterId: toId,
          type: relation.type,
          label: relation.label,
          comment: relation.comment,
          symmetric: relation.symmetric,
        },
      });
    }

    const continueNodeId = source.continueNodeId
      ? (nodeIds.get(source.continueNodeId) ?? null)
      : null;
    if (continueNodeId) {
      await tx.project.update({
        where: { id: copy.id },
        data: { continueNodeId },
      });
    }

    return tx.project.findUniqueOrThrow({ where: { id: copy.id } });
  });
}
