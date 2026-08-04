"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import {
  CreateManuscriptNodeSchema,
  UpdateManuscriptNodeSchema,
} from "@manuscript/shared";
import { requireSession } from "@/lib/auth/session";
import {
  createNode,
  deleteNode,
  getNodesForProject,
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
  if (!parsed.success) throw new Error("Invalid input");

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
  if (!parsed.success) return { error: "invalid" as const };

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
  if (!parsed.success) throw new Error("Invalid input");

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
