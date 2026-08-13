// url=https://www.figma.com/design/DY4LOZnkponU6E1rmb34Fs/Manuscript-Ink-Studio?node-id=2-76
// source=src/components/ui/button.tsx
// component=Button
import figma from "figma";

const instance = figma.selectedInstance;

function getLabel() {
  const named = instance.findText("Label");
  if (named && named.type !== "ERROR") {
    return named.textContent;
  }

  const textLayers = instance.findLayers((node) => node.type === "TEXT");
  const first = textLayers.find((node) => node.type === "TEXT");
  return first && first.type === "TEXT" ? first.textContent : "Button";
}

const label = getLabel();

export default {
  example: figma.code`<Button variant="secondary">${label}</Button>`,
  imports: ['import { Button } from "@/components/ui/button"'],
  id: "button-secondary",
  metadata: { nestable: true },
};
