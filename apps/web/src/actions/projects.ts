"use server";

import { revalidatePath } from "next/cache";
import {
  CreateProjectSchema,
  ListProjectsSchema,
  UpdateProjectSchema,
} from "@manuscript/shared";
import { requireSession } from "@/lib/auth/session";
import { validationError } from "@/lib/errors";
import {
  archiveProject,
  createProject,
  deleteProject,
  getProjectForUser,
  getProjectsForUser,
  updateProject,
} from "@/lib/projects";
import { duplicateProject } from "@/lib/projects/duplicate";
import { getProjectOverview } from "@/lib/projects/overview";

export async function getProjectsAction(input: unknown = {}) {
  const session = await requireSession();
  const parsed = ListProjectsSchema.safeParse(input ?? {});
  if (!parsed.success) throw validationError(parsed.error);
  return getProjectsForUser(session.user.id, parsed.data);
}

export async function getProjectAction(projectId: string) {
  const session = await requireSession();
  return getProjectForUser(session.user.id, projectId);
}

export type ProjectActionResult = Awaited<ReturnType<typeof getProjectAction>>;

export async function createProjectAction(formData: FormData) {
  const session = await requireSession();
  const parsed = CreateProjectSchema.safeParse({
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return validationError(parsed.error).toEnvelope();
  }

  const project = await createProject(session.user.id, parsed.data.title);
  revalidatePath("/projects");
  return { project };
}

export async function updateProjectAction(input: unknown) {
  const session = await requireSession();
  const parsed = UpdateProjectSchema.safeParse(input);
  if (!parsed.success) throw validationError(parsed.error);

  const { id, ...data } = parsed.data;
  const project = await updateProject(session.user.id, id, data);
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return project;
}

export async function archiveProjectAction(projectId: string) {
  const session = await requireSession();
  await archiveProject(session.user.id, projectId);
  revalidatePath("/projects");
}

export async function deleteProjectAction(projectId: string) {
  const session = await requireSession();
  await deleteProject(session.user.id, projectId);
  revalidatePath("/projects");
}

export async function duplicateProjectAction(projectId: string) {
  const session = await requireSession();
  const project = await duplicateProject(session.user.id, projectId);
  revalidatePath("/projects");
  return project;
}

export async function getProjectOverviewAction(projectId: string) {
  const session = await requireSession();
  return getProjectOverview(session.user.id, projectId);
}
