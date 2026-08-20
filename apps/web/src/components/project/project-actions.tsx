"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { MoreHorizontal } from "lucide-react";
import {
  archiveProjectAction,
  deleteProjectAction,
  duplicateProjectAction,
  updateProjectAction,
} from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProjectActions({
  projectId,
  title,
}: {
  projectId: string;
  title: string;
}) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<"archive" | "delete" | "rename" | null>(null);
  const [renameValue, setRenameValue] = useState(title);

  function runArchive() {
    startTransition(async () => {
      await archiveProjectAction(projectId);
      setConfirm(null);
      router.refresh();
    });
  }

  function runDelete() {
    startTransition(async () => {
      await deleteProjectAction(projectId);
      setConfirm(null);
      router.refresh();
    });
  }

  function runDuplicate() {
    startTransition(async () => {
      const copy = await duplicateProjectAction(projectId);
      router.push(`/projects/${copy.id}`);
    });
  }

  function runRename() {
    const next = renameValue.trim();
    if (next.length < 1 || next.length > 200) return;
    startTransition(async () => {
      await updateProjectAction({ id: projectId, title: next });
      setConfirm(null);
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={t("actions")}
            disabled={pending}
            onClick={(event) => event.preventDefault()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(event) => event.preventDefault()}>
          <DropdownMenuItem onClick={() => { setRenameValue(title); setConfirm("rename"); }}>
            {t("rename")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={runDuplicate}>{t("duplicate")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setConfirm("archive")}>{t("archive")}</DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setConfirm("delete")}
          >
            {tCommon("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <div className="w-full max-w-sm rounded-lg border bg-card p-5 shadow-lg">
            {confirm === "rename" ? (
              <>
                <p className="font-medium">{t("rename")}</p>
                <div className="mt-3 space-y-2">
                  <Label htmlFor={`rename-${projectId}`}>{t("titleLabel")}</Label>
                  <Input
                    id={`rename-${projectId}`}
                    value={renameValue}
                    maxLength={200}
                    onChange={(event) => setRenameValue(event.target.value)}
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setConfirm(null)}>
                    {tCommon("cancel")}
                  </Button>
                  <Button type="button" onClick={runRename} disabled={pending || renameValue.trim().length < 1}>
                    {tCommon("save")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="font-medium">
                  {confirm === "delete" ? t("deleteConfirm") : t("archiveConfirm")}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setConfirm(null)}>
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    type="button"
                    variant={confirm === "delete" ? "destructive" : "default"}
                    onClick={confirm === "delete" ? runDelete : runArchive}
                    disabled={pending}
                  >
                    {confirm === "delete" ? tCommon("delete") : t("archive")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
