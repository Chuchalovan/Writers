"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = /\/projects\/[^/]+\/scenes\//.test(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main
          className={cn(
            "min-w-0 flex-1",
            isStudio ? "overflow-hidden" : "overflow-y-auto p-6"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
