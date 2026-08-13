// url=https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=3-52
// source=src/components/layout/sidebar.tsx
// component=Sidebar nav link pattern
import figma from "figma";

const instance = figma.selectedInstance;

const textLayers = instance.findLayers((node) => node.type === "TEXT");
const labelNode = textLayers.find((node) => node.type === "TEXT");
const label = labelNode && labelNode.type === "TEXT" ? labelNode.textContent : "Nav item";

export default {
  example: figma.code`
    <Link
      href="/projects"
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
      )}
    >
      ${label}
    </Link>
  `,
  imports: [
    'import { Link } from "@/i18n/routing"',
    'import { cn } from "@/lib/utils"',
  ],
  id: "navigation-item-default",
  metadata: { nestable: true },
};
