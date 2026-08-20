import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjectAction } from "@/actions/projects";
import {
  getDeletedNodesAction,
  getNodesAction,
  getSceneAction,
  getSceneContextAction,
  listProjectCharactersAction,
  listProjectWorldAction,
} from "@/actions/manuscript";
import { SceneEditor } from "@/components/editor/scene-editor";
import { SceneInspector } from "@/components/editor/scene-inspector";
import { ManuscriptTree } from "@/components/manuscript/manuscript-tree";
import { StudioWorkspace } from "@/components/layout/studio-workspace";
import { sceneIdsInNavigatorOrder } from "@/lib/manuscript";

export default async function ScenePage({
  params,
}: {
  params: Promise<{ locale: string; projectId: string; sceneId: string }>;
}) {
  const { locale, projectId, sceneId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("editor");

  let project;
  try {
    project = await getProjectAction(projectId);
  } catch {
    notFound();
  }

  let scene;
  try {
    scene = await getSceneAction(sceneId);
  } catch {
    notFound();
  }

  if (scene.node.projectId !== projectId || scene.node.type !== "scene") {
    notFound();
  }

  const [nodes, deletedNodes, context, characters, world] = await Promise.all([
    getNodesAction(projectId),
    getDeletedNodesAction(projectId),
    getSceneContextAction(sceneId),
    listProjectCharactersAction(projectId),
    listProjectWorldAction(projectId),
  ]);

  const order = sceneIdsInNavigatorOrder(nodes);
  const index = order.indexOf(sceneId);
  const previousSceneHref =
    index > 0 ? `/projects/${projectId}/scenes/${order[index - 1]}` : null;
  const nextSceneHref =
    index >= 0 && index < order.length - 1
      ? `/projects/${projectId}/scenes/${order[index + 1]}`
      : null;

  const json =
    scene.content?.contentJson && typeof scene.content.contentJson === "object"
      ? (scene.content.contentJson as Record<string, unknown>)
      : null;

  const inspector = (
    <SceneInspector
      sceneId={sceneId}
      metadata={
        context.metadata
          ? {
              goal: context.metadata.goal,
              conflict: context.metadata.conflict,
              outcome: context.metadata.outcome,
              povCharacterId: context.metadata.povCharacterId,
              locationId: context.metadata.locationId,
              storyTime: context.metadata.storyTime,
            }
          : null
      }
      participants={context.participants.map((item) => item.character)}
      characters={characters}
      locations={world}
    />
  );

  if (scene.node.deletedAt) {
    return (
      <StudioWorkspace
        navigator={
          <ManuscriptTree
            projectId={projectId}
            nodes={nodes}
            deletedNodes={deletedNodes}
            currentNodeId={sceneId}
            variant="chrome"
          />
        }
        sheet={
          <div className="flex h-full items-center justify-center p-8">
            <p className="rounded-lg border border-dashed border-chrome-border bg-background/40 p-8 text-center text-muted-foreground">
              {t("deleted")}
            </p>
          </div>
        }
        inspector={inspector}
      />
    );
  }

  return (
    <StudioWorkspace
      navigator={
        <ManuscriptTree
          projectId={projectId}
          nodes={nodes}
          deletedNodes={deletedNodes}
          currentNodeId={sceneId}
          variant="chrome"
        />
      }
      sheet={
        <div className="mx-auto flex min-h-full max-w-[72ch] flex-col px-10 py-8">
          <p className="mb-1 text-xs text-muted-foreground">{project.title}</p>
          <h1 className="mb-6 font-display text-2xl font-medium text-foreground">
            {scene.node.title}
          </h1>
          <SceneEditor
            sceneId={sceneId}
            initialJson={json}
            initialPlainText={scene.content?.plainText ?? ""}
            initialVersion={scene.content?.version ?? 1}
            embedded
          />
        </div>
      }
      inspector={inspector}
      previousSceneHref={previousSceneHref}
      nextSceneHref={nextSceneHref}
    />
  );
}
