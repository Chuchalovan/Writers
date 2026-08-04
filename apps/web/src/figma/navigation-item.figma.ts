// url=https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=8-13
// source=src/components/layout/sidebar.tsx
// component=Sidebar nav link pattern (active)
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
        "bg-sidebar-accent text-foreground"
      )}
    >
      ${label}
    </Link>
  `,
  imports: [
    'import { Link } from "@/i18n/routing"',
    'import { cn } from "@/lib/utils"',
  ],
  id: "navigation-item-active",
  metadata: { nestable: true },
};
