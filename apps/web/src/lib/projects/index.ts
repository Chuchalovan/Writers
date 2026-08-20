import type { Project, ProjectStatus } from "@prisma/client";
import { AppError, ERROR_CODES } from "@manuscript/shared";
import { prisma } from "@/lib/db";
import { assertProjectOwner } from "@/lib/projects/ownership";

export { assertProjectOwner };

export type ProjectWithCounts = Project & {
  _count: { nodes: number };
};

export async function getProjectsForUser(
  userId: string,
  options: { query?: string; includeArchived?: boolean } = {}
): Promise<ProjectWithCounts[]> {
  const query = options.query?.trim();
  return prisma.project.findMany({
    where: {
      userId,
      ...(options.includeArchived ? {} : { archivedAt: null }),
      ...(query ? { title: { contains: query, mode: "insensitive" } } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { nodes: { where: { deletedAt: null } } } } },
  });
}

export async function getProjectForUser(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      _count: { select: { nodes: { where: { deletedAt: null } } } },
    },
  });
  if (!project) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Project not found");
  }
  return project;
}

export async function createProject(userId: string, title: string): Promise<Project> {
  return prisma.project.create({
    data: { userId, title: title.trim(), plotMethod: "blank" },
  });
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: {
    title?: string;
    subtitle?: string | null;
    description?: string | null;
    logline?: string | null;
    genre?: string | null;
    targetWordCount?: number | null;
    status?: ProjectStatus;
    plotMethod?: string;
  }
): Promise<Project> {
  await assertProjectOwner(userId, projectId);
  return prisma.project.update({
    where: { id: projectId },
    data,
  });
}

export async function archiveProject(userId: string, projectId: string): Promise<void> {
  await assertProjectOwner(userId, projectId);
  await prisma.project.update({
    where: { id: projectId },
    data: { archivedAt: new Date(), status: "archived" },
  });
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  await assertProjectOwner(userId, projectId);
  await prisma.project.delete({ where: { id: projectId } });
}
