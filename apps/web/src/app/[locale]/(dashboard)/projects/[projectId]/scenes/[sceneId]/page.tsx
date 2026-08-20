import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getProjectAction } from "@/actions/projects";
import { getSceneAction } from "@/actions/manuscript";
import { SceneEditor } from "@/components/editor/scene-editor";

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

  if (scene.node.deletedAt) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/projects/${projectId}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {project.title}
        </Link>
        <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          {t("deleted")}
        </p>
      </div>
    );
  }

  const json =
    scene.content?.contentJson && typeof scene.content.contentJson === "object"
      ? (scene.content.contentJson as Record<string, unknown>)
      : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/projects/${projectId}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {project.title}
      </Link>

      <h1 className="mb-4 font-display text-xl font-medium">{scene.node.title}</h1>
      <SceneEditor
        sceneId={sceneId}
        initialJson={json}
        initialPlainText={scene.content?.plainText ?? ""}
        initialVersion={scene.content?.version ?? 1}
      />
    </div>
  );
}
