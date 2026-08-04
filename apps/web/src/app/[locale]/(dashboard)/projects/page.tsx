import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { FolderOpen } from "lucide-react";
import { getProjectsAction } from "@/actions/projects";
import { CreateProjectButton } from "@/components/project/create-project-dialog";
import { ProjectCard } from "@/components/project/project-card";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const projects = await getProjectsAction();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CreateProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground/40" aria-hidden="true" />
          <p className="mt-4 font-medium">{t("noProjects")}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("emptyHint")}</p>
          <div className="mt-6">
            <CreateProjectButton />
          </div>
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
