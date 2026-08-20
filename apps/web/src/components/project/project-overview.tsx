import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PenLine } from "lucide-react";
import type { ProjectOverview } from "@/lib/projects/overview";
import { Button } from "@/components/ui/button";

export async function ProjectOverviewPanel({
  overview,
  locale,
}: {
  overview: ProjectOverview;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const primary = overview.nextSteps[0];

  return (
    <section className="mb-8 rounded-lg border bg-card p-5">
      {overview.continueScene && primary?.id === "continue" ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t("continueLabel")}</p>
            <p className="font-medium">{overview.continueScene.title}</p>
          </div>
          <Button asChild>
            <Link href={`/projects/${overview.project.id}/scenes/${overview.continueScene.id}`}>
              <PenLine className="mr-2 h-4 w-4" />
              {t("continueAction")}
            </Link>
          </Button>
        </div>
      ) : null}

      {overview.progressPercent !== null ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {t("progress", { percent: overview.progressPercent })}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{t("noFakeProgress")}</p>
      )}

      {overview.nextSteps.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {overview.nextSteps.map((step) => (
            <li key={step.id}>{t(`next_${step.id}`)}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
