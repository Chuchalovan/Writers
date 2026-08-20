import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BookOpen } from "lucide-react";
import type { ProjectWithCounts } from "@/lib/projects";
import { ProjectActions } from "@/components/project/project-actions";

export async function ProjectCard({
  project,
  locale,
}: {
  project: ProjectWithCounts;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <div className="group relative rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/40 hover:bg-secondary/30">
      <div className="absolute right-3 top-3">
        <ProjectActions projectId={project.id} title={project.title} />
      </div>
      <Link href={`/projects/${project.id}`} className="block pr-10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-medium group-hover:text-accent">{project.title}</h2>
            {project.genre && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{project.genre}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>{t("wordCount", { count: project.totalWordCount })}</span>
              <span>{t("nodeCount", { count: project._count.nodes })}</span>
              {project.archivedAt ? <span>{t("archivedBadge")}</span> : null}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
