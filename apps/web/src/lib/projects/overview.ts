import { AppError, ERROR_CODES } from "@manuscript/shared";
import { prisma } from "@/lib/db";
import { assertProjectOwner } from "@/lib/projects/ownership";
import type { ProjectWithCounts } from "@/lib/projects";

export type OverviewNextStep = {
  id: "continue" | "structure" | "character" | "write";
};

export type ProjectOverview = {
  project: ProjectWithCounts;
  continueScene: { id: string; title: string } | null;
  characterCount: number;
  locationCount: number;
  nextSteps: OverviewNextStep[];
  progressPercent: number | null;
};

export async function getProjectOverview(
  userId: string,
  projectId: string
): Promise<ProjectOverview> {
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

  const continueScene = await resolveContinueScene(projectId, project.continueNodeId);

  const [characterCount, locationCount] = await Promise.all([
    prisma.character.count({ where: { projectId, deletedAt: null } }),
    prisma.worldArticle.count({
      where: { projectId, deletedAt: null, type: "location" },
    }),
  ]);

  const nextSteps: OverviewNextStep[] = [];
  if (continueScene) nextSteps.push({ id: "continue" });
  else if (project._count.nodes === 0) nextSteps.push({ id: "write" }, { id: "structure" });
  else nextSteps.push({ id: "write" });
  if (characterCount === 0) nextSteps.push({ id: "character" });
  const limited = nextSteps.slice(0, 3);

  const progressPercent =
    project.targetWordCount && project.targetWordCount > 0
      ? Math.min(100, Math.round((project.totalWordCount / project.targetWordCount) * 100))
      : null;

  return {
    project,
    continueScene,
    characterCount,
    locationCount,
    nextSteps: limited,
    progressPercent,
  };
}

async function resolveContinueScene(projectId: string, continueNodeId: string | null) {
  if (continueNodeId) {
    const node = await prisma.manuscriptNode.findFirst({
      where: { id: continueNodeId, projectId, type: "scene", deletedAt: null },
      select: { id: true, title: true },
    });
    if (node) return node;
  }

  return prisma.manuscriptNode.findFirst({
    where: { projectId, type: "scene", deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true },
  });
}
