import type { Project, ProjectStatus } from "@/lib/db";
import { AppError, ERROR_CODES } from "@manuscript/shared";
import { db } from "@/lib/db";
import { manuscriptNode, project } from "@/lib/db/schema";
import { assertProjectOwner } from "@/lib/projects/ownership";
import { and, count, desc, eq, ilike, isNull, sql } from "drizzle-orm";

export { assertProjectOwner };

export type ProjectWithCounts = Project & {
  _count: { nodes: number };
};

function withNodeCount(row: Project, nodes: number): ProjectWithCounts {
  return { ...row, _count: { nodes } };
}

async function loadProjectWithCounts(userId: string, projectId?: string, options: {
  query?: string;
  includeArchived?: boolean;
} = {}): Promise<ProjectWithCounts[]> {
  const query = options.query?.trim();
  const filters = [
    eq(project.userId, userId),
    ...(options.includeArchived ? [] : [isNull(project.archivedAt)]),
    ...(query ? [ilike(project.title, `%${query}%`)] : []),
    ...(projectId ? [eq(project.id, projectId)] : []),
  ];

  const nodeCount = db
    .select({
      projectId: manuscriptNode.projectId,
      nodes: count().as("nodes"),
    })
    .from(manuscriptNode)
    .where(isNull(manuscriptNode.deletedAt))
    .groupBy(manuscriptNode.projectId)
    .as("node_count");

  const rows = await db
    .select({
      project,
      nodes: sql<number>`coalesce(${nodeCount.nodes}, 0)`.mapWith(Number),
    })
    .from(project)
    .leftJoin(nodeCount, eq(nodeCount.projectId, project.id))
    .where(and(...filters))
    .orderBy(desc(project.updatedAt));

  return rows.map((row) => withNodeCount(row.project, row.nodes));
}

export async function getProjectsForUser(
  userId: string,
  options: { query?: string; includeArchived?: boolean } = {}
): Promise<ProjectWithCounts[]> {
  return loadProjectWithCounts(userId, undefined, options);
}

export async function getProjectForUser(userId: string, projectId: string) {
  await assertProjectOwner(userId, projectId);
  const [found] = await loadProjectWithCounts(userId, projectId, { includeArchived: true });
  if (!found) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Project not found");
  }
  return found;
}

export async function createProject(userId: string, title: string): Promise<Project> {
  const [created] = await db
    .insert(project)
    .values({ userId, title: title.trim(), plotMethod: "blank" })
    .returning();
  return created;
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
  const [updated] = await db
    .update(project)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(project.id, projectId))
    .returning();
  if (!updated) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Project not found");
  }
  return updated;
}

export async function archiveProject(userId: string, projectId: string): Promise<void> {
  await assertProjectOwner(userId, projectId);
  await db
    .update(project)
    .set({ archivedAt: new Date(), status: "archived", updatedAt: new Date() })
    .where(eq(project.id, projectId));
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  await assertProjectOwner(userId, projectId);
  await db.delete(project).where(eq(project.id, projectId));
}
