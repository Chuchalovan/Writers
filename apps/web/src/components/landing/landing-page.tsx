"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  BookOpen,
  Users,
  Globe,
  GitBranch,
  PenLine,
  Sparkles,
  Shield,
  Layers,
} from "lucide-react";

const FEATURES = [
  { key: "structure", icon: Layers },
  { key: "characters", icon: Users },
  { key: "world", icon: Globe },
  { key: "plot", icon: GitBranch },
  { key: "editor", icon: PenLine },
  { key: "ai", icon: Sparkles },
] as const;

const PRINCIPLES = ["author", "progressive", "context", "calm", "ownership"] as const;

export function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium">
            <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />
            {t("brand")}
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("getStarted")}
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-display max-w-3xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("getStarted")}
            </Link>
            <a
              href="#features"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {t("exploreFeatures")}
            </a>
          </div>
        </section>

        <section id="features" className="border-t border-border bg-secondary/40 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display text-2xl font-medium md:text-3xl">{t("featuresTitle")}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{t("featuresSubtitle")}</p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ key, icon: Icon }) => (
                <article
                  key={key}
                  className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/30"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-medium">{t(`feature_${key}_title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`feature_${key}_desc`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-display text-2xl font-medium md:text-3xl">{t("principlesTitle")}</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {PRINCIPLES.map((key) => (
                <li key={key} className="flex gap-4">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium">{t(`principle_${key}_title`)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(`principle_${key}_desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="ai" className="border-t border-border bg-secondary/40 py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="font-display text-2xl font-medium md:text-3xl">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("ctaDesc")}</p>
            <Link
              href="/register"
              className="mt-8 inline-flex rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("getStarted")}
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">{t("ctaNote")}</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          <span>{t("footerCopyright")}</span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground">
              {t("login")}
            </Link>
            <Link href="/register" className="hover:text-foreground">
              {t("getStarted")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
