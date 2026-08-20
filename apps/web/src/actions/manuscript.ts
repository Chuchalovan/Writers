"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import {
  CreateManuscriptNodeSchema,
  MoveNodeSchema,
  ReorderNodesSchema,
  SetSceneStatusSchema,
  UpdateManuscriptNodeSchema,
  UpdateSceneContentSchema,
} from "@manuscript/shared";
import { requireSession } from "@/lib/auth/session";
import { validationError } from "@/lib/errors";
import { isAppError } from "@manuscript/shared";
import {
  createNode,
  deleteNode,
  getDeletedNodes,
  getNodesForProject,
  getSceneWithContent,
  moveNode,
  reorderNodes,
  restoreNode,
  saveSceneContent,
  setSceneStatus,
  updateNode,
} from "@/lib/manuscript";
import type { ManuscriptNodeType } from "@prisma/client";

async function defaultNodeTitle(type: ManuscriptNodeType): Promise<string> {
  const t = await getTranslations("manuscript");
  return t(`default_${type}`);
}

export async function getNodesAction(projectId: string) {
  const session = await requireSession();
  return getNodesForProject(session.user.id, projectId);
}

export async function createNodeAction(input: unknown) {
  const session = await requireSession();
  const parsed = CreateManuscriptNodeSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error);

  const title = parsed.data.title ?? (await defaultNodeTitle(parsed.data.type));
  const node = await createNode(session.user.id, { ...parsed.data, title });
  revalidatePath(`/projects/${parsed.data.projectId}`);
  return node;
}

export async function createNodeFormAction(formData: FormData) {
  const session = await requireSession();
  const projectId = formData.get("projectId") as string;
  const type = formData.get("type") as ManuscriptNodeType;
  const parentId = formData.get("parentId") as string | null;
  const title = formData.get("title") as string | null;

  const parsed = CreateManuscriptNodeSchema.safeParse({
    projectId,
    type,
    parentId: parentId || undefined,
    title: title || undefined,
  });
  if (!parsed.success) return validationError(parsed.error).toEnvelope();

  const nodeTitle = parsed.data.title ?? (await defaultNodeTitle(parsed.data.type));
  const node = await createNode(session.user.id, {
    ...parsed.data,
    parentId: parsed.data.parentId ?? null,
    title: nodeTitle,
  });
  revalidatePath(`/projects/${projectId}`);
  return { node };
}

export async function updateNodeAction(input: unknown) {
  const session = await requireSession();
  const parsed = UpdateManuscriptNodeSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error);

  const { id, ...data } = parsed.data;
  const node = await updateNode(session.user.id, id, data);
  revalidatePath(`/projects/${node.projectId}`);
  return node;
}

export async function deleteNodeAction(nodeId: string, projectId: string) {
  const session = await requireSession();
  await deleteNode(session.user.id, nodeId);
  revalidatePath(`/projects/${projectId}`);
}

export async function restoreNodeAction(nodeId: string, projectId: string) {
  const session = await requireSession();
  await restoreNode(session.user.id, nodeId);
  revalidatePath(`/projects/${projectId}`);
}

export async function getDeletedNodesAction(projectId: string) {
  const session = await requireSession();
  return getDeletedNodes(session.user.id, projectId);
}

export async function reorderNodesAction(input: unknown) {
  const session = await requireSession();
  const parsed = ReorderNodesSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error);
  await reorderNodes(
    session.user.id,
    parsed.data.projectId,
    parsed.data.parentId,
    parsed.data.orderedIds
  );
  revalidatePath(`/projects/${parsed.data.projectId}`);
}

export async function moveNodeAction(input: unknown) {
  const session = await requireSession();
  const parsed = MoveNodeSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error);
  const node = await moveNode(
    session.user.id,
    parsed.data.id,
    parsed.data.newParentId,
    parsed.data.position
  );
  revalidatePath(`/projects/${node.projectId}`);
  return node;
}

export async function setSceneStatusAction(input: unknown) {
  const session = await requireSession();
  const parsed = SetSceneStatusSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error);
  const node = await setSceneStatus(session.user.id, parsed.data.id, parsed.data.status);
  revalidatePath(`/projects/${node.projectId}`);
  return node;
}

export async function startWritingAction(projectId: string) {
  const session = await requireSession();
  const title = await defaultNodeTitle("scene");
  const node = await createNode(session.user.id, { projectId, type: "scene", title });
  revalidatePath(`/projects/${projectId}`);
  return node;
}

export async function startPlanningAction(projectId: string) {
  const session = await requireSession();
  const title = await defaultNodeTitle("part");
  const part = await createNode(session.user.id, { projectId, type: "part", title });
  revalidatePath(`/projects/${projectId}`);
  return part;
}

export async function getSceneAction(sceneId: string) {
  const session = await requireSession();
  return getSceneWithContent(session.user.id, sceneId);
}

export async function saveSceneContentAction(input: unknown) {
  const session = await requireSession();
  const parsed = UpdateSceneContentSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error).toEnvelope();
  try {
    return await saveSceneContent(session.user.id, parsed.data);
  } catch (error) {
    if (isAppError(error)) return error.toEnvelope();
    throw error;
  }
}
