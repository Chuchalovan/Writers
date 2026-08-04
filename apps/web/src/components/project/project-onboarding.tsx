"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { PenLine, GitBranch, FileText } from "lucide-react";
import {
  startPlanningAction,
  startWritingAction,
} from "@/actions/manuscript";
import { Button } from "@/components/ui/button";

export function ProjectOnboarding({ projectId }: { projectId: string }) {
  const t = useTranslations("projects");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleWrite() {
    startTransition(async () => {
      const node = await startWritingAction(projectId);
      router.push(`/projects/${projectId}/scenes/${node.id}`);
    });
  }

  function handlePlan() {
    startTransition(async () => {
      await startPlanningAction(projectId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 p-6">
      <p className="text-sm text-muted-foreground">{t("onboardingDesc")}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          disabled={pending}
          onClick={handleWrite}
        >
          <PenLine className="h-5 w-5 text-accent" aria-hidden="true" />
          <span>{t("emptyActionWrite")}</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          disabled={pending}
          onClick={handlePlan}
        >
          <GitBranch className="h-5 w-5 text-accent" aria-hidden="true" />
          <span>{t("emptyActionPlan")}</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4" disabled>
          <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">{t("emptyActionMaterials")}</span>
        </Button>
      </div>
    </div>
  );
}
