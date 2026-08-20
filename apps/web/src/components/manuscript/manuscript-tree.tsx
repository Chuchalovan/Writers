"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  BookMarked,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import {
  createNodeFormAction,
  deleteNodeAction,
  moveNodeAction,
  reorderNodesAction,
  restoreNodeAction,
  setSceneStatusAction,
} from "@/actions/manuscript";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { ManuscriptNodeWithContent } from "@/lib/manuscript";
import type { ManuscriptNode, ManuscriptNodeType, SceneStatus } from "@prisma/client";

const TYPE_ICONS = {
  part: Layers,
  chapter: BookMarked,
  scene: FileText,
} as const;

const STATUS_ORDER: SceneStatus[] = ["idea", "planned", "draft", "revision", "ready"];

function buildChildMap(nodes: ManuscriptNodeWithContent[]) {
  const map = new Map<string | null, ManuscriptNodeWithContent[]>();
  for (const node of nodes) {
    const key = node.parentId;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(node);
  }
  for (const group of map.values()) {
    group.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
  }
  return map;
}

function matchesQuery(node: ManuscriptNodeWithContent, query: string, childMap: Map<string | null, ManuscriptNodeWithContent[]>): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  if (node.title.toLowerCase().includes(needle)) return true;
  return (childMap.get(node.id) ?? []).some((child) => matchesQuery(child, query, childMap));
}

function TreeNode({
  node,
  projectId,
  depth,
  childMap,
  query,
  onError,
}: {
  node: ManuscriptNodeWithContent;
  projectId: string;
  depth: number;
  childMap: Map<string | null, ManuscriptNodeWithContent[]>;
  query: string;
  onError: (message: string) => void;
}) {
  const t = useTranslations("manuscript");
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [pending, startTransition] = useTransition();
  const Icon = TYPE_ICONS[node.type];
  const children = (childMap.get(node.id) ?? []).filter((child) => matchesQuery(child, query, childMap));

  function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    startTransition(() => deleteNodeAction(node.id, projectId));
  }

  function cycleStatus() {
    if (node.type !== "scene" || !node.status) return;
    const index = STATUS_ORDER.indexOf(node.status);
    const next = STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
    startTransition(async () => {
      await setSceneStatusAction({ id: node.id, status: next });
    });
  }

  async function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const draggedId = event.dataTransfer.getData("text/node-id");
    if (!draggedId || draggedId === node.id) return;
    const siblings = childMap.get(node.parentId) ?? [];
    const dragged = siblings.find((item) => item.id === draggedId);
    startTransition(async () => {
      try {
        if (dragged) {
          const orderedIds = siblings.map((item) => item.id);
          const from = orderedIds.indexOf(draggedId);
          const to = orderedIds.indexOf(node.id);
          orderedIds.splice(from, 1);
          orderedIds.splice(to, 0, draggedId);
          await reorderNodesAction({
            projectId,
            parentId: node.parentId,
            orderedIds,
          });
        } else {
          await moveNodeAction({
            id: draggedId,
            newParentId: node.type === "scene" ? node.parentId : node.id,
            position: node.position,
          });
        }
        router.refresh();
      } catch {
        onError(t("reorderError"));
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div
        className="group flex items-center gap-1 rounded-md py-1 pr-2 hover:bg-secondary/60"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData("text/node-id", node.id);
          event.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
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
          <button
            type="button"
            className="hidden items-center gap-1 text-xs sm:inline-flex"
            onClick={cycleStatus}
            title={t(`status_${node.status}`)}
          >
            <span aria-hidden="true">●</span>
            <span>{t(`status_${node.status}`)}</span>
          </button>
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
            query={query}
            onError={onError}
          />
        ))}
    </div>
  );
}

export function ManuscriptTree({
  projectId,
  nodes,
  deletedNodes = [],
}: {
  projectId: string;
  nodes: ManuscriptNodeWithContent[];
  deletedNodes?: ManuscriptNode[];
}) {
  const t = useTranslations("manuscript");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const childMap = useMemo(() => buildChildMap(nodes), [nodes]);
  const roots = childMap.get(null) ?? [];
  const structuredRoots = roots.filter((node) => node.type !== "scene" && matchesQuery(node, query, childMap));
  const unassigned = roots.filter((node) => node.type === "scene" && matchesQuery(node, query, childMap));

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
      <div className="border-b border-border px-4 py-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchTitles")}
          aria-label={t("searchTitles")}
        />
      </div>
      {error && <p className="px-4 py-2 text-sm text-destructive">{error}</p>}
      <div className="p-2">
        {structuredRoots.length === 0 && unassigned.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <>
            {structuredRoots.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                projectId={projectId}
                depth={0}
                childMap={childMap}
                query={query}
                onError={setError}
              />
            ))}
            {unassigned.length > 0 && (
              <div className="mt-2">
                <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("unassigned")}
                </p>
                {unassigned.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    projectId={projectId}
                    depth={0}
                    childMap={childMap}
                    query={query}
                    onError={setError}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {deletedNodes.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("trash")}</h3>
          <ul className="mt-2 space-y-1">
            {deletedNodes.map((node) => (
              <li key={node.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate">{node.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    startTransition(async () => {
                      await restoreNodeAction(node.id, projectId);
                      router.refresh();
                    });
                  }}
                >
                  {t("restore")}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
