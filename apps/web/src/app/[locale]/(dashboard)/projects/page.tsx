import { getTranslations, setRequestLocale } from "next-intl/server";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button>{t("newProject")}</Button>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">{t("noProjects")}</p>
        <Button className="mt-4" variant="outline">
          {t("newProject")}
        </Button>
      </div>
    </div>
  );
}
