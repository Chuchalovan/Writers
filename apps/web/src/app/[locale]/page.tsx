import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { BookOpen, PenLine, BarChart3 } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-serif text-xl font-semibold">
            <BookOpen className="h-5 w-5" />
            Manuscript
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button asChild>
              <Link href="/register">{t("getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">{t("getStarted")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-secondary/30 py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
            <FeatureCard
              icon={<PenLine className="h-6 w-6" />}
              title={t("featureEditorTitle")}
              description={t("featureEditorDesc")}
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title={t("featureStructureTitle")}
              description={t("featureStructureDesc")}
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title={t("featureStatsTitle")}
              description={t("featureStatsDesc")}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
