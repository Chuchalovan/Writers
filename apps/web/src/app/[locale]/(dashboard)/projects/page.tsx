import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { FolderOpen } from "lucide-react";
import { getProjectsAction } from "@/actions/projects";
import { CreateProjectButton } from "@/components/project/create-project-dialog";
import { ProjectCard } from "@/components/project/project-card";
import { ProjectFilters } from "@/components/project/project-filters";

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; archived?: string }>;
}) {
  const { locale } = await params;
  const { q, archived } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const query = q?.trim() ?? "";
  const includeArchived = archived === "1";
  const projects = await getProjectsAction({ query, includeArchived });
  const isSearchEmpty = query.length > 0 && projects.length === 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CreateProjectButton />
      </div>

      <ProjectFilters query={query} includeArchived={includeArchived} />

      {projects.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground/40" aria-hidden="true" />
          <p className="mt-4 font-medium">{isSearchEmpty ? t("searchEmpty") : t("noProjects")}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {isSearchEmpty ? t("searchEmptyHint") : t("emptyHint")}
          </p>
          {!isSearchEmpty && (
            <div className="mt-6">
              <CreateProjectButton />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
