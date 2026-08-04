// url=https://www.figma.com/design/7vP03INYMrwQ3Q6qT7A2NT/Manuscript-Design-System?node-id=8-6
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
  example: figma.code`<Button>${label}</Button>`,
  imports: ['import { Button } from "@/components/ui/button"'],
  id: "button-primary",
  metadata: { nestable: true },
};
