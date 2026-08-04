import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getProjectAction } from "@/actions/projects";
import { getNodeWithAuth } from "@/lib/manuscript";
import { requireSession } from "@/lib/auth/session";

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

  const session = await requireSession();
  let scene;
  try {
    scene = await getNodeWithAuth(session.user.id, sceneId);
  } catch {
    notFound();
  }

  if (scene.projectId !== projectId || scene.type !== "scene") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/projects/${projectId}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {project.title}
      </Link>

      <h1 className="font-display text-xl font-medium">{scene.title}</h1>
      <p className="mt-6 rounded-lg border border-dashed border-border bg-secondary/30 p-8 text-center text-muted-foreground">
        {t("comingSoon")}
      </p>
    </div>
  );
}
