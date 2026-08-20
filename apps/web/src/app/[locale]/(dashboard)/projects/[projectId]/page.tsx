import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getProjectAction, getProjectOverviewAction } from "@/actions/projects";
import { getNodesAction, getDeletedNodesAction } from "@/actions/manuscript";
import { ManuscriptTree } from "@/components/manuscript/manuscript-tree";
import { ProjectOnboarding } from "@/components/project/project-onboarding";
import { ProjectOverviewPanel } from "@/components/project/project-overview";
import { ProjectActions } from "@/components/project/project-actions";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>;
}) {
  const { locale, projectId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  let project;
  try {
    project = await getProjectAction(projectId);
  } catch {
    notFound();
  }

  const nodes = await getNodesAction(projectId);
  const deletedNodes = await getDeletedNodesAction(projectId);
  const overview = await getProjectOverviewAction(projectId);
  const isEmpty = nodes.length === 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("backToList")}
      </Link>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">{project.title}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{t("wordCount", { count: project.totalWordCount })}</span>
            <span>{t("nodeCount", { count: project._count.nodes })}</span>
            {project.genre && <span>{project.genre}</span>}
          </div>
        </div>
        <ProjectActions projectId={project.id} title={project.title} />
      </div>

      <ProjectOverviewPanel overview={overview} locale={locale} />

      {isEmpty && (
        <div className="mb-8">
          <ProjectOnboarding projectId={projectId} />
        </div>
      )}

      <ManuscriptTree projectId={projectId} nodes={nodes} deletedNodes={deletedNodes} />
    </div>
  );
}
