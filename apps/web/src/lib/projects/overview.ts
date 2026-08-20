import { db } from "@/lib/db";
import { getProjectForUser } from "@/lib/projects";
import { character, manuscriptNode, worldArticle } from "@/lib/db/schema";
import { and, count, desc, eq, isNull } from "drizzle-orm";

export type OverviewNextStep = {
  id: "continue" | "structure" | "character" | "write";
};

export type ProjectOverview = {
  project: Awaited<ReturnType<typeof getProjectForUser>>;
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
  const projectRow = await getProjectForUser(userId, projectId);
  const continueScene = await resolveContinueScene(projectId, projectRow.continueNodeId);

  const [characterRows, locationRows] = await Promise.all([
    db
      .select({ value: count() })
      .from(character)
      .where(and(eq(character.projectId, projectId), isNull(character.deletedAt))),
    db
      .select({ value: count() })
      .from(worldArticle)
      .where(
        and(
          eq(worldArticle.projectId, projectId),
          isNull(worldArticle.deletedAt),
          eq(worldArticle.type, "location")
        )
      ),
  ]);

  const characterCount = Number(characterRows[0]?.value ?? 0);
  const locationCount = Number(locationRows[0]?.value ?? 0);

  const nextSteps: OverviewNextStep[] = [];
  if (continueScene) nextSteps.push({ id: "continue" });
  else if (projectRow._count.nodes === 0) nextSteps.push({ id: "write" }, { id: "structure" });
  else nextSteps.push({ id: "write" });
  if (characterCount === 0) nextSteps.push({ id: "character" });

  const progressPercent =
    projectRow.targetWordCount && projectRow.targetWordCount > 0
      ? Math.min(100, Math.round((projectRow.totalWordCount / projectRow.targetWordCount) * 100))
      : null;

  return {
    project: projectRow,
    continueScene,
    characterCount,
    locationCount,
    nextSteps: nextSteps.slice(0, 3),
    progressPercent,
  };
}

async function resolveContinueScene(projectId: string, continueNodeId: string | null) {
  if (continueNodeId) {
    const node = await db.query.manuscriptNode.findFirst({
      where: and(
        eq(manuscriptNode.id, continueNodeId),
        eq(manuscriptNode.projectId, projectId),
        eq(manuscriptNode.type, "scene"),
        isNull(manuscriptNode.deletedAt)
      ),
      columns: { id: true, title: true },
    });
    if (node) return node;
  }

  return (
    (await db.query.manuscriptNode.findFirst({
      where: and(
        eq(manuscriptNode.projectId, projectId),
        eq(manuscriptNode.type, "scene"),
        isNull(manuscriptNode.deletedAt)
      ),
      orderBy: desc(manuscriptNode.updatedAt),
      columns: { id: true, title: true },
    })) ?? null
  );
}
