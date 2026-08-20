import type { ManuscriptNode, ManuscriptNodeType, SceneStatus, Prisma } from "@prisma/client";
import { AppError, ERROR_CODES, collectSubtreeIds, countWords, wouldCreateCycle } from "@manuscript/shared";
import { prisma } from "@/lib/db";
import { assertProjectOwner } from "@/lib/projects/ownership";

export type ManuscriptNodeWithContent = ManuscriptNode & {
  content: { sceneId: string; version: number } | null;
};

export async function getNodesForProject(
  userId: string,
  projectId: string
): Promise<ManuscriptNodeWithContent[]> {
  await assertProjectOwner(userId, projectId);
  return prisma.manuscriptNode.findMany({
    where: { projectId, deletedAt: null },
    orderBy: [{ position: "asc" }],
    include: { content: { select: { sceneId: true, version: true } } },
  });
}

export async function createNode(
  userId: string,
  data: {
    projectId: string;
    parentId?: string | null;
    type: ManuscriptNodeType;
    title?: string;
  }
): Promise<ManuscriptNode> {
  await assertProjectOwner(userId, data.projectId);

  if (data.parentId) {
    const parent = await prisma.manuscriptNode.findFirst({
      where: { id: data.parentId, projectId: data.projectId, deletedAt: null },
    });
    if (!parent) throw new AppError(ERROR_CODES.NOT_FOUND, "Parent node not found");
  }

  const position = await nextPosition(data.projectId, data.parentId ?? null);
  const title = data.title?.trim() || "Untitled";

  const node = await prisma.manuscriptNode.create({
    data: {
      projectId: data.projectId,
      parentId: data.parentId ?? null,
      type: data.type,
      title,
      position,
      status: data.type === "scene" ? "draft" : null,
    },
  });

  if (data.type === "scene") {
    await prisma.sceneContent.create({
      data: { sceneId: node.id, contentJson: {}, updatedAt: new Date() },
    });
  }

  await prisma.project.update({
    where: { id: data.projectId },
    data: { updatedAt: new Date() },
  });

  return node;
}

export async function updateNode(
  userId: string,
  nodeId: string,
  data: {
    title?: string;
    status?: SceneStatus | null;
    synopsis?: string | null;
    position?: number;
    parentId?: string | null;
  }
): Promise<ManuscriptNode> {
  const node = await getNodeWithAuth(userId, nodeId);
  return prisma.manuscriptNode.update({
    where: { id: node.id },
    data,
  });
}

export async function deleteNode(userId: string, nodeId: string): Promise<void> {
  const node = await getNodeWithAuth(userId, nodeId);
  if (node.deletedAt) return;

  const all = await prisma.manuscriptNode.findMany({
    where: { projectId: node.projectId },
    select: { id: true, parentId: true },
  });
  const childrenByParent = new Map<string | null, string[]>();
  for (const item of all) {
    const key = item.parentId;
    if (!childrenByParent.has(key)) childrenByParent.set(key, []);
    childrenByParent.get(key)!.push(item.id);
  }
  const ids = collectSubtreeIds(node.id, childrenByParent);
  const now = new Date();
  await prisma.manuscriptNode.updateMany({
    where: { id: { in: ids }, projectId: node.projectId },
    data: { deletedAt: now },
  });
  await prisma.project.update({
    where: { id: node.projectId },
    data: { updatedAt: now },
  });
}

export async function restoreNode(userId: string, nodeId: string): Promise<ManuscriptNode> {
  const node = await getNodeWithAuth(userId, nodeId);
  const all = await prisma.manuscriptNode.findMany({
    where: { projectId: node.projectId },
    select: { id: true, parentId: true, deletedAt: true },
  });
  const childrenByParent = new Map<string | null, string[]>();
  for (const item of all) {
    const key = item.parentId;
    if (!childrenByParent.has(key)) childrenByParent.set(key, []);
    childrenByParent.get(key)!.push(item.id);
  }
  const ids = collectSubtreeIds(node.id, childrenByParent);
  await prisma.manuscriptNode.updateMany({
    where: { id: { in: ids }, projectId: node.projectId },
    data: { deletedAt: null },
  });
  await prisma.project.update({
    where: { id: node.projectId },
    data: { updatedAt: new Date() },
  });
  return prisma.manuscriptNode.findUniqueOrThrow({ where: { id: node.id } });
}

export async function getDeletedNodes(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);
  return prisma.manuscriptNode.findMany({
    where: { projectId, deletedAt: { not: null } },
    orderBy: { deletedAt: "desc" },
  });
}

export async function reorderNodes(
  userId: string,
  projectId: string,
  parentId: string | null,
  orderedIds: string[]
): Promise<void> {
  await assertProjectOwner(userId, projectId);
  const siblings = await prisma.manuscriptNode.findMany({
    where: { projectId, parentId, deletedAt: null },
    select: { id: true },
  });
  const siblingIds = new Set(siblings.map((item) => item.id));
  if (orderedIds.length !== siblingIds.size || orderedIds.some((id) => !siblingIds.has(id))) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Reorder must include all siblings of the same parent");
  }
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.manuscriptNode.update({ where: { id }, data: { position: index } })
    )
  );
}

export async function moveNode(
  userId: string,
  nodeId: string,
  newParentId: string | null,
  position: number
): Promise<ManuscriptNode> {
  const node = await getNodeWithAuth(userId, nodeId);
  if (node.deletedAt) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Cannot move a deleted node");
  }

  if (newParentId) {
    const parent = await prisma.manuscriptNode.findFirst({
      where: { id: newParentId, projectId: node.projectId, deletedAt: null },
    });
    if (!parent) throw new AppError(ERROR_CODES.NOT_FOUND, "Parent node not found");
  }

  const all = await prisma.manuscriptNode.findMany({
    where: { projectId: node.projectId, deletedAt: null },
    select: { id: true, parentId: true },
  });
  const parentById = new Map(all.map((item) => [item.id, item.parentId]));
  if (wouldCreateCycle(node.id, newParentId, parentById)) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Cannot move a node under its descendant");
  }

  const updated = await prisma.manuscriptNode.update({
    where: { id: node.id },
    data: { parentId: newParentId, position },
  });
  await prisma.project.update({
    where: { id: node.projectId },
    data: { updatedAt: new Date() },
  });
  return updated;
}

export async function setSceneStatus(
  userId: string,
  nodeId: string,
  status: SceneStatus
): Promise<ManuscriptNode> {
  const node = await getNodeWithAuth(userId, nodeId);
  if (node.type !== "scene") {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Status can only be set on a scene");
  }
  return prisma.manuscriptNode.update({
    where: { id: node.id },
    data: { status },
  });
}

export async function getSceneWithContent(userId: string, sceneId: string) {
  const node = await getNodeWithAuth(userId, sceneId);
  if (node.type !== "scene") {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene not found");
  }
  const content = await prisma.sceneContent.findUnique({ where: { sceneId } });
  return { node, content };
}

export async function saveSceneContent(
  userId: string,
  input: {
    sceneId: string;
    contentJson: Record<string, unknown>;
    plainText: string;
    baseVersion: number;
  }
) {
  const node = await getNodeWithAuth(userId, input.sceneId);
  if (node.type !== "scene") {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Only scenes have content");
  }
  if (node.deletedAt) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene not found");
  }

  const existing = await prisma.sceneContent.findUnique({ where: { sceneId: input.sceneId } });
  if (!existing) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene content not found");
  }
  if (existing.version !== input.baseVersion) {
    throw new AppError(ERROR_CODES.CONFLICT, "Scene was updated elsewhere");
  }

  const wordCount = countWords(input.plainText);
  const updated = await prisma.sceneContent.update({
    where: { sceneId: input.sceneId },
    data: {
      contentJson: input.contentJson as Prisma.InputJsonValue,
      plainText: input.plainText,
      version: { increment: 1 },
    },
  });
  await prisma.manuscriptNode.update({
    where: { id: input.sceneId },
    data: { wordCount },
  });
  const totals = await prisma.manuscriptNode.aggregate({
    where: { projectId: node.projectId, type: "scene", deletedAt: null },
    _sum: { wordCount: true },
  });
  await prisma.project.update({
    where: { id: node.projectId },
    data: {
      totalWordCount: totals._sum.wordCount ?? 0,
      continueNodeId: input.sceneId,
      updatedAt: new Date(),
    },
  });
  return updated;
}

export async function getNodeWithAuth(userId: string, nodeId: string) {
  const node = await prisma.manuscriptNode.findFirst({
    where: { id: nodeId },
    include: { project: { select: { userId: true } } },
  });
  if (!node) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Node not found");
  }
  if (node.project.userId !== userId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "Forbidden");
  }
  return node;
}

async function nextPosition(projectId: string, parentId: string | null): Promise<number> {
  const last = await prisma.manuscriptNode.findFirst({
    where: { projectId, parentId, deletedAt: null },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return (last?.position ?? -1) + 1;
}

export function buildNodeTree(nodes: ManuscriptNodeWithContent[]) {
  const byParent = new Map<string | null, ManuscriptNodeWithContent[]>();
  for (const node of nodes) {
    const key = node.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(node);
  }
  for (const group of byParent.values()) {
    group.sort((a, b) => a.position - b.position);
  }
  return byParent;
}
