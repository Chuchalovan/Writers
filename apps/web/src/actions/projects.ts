"use server";

import { revalidatePath } from "next/cache";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@manuscript/shared";
import { requireSession } from "@/lib/auth/session";
import {
  archiveProject,
  createProject,
  deleteProject,
  getProjectForUser,
  getProjectsForUser,
  updateProject,
} from "@/lib/projects";

export async function getProjectsAction() {
  const session = await requireSession();
  return getProjectsForUser(session.user.id);
}

export async function getProjectAction(projectId: string) {
  const session = await requireSession();
  const project = await getProjectForUser(session.user.id, projectId);
  if (!project) throw new Error("Project not found");
  return project;
}

export type ProjectActionResult = Awaited<ReturnType<typeof getProjectAction>>;

export async function createProjectAction(formData: FormData) {
  const session = await requireSession();
  const parsed = CreateProjectSchema.safeParse({
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { error: "invalid_title" as const };
  }

  const project = await createProject(session.user.id, parsed.data.title);
  revalidatePath("/projects");
  return { project };
}

export async function updateProjectAction(input: unknown) {
  const session = await requireSession();
  const parsed = UpdateProjectSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

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
