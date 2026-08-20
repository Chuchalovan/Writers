"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { PanelRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioLayout } from "@/lib/editor/use-studio-layout";
import { cn } from "@/lib/utils";

export function StudioWorkspace({
  navigator,
  sheet,
  inspector,
  previousSceneHref,
  nextSceneHref,
}: {
  navigator: React.ReactNode;
  sheet: React.ReactNode;
  inspector: React.ReactNode;
  previousSceneHref?: string | null;
  nextSceneHref?: string | null;
}) {
  const t = useTranslations("editor");
  const layout = useStudioLayout();
  const router = useRouter();
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const showNavigator = !focusMode;
  const showInspector =
    !focusMode && (layout === "desktop" || (layout === "compact" && inspectorOpen));

  useEffect(() => {
    if (layout === "desktop") {
      setInspectorOpen(false);
    }
  }, [layout]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setFocusMode((value) => !value);
        return;
      }

      if (event.key === "Escape") {
        if (inspectorOpen && layout === "compact") {
          setInspectorOpen(false);
          return;
        }
        if (focusMode) {
          setFocusMode(false);
        }
        return;
      }

      if (typing) return;

      if (event.altKey && event.key === "ArrowUp" && previousSceneHref) {
        event.preventDefault();
        router.push(previousSceneHref);
      }
      if (event.altKey && event.key === "ArrowDown" && nextSceneHref) {
        event.preventDefault();
        router.push(nextSceneHref);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode, inspectorOpen, layout, nextSceneHref, previousSceneHref, router]);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full overflow-hidden",
        layout === "mobile" && !focusMode ? "flex-col" : "flex-row",
        focusMode && "bg-sheet"
      )}
    >
      {showNavigator && (
        <aside
          className={cn(
            "flex min-h-0 flex-col overflow-hidden border-chrome-border bg-chrome text-chrome-foreground",
            layout === "mobile"
              ? "max-h-[36vh] w-full border-b"
              : "h-full w-[260px] shrink-0 border-r"
          )}
        >
          {navigator}
        </aside>
      )}

      <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-sheet">
        {!focusMode && layout === "compact" && (
          <div className="absolute right-3 top-3 z-10">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setInspectorOpen((value) => !value)}
              aria-pressed={inspectorOpen}
              aria-label={t("toggleInspector")}
            >
              <PanelRight className="mr-1 h-4 w-4" aria-hidden="true" />
              {t("inspector")}
            </Button>
          </div>
        )}
        {focusMode && (
          <div className="absolute right-3 top-3 z-10">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setFocusMode(false)}
              aria-label={t("exitFocus")}
            >
              <X className="mr-1 h-4 w-4" aria-hidden="true" />
              {t("exitFocus")}
            </Button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{sheet}</div>
      </section>

      {showInspector && (
        <aside className="flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-l border-chrome-border bg-chrome text-chrome-foreground">
          {inspector}
        </aside>
      )}
    </div>
  );
}
