import type { Project, ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export type ProjectWithCounts = Project & {
  _count: { nodes: number };
};

export async function getProjectsForUser(userId: string): Promise<ProjectWithCounts[]> {
  return prisma.project.findMany({
    where: { userId, archivedAt: null },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { nodes: { where: { deletedAt: null } } } } },
  });
}

export async function getProjectForUser(userId: string, projectId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, userId, archivedAt: null },
    include: {
      _count: { select: { nodes: { where: { deletedAt: null } } } },
    },
  });
}

export async function createProject(userId: string, title: string): Promise<Project> {
  return prisma.project.create({
    data: { userId, title: title.trim() },
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

export async function assertProjectOwner(userId: string, projectId: string): Promise<void> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });
  if (!project) {
    throw new Error("Project not found");
  }
}
