// url=https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=4-53
// source=src/components/project/project-card.tsx
// component=ProjectCard
import figma from "figma";

const instance = figma.selectedInstance;

const textLayers = instance
  .findLayers((node) => node.type === "TEXT")
  .filter((node) => node.type === "TEXT");

const title = textLayers[0]?.textContent ?? "Project title";
const meta = textLayers[1]?.textContent ?? "Genre · word count";

export default {
  example: figma.code`
    <Link href="/projects/{projectId}" className="group block rounded-lg border border-border bg-card p-5">
      <h2 className="truncate font-medium group-hover:text-accent">${title}</h2>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">${meta}</p>
    </Link>
  `,
  imports: ['import { Link } from "@/i18n/routing"'],
  id: "project-card",
  metadata: { nestable: false },
};
