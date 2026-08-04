// url=https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=9-239
// source=src/components/manuscript/manuscript-tree.tsx
// component=TreeNode row (scene)
import figma from "figma";

const instance = figma.selectedInstance;

const textLayers = instance
  .findLayers((node) => node.type === "TEXT")
  .filter((node) => node.type === "TEXT");

const title = textLayers[0]?.textContent ?? "Scene title";
const status = textLayers[1]?.textContent ?? "Draft";
const wordCount = textLayers[2]?.textContent ?? "1,234";

export default {
  example: figma.code`
    <div
      className="group flex items-center gap-1 rounded-md py-1 pr-2 hover:bg-secondary/60"
      style={{ paddingLeft: "20px" }}
    >
      <button
        type="button"
        className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground"
        aria-label="Expand"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <Link
        href="/projects/{projectId}/scenes/{sceneId}"
        className="min-w-0 flex-1 truncate text-sm hover:text-accent"
      >
        ${title}
      </Link>
      <span className="hidden text-xs text-muted-foreground sm:inline">${status}</span>
      <span className="text-xs tabular-nums text-muted-foreground">${wordCount}</span>
    </div>
  `,
  imports: [
    'import { ChevronDown, FileText } from "lucide-react"',
    'import { Link } from "@/i18n/routing"',
  ],
  id: "manuscript-tree-item",
  metadata: { nestable: true },
};
