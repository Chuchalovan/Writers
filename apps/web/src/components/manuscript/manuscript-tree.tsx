"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  BookMarked,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { deleteNodeAction, createNodeFormAction } from "@/actions/manuscript";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { ManuscriptNodeWithContent } from "@/lib/manuscript";
import type { ManuscriptNodeType, SceneStatus } from "@prisma/client";

const TYPE_ICONS = {
  part: Layers,
  chapter: BookMarked,
  scene: FileText,
} as const;

const STATUS_CLASSES: Record<SceneStatus, string> = {
  idea: "text-status-idea",
  planned: "text-status-planned",
  draft: "text-status-draft",
  revision: "text-status-revision",
  ready: "text-status-ready",
};

function TreeNode({
  node,
  projectId,
  depth,
  childMap,
}: {
  node: ManuscriptNodeWithContent;
  projectId: string;
  depth: number;
  childMap: Map<string | null, ManuscriptNodeWithContent[]>;
}) {
  const t = useTranslations("manuscript");
  const [expanded, setExpanded] = useState(true);
  const [pending, startTransition] = useTransition();
  const Icon = TYPE_ICONS[node.type];
  const children = childMap.get(node.id) ?? [];

  function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    startTransition(() => deleteNodeAction(node.id, projectId));
  }

  return (
    <div>
      <div
        className="group flex items-center gap-1 rounded-md py-1 pr-2 hover:bg-secondary/60"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <button
          type="button"
          className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? t("collapse") : t("expand")}
        >
          {children.length > 0 ? (
            expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        {node.type === "scene" ? (
          <Link
            href={`/projects/${projectId}/scenes/${node.id}`}
            className="min-w-0 flex-1 truncate text-sm hover:text-accent"
          >
            {node.title}
          </Link>
        ) : (
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{node.title}</span>
        )}
        {node.type === "scene" && node.status && (
          <span
            className={cn("hidden text-xs sm:inline", STATUS_CLASSES[node.status])}
          >
            {t(`status_${node.status}`)}
          </span>
        )}
        <span className="text-xs tabular-nums text-muted-foreground">{node.wordCount}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100"
          onClick={handleDelete}
          disabled={pending}
          aria-label={t("delete")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {expanded &&
        children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            projectId={projectId}
            depth={depth + 1}
            childMap={childMap}
          />
        ))}
    </div>
  );
}

function buildChildMap(nodes: ManuscriptNodeWithContent[]) {
  const map = new Map<string | null, ManuscriptNodeWithContent[]>();
  for (const node of nodes) {
    const key = node.parentId;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(node);
  }
  for (const group of map.values()) {
    group.sort((a, b) => a.position - b.position);
  }
  return map;
}

export function ManuscriptTree({
  projectId,
  nodes,
}: {
  projectId: string;
  nodes: ManuscriptNodeWithContent[];
}) {
  const t = useTranslations("manuscript");
  const [pending, startTransition] = useTransition();
  const childMap = buildChildMap(nodes);
  const roots = childMap.get(null) ?? [];

  function addNode(type: ManuscriptNodeType) {
    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("type", type);
    startTransition(async () => {
      await createNodeFormAction(formData);
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <div className="flex flex-wrap gap-1">
          {(["part", "chapter", "scene"] as const).map((type) => (
            <Button
              key={type}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              disabled={pending}
              onClick={() => addNode(type)}
            >
              <Plus className="h-3.5 w-3.5" />
              {t(`add_${type}`)}
            </Button>
          ))}
        </div>
      </div>
      <div className="p-2">
        {roots.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          roots.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              projectId={projectId}
              depth={0}
              childMap={childMap}
            />
          ))
        )}
      </div>
    </div>
  );
}
