import type { ManuscriptNode, ManuscriptNodeType, SceneStatus } from "@/lib/db";
import { AppError, ERROR_CODES, collectSubtreeIds, countWords, wouldCreateCycle } from "@manuscript/shared";
import { db } from "@/lib/db";
import { manuscriptNode, project, sceneContent } from "@/lib/db/schema";
import { assertProjectOwner } from "@/lib/projects/ownership";
import { and, asc, desc, eq, inArray, isNotNull, isNull, sum } from "drizzle-orm";

export type ManuscriptNodeWithContent = ManuscriptNode & {
  content: { sceneId: string; version: number } | null;
};

export async function getNodesForProject(
  userId: string,
  projectId: string
): Promise<ManuscriptNodeWithContent[]> {
  await assertProjectOwner(userId, projectId);
  const rows = await db
    .select({
      node: manuscriptNode,
      contentSceneId: sceneContent.sceneId,
      contentVersion: sceneContent.version,
    })
    .from(manuscriptNode)
    .leftJoin(sceneContent, eq(sceneContent.sceneId, manuscriptNode.id))
    .where(and(eq(manuscriptNode.projectId, projectId), isNull(manuscriptNode.deletedAt)))
    .orderBy(asc(manuscriptNode.position));

  return rows.map((row) => ({
    ...row.node,
    content: row.contentSceneId ? { sceneId: row.contentSceneId, version: row.contentVersion ?? 1 } : null,
  }));
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
    const parent = await db.query.manuscriptNode.findFirst({
      where: and(
        eq(manuscriptNode.id, data.parentId),
        eq(manuscriptNode.projectId, data.projectId),
        isNull(manuscriptNode.deletedAt)
      ),
    });
    if (!parent) throw new AppError(ERROR_CODES.NOT_FOUND, "Parent node not found");
  }

  const position = await nextPosition(data.projectId, data.parentId ?? null);
  const title = data.title?.trim() || "Untitled";

  const [node] = await db
    .insert(manuscriptNode)
    .values({
      projectId: data.projectId,
      parentId: data.parentId ?? null,
      type: data.type,
      title,
      position,
      status: data.type === "scene" ? "draft" : null,
    })
    .returning();

  if (data.type === "scene") {
    await db.insert(sceneContent).values({
      sceneId: node.id,
      contentJson: {},
      updatedAt: new Date(),
    });
  }

  await touchProject(data.projectId);
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
  const [updated] = await db
    .update(manuscriptNode)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(manuscriptNode.id, node.id))
    .returning();
  return updated;
}

export async function deleteNode(userId: string, nodeId: string): Promise<void> {
  const node = await getNodeWithAuth(userId, nodeId);
  if (node.deletedAt) return;

  const all = await db
    .select({ id: manuscriptNode.id, parentId: manuscriptNode.parentId })
    .from(manuscriptNode)
    .where(eq(manuscriptNode.projectId, node.projectId));
  const childrenByParent = new Map<string | null, string[]>();
  for (const item of all) {
    const key = item.parentId;
    if (!childrenByParent.has(key)) childrenByParent.set(key, []);
    childrenByParent.get(key)!.push(item.id);
  }
  const ids = collectSubtreeIds(node.id, childrenByParent);
  const now = new Date();
  await db
    .update(manuscriptNode)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(inArray(manuscriptNode.id, ids), eq(manuscriptNode.projectId, node.projectId)));
  await touchProject(node.projectId, now);
}

export async function restoreNode(userId: string, nodeId: string): Promise<ManuscriptNode> {
  const node = await getNodeWithAuth(userId, nodeId);
  const all = await db
    .select({
      id: manuscriptNode.id,
      parentId: manuscriptNode.parentId,
      deletedAt: manuscriptNode.deletedAt,
    })
    .from(manuscriptNode)
    .where(eq(manuscriptNode.projectId, node.projectId));
  const childrenByParent = new Map<string | null, string[]>();
  for (const item of all) {
    const key = item.parentId;
    if (!childrenByParent.has(key)) childrenByParent.set(key, []);
    childrenByParent.get(key)!.push(item.id);
  }
  const ids = collectSubtreeIds(node.id, childrenByParent);
  await db
    .update(manuscriptNode)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(and(inArray(manuscriptNode.id, ids), eq(manuscriptNode.projectId, node.projectId)));
  await touchProject(node.projectId);
  const restored = await db.query.manuscriptNode.findFirst({
    where: eq(manuscriptNode.id, node.id),
  });
  if (!restored) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Node not found");
  }
  return restored;
}

export async function getDeletedNodes(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);
  return db
    .select()
    .from(manuscriptNode)
    .where(and(eq(manuscriptNode.projectId, projectId), isNotNull(manuscriptNode.deletedAt)))
    .orderBy(desc(manuscriptNode.deletedAt));
}

export async function reorderNodes(
  userId: string,
  projectId: string,
  parentId: string | null,
  orderedIds: string[]
): Promise<void> {
  await assertProjectOwner(userId, projectId);
  const siblings = await db
    .select({ id: manuscriptNode.id })
    .from(manuscriptNode)
    .where(
      and(
        eq(manuscriptNode.projectId, projectId),
        parentId === null ? isNull(manuscriptNode.parentId) : eq(manuscriptNode.parentId, parentId),
        isNull(manuscriptNode.deletedAt)
      )
    );
  const siblingIds = new Set(siblings.map((item) => item.id));
  if (orderedIds.length !== siblingIds.size || orderedIds.some((id) => !siblingIds.has(id))) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Reorder must include all siblings of the same parent");
  }
  await db.transaction(async (tx) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        tx.update(manuscriptNode).set({ position: index, updatedAt: new Date() }).where(eq(manuscriptNode.id, id))
      )
    );
  });
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
    const parent = await db.query.manuscriptNode.findFirst({
      where: and(
        eq(manuscriptNode.id, newParentId),
        eq(manuscriptNode.projectId, node.projectId),
        isNull(manuscriptNode.deletedAt)
      ),
    });
    if (!parent) throw new AppError(ERROR_CODES.NOT_FOUND, "Parent node not found");
  }

  const all = await db
    .select({ id: manuscriptNode.id, parentId: manuscriptNode.parentId })
    .from(manuscriptNode)
    .where(and(eq(manuscriptNode.projectId, node.projectId), isNull(manuscriptNode.deletedAt)));
  const parentById = new Map(all.map((item) => [item.id, item.parentId]));
  if (wouldCreateCycle(node.id, newParentId, parentById)) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Cannot move a node under its descendant");
  }

  const [updated] = await db
    .update(manuscriptNode)
    .set({ parentId: newParentId, position, updatedAt: new Date() })
    .where(eq(manuscriptNode.id, node.id))
    .returning();
  await touchProject(node.projectId);
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
  const [updated] = await db
    .update(manuscriptNode)
    .set({ status, updatedAt: new Date() })
    .where(eq(manuscriptNode.id, node.id))
    .returning();
  return updated;
}

export async function getSceneWithContent(userId: string, sceneId: string) {
  const node = await getNodeWithAuth(userId, sceneId);
  if (node.type !== "scene") {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene not found");
  }
  const content = await db.query.sceneContent.findFirst({
    where: eq(sceneContent.sceneId, sceneId),
  });
  return { node, content: content ?? null };
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

  const existing = await db.query.sceneContent.findFirst({
    where: eq(sceneContent.sceneId, input.sceneId),
  });
  if (!existing) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Scene content not found");
  }
  if (existing.version !== input.baseVersion) {
    throw new AppError(ERROR_CODES.CONFLICT, "Scene was updated elsewhere");
  }

  const wordCount = countWords(input.plainText);
  const [updated] = await db
    .update(sceneContent)
    .set({
      contentJson: input.contentJson,
      plainText: input.plainText,
      version: existing.version + 1,
      updatedAt: new Date(),
    })
    .where(eq(sceneContent.sceneId, input.sceneId))
    .returning();
  await db
    .update(manuscriptNode)
    .set({ wordCount, updatedAt: new Date() })
    .where(eq(manuscriptNode.id, input.sceneId));
  const [totals] = await db
    .select({ total: sum(manuscriptNode.wordCount) })
    .from(manuscriptNode)
    .where(
      and(
        eq(manuscriptNode.projectId, node.projectId),
        eq(manuscriptNode.type, "scene"),
        isNull(manuscriptNode.deletedAt)
      )
    );
  await db
    .update(project)
    .set({
      totalWordCount: Number(totals?.total ?? 0),
      continueNodeId: input.sceneId,
      updatedAt: new Date(),
    })
    .where(eq(project.id, node.projectId));
  return updated;
}

export async function getNodeWithAuth(userId: string, nodeId: string) {
  const row = await db
    .select({
      node: manuscriptNode,
      ownerId: project.userId,
    })
    .from(manuscriptNode)
    .innerJoin(project, eq(project.id, manuscriptNode.projectId))
    .where(eq(manuscriptNode.id, nodeId))
    .limit(1)
    .then((rows) => rows[0]);
  if (!row) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Node not found");
  }
  if (row.ownerId !== userId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "Forbidden");
  }
  return row.node;
}

async function nextPosition(projectId: string, parentId: string | null): Promise<number> {
  const [last] = await db
    .select({ position: manuscriptNode.position })
    .from(manuscriptNode)
    .where(
      and(
        eq(manuscriptNode.projectId, projectId),
        parentId === null ? isNull(manuscriptNode.parentId) : eq(manuscriptNode.parentId, parentId),
        isNull(manuscriptNode.deletedAt)
      )
    )
    .orderBy(desc(manuscriptNode.position))
    .limit(1);
  return (last?.position ?? -1) + 1;
}

async function touchProject(projectId: string, at = new Date()) {
  await db.update(project).set({ updatedAt: at }).where(eq(project.id, projectId));
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

export function sceneIdsInNavigatorOrder(nodes: ManuscriptNodeWithContent[]): string[] {
  const byParent = buildNodeTree(nodes);
  const ids: string[] = [];
  function walk(parentId: string | null) {
    const children = byParent.get(parentId) ?? [];
    const sequence =
      parentId === null
        ? [
            ...children.filter((node) => node.type !== "scene"),
            ...children.filter((node) => node.type === "scene"),
          ]
        : children;
    for (const child of sequence) {
      if (child.type === "scene") ids.push(child.id);
      walk(child.id);
    }
  }
  walk(null);
  return ids;
}
