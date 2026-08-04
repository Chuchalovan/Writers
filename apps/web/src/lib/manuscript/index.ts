import type { ManuscriptNode, ManuscriptNodeType, SceneStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { assertProjectOwner } from "@/lib/projects";

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
    if (!parent) throw new Error("Parent node not found");
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
  await prisma.manuscriptNode.update({
    where: { id: node.id },
    data: { deletedAt: new Date() },
  });
  await prisma.project.update({
    where: { id: node.projectId },
    data: { updatedAt: new Date() },
  });
}

export async function getNodeWithAuth(userId: string, nodeId: string) {
  const node = await prisma.manuscriptNode.findFirst({
    where: { id: nodeId, deletedAt: null },
    include: { project: { select: { userId: true } } },
  });
  if (!node || node.project.userId !== userId) {
    throw new Error("Node not found");
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
