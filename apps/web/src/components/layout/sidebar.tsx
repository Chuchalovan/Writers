"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { BookOpen, FolderOpen, BarChart3, Settings } from "lucide-react";

const navItems = [
  { href: "/projects", icon: FolderOpen, key: "projects" as const },
  { href: "/stats", icon: BarChart3, key: "stats" as const },
  { href: "/settings", icon: Settings, key: "settings" as const },
];

export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <BookOpen className="h-5 w-5" />
        <span className="font-serif text-lg font-semibold">Manuscript</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, icon: Icon, key }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
