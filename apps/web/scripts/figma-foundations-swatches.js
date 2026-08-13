/**
 * ARCHIVED — targets old file 7vP03INYMrwQ3Q6qT7A2NT.
 * Ink Studio already has Foundations (2:2). Do not run on DY4LOZnkponU6E1rmb34Fs.
 * Requires Manuscript / Color variables (run figma-sync-color-variables.js first).
 */
const PAGE_NAME = "00 Foundations";
const FRAME_NAME = "Color — Light mode";
const SWATCH_SIZE = 48;
const GAP = 16;
const COLS = 4;

const swatchGroups = [
  {
    title: "Surface",
    vars: [
      "color/background",
      "color/foreground",
      "color/card",
      "color/card/foreground",
      "color/muted",
      "color/muted/foreground",
      "color/border",
    ],
  },
  {
    title: "Actions",
    vars: [
      "color/primary",
      "color/primary/foreground",
      "color/secondary",
      "color/secondary/foreground",
      "color/accent",
      "color/accent/foreground",
      "color/destructive",
      "color/destructive/foreground",
    ],
  },
  {
    title: "Sidebar",
    vars: [
      "color/sidebar/background",
      "color/sidebar/foreground",
      "color/sidebar/border",
      "color/sidebar/accent",
    ],
  },
  {
    title: "Scene status",
    vars: [
      "color/status/idea",
      "color/status/planned",
      "color/status/draft",
      "color/status/revision",
      "color/status/ready",
    ],
  },
];

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });

const page =
  figma.root.children.find((p) => p.name === PAGE_NAME) ??
  (() => {
    const p = figma.createPage();
    p.name = PAGE_NAME;
    return p;
  })();

await figma.setCurrentPageAsync(page);

const existing = page.children.find((n) => n.name === FRAME_NAME);
if (existing) existing.remove();

const allVars = await figma.variables.getLocalVariablesAsync("COLOR");
const varByName = new Map(allVars.map((v) => [v.name, v]));

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const colorColl = collections.find((c) => c.name === "Manuscript / Color");
if (!colorColl) {
  throw new Error("Run figma-sync-color-variables.js first");
}
const lightModeId = colorColl.modes.find((m) => m.name === "Light")?.modeId ?? colorColl.modes[0].modeId;

const board = figma.createFrame();
board.name = FRAME_NAME;
board.layoutMode = "VERTICAL";
board.primaryAxisSizingMode = "AUTO";
board.counterAxisSizingMode = "AUTO";
board.itemSpacing = 32;
board.paddingLeft = board.paddingRight = board.paddingTop = board.paddingBottom = 48;
board.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
board.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.88, b: 0.86 } }];
board.strokeWeight = 1;
board.cornerRadius = 8;
page.appendChild(board);

const title = figma.createText();
title.fontName = { family: "Inter", style: "Medium" };
title.characters = "Manuscript — Color tokens (Light)";
title.fontSize = 20;
board.appendChild(title);

function bindFill(node, varName) {
  const variable = varByName.get(varName);
  if (!variable) return false;
  const paint = figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } },
    "color",
    variable
  );
  node.fills = [paint];
  return true;
}

const createdIds = [board.id, title.id];

for (const group of swatchGroups) {
  const section = figma.createFrame();
  section.name = group.title;
  section.layoutMode = "VERTICAL";
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "AUTO";
  section.itemSpacing = 12;
  section.fills = [];
  board.appendChild(section);
  createdIds.push(section.id);

  const sectionTitle = figma.createText();
  sectionTitle.fontName = { family: "Inter", style: "Medium" };
  sectionTitle.characters = group.title;
  sectionTitle.fontSize = 14;
  section.appendChild(sectionTitle);
  createdIds.push(sectionTitle.id);

  const grid = figma.createFrame();
  grid.name = `${group.title} grid`;
  grid.layoutMode = "HORIZONTAL";
  grid.layoutWrap = "WRAP";
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.itemSpacing = GAP;
  grid.counterAxisSpacing = GAP;
  grid.fills = [];
  section.appendChild(grid);
  createdIds.push(grid.id);

  for (const varName of group.vars) {
    const cell = figma.createFrame();
    cell.name = varName;
    cell.layoutMode = "VERTICAL";
    cell.primaryAxisSizingMode = "AUTO";
    cell.counterAxisSizingMode = "FIXED";
    cell.resize(SWATCH_SIZE + 120, SWATCH_SIZE + 36);
    cell.itemSpacing = 8;
    cell.fills = [];
    grid.appendChild(cell);

    const swatch = figma.createRectangle();
    swatch.name = "swatch";
    swatch.resize(SWATCH_SIZE, SWATCH_SIZE);
    swatch.cornerRadius = 6;
    const bound = bindFill(swatch, varName);
    if (!bound) swatch.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 1 } }];
    cell.appendChild(swatch);

    const label = figma.createText();
    label.fontName = { family: "Inter", style: "Regular" };
    label.characters = varName.replace("color/", "");
    label.fontSize = 11;
    cell.appendChild(label);

    createdIds.push(cell.id, swatch.id, label.id);
  }
}

board.x = 0;
board.y = 0;
board.setExplicitVariableModeForCollection(colorColl, lightModeId);

return {
  pageId: page.id,
  frameId: board.id,
  frameName: FRAME_NAME,
  createdNodeIds: createdIds,
  groups: swatchGroups.length,
};
