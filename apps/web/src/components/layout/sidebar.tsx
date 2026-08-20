"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { BookOpen, FolderOpen, Settings } from "lucide-react";
import { HeaderAccount } from "@/components/layout/header";

export function Sidebar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const projectMatch = pathname.match(/^\/projects\/([^/]+)/);
  const projectId = projectMatch?.[1];
  const inProject = Boolean(projectId);

  const items = [
    {
      href: "/projects" as const,
      icon: FolderOpen,
      label: t("projects"),
      active: pathname === "/projects",
    },
    ...(inProject
      ? [
          {
            href: `/projects/${projectId}` as const,
            icon: BookOpen,
            label: t("manuscript"),
            active:
              pathname.startsWith(`/projects/${projectId}`) &&
              !pathname.startsWith("/settings"),
          },
        ]
      : []),
    {
      href: "/settings" as const,
      icon: Settings,
      label: t("settings"),
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <aside className="flex h-full w-16 shrink-0 flex-col items-center border-r border-chrome-border bg-chrome text-chrome-foreground">
      <Link
        href="/projects"
        className="flex h-14 w-full items-center justify-center text-chrome-foreground hover:bg-chrome-accent"
        aria-label={tCommon("appName")}
        title={tCommon("appName")}
      >
        <BookOpen className="h-5 w-5" aria-hidden="true" />
      </Link>
      <nav className="flex flex-1 flex-col items-center gap-1 py-2">
        {items.map(({ href, icon: Icon, label, active }) => (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-chrome-accent text-chrome-foreground"
                : "text-chrome-muted hover:bg-chrome-accent hover:text-chrome-foreground"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </Link>
        ))}
      </nav>
      <div className="flex w-full flex-col items-center gap-2 border-t border-chrome-border py-3">
        <HeaderAccount compact />
      </div>
    </aside>
  );
}
