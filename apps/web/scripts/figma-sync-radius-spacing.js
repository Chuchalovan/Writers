/**
 * Figma Plugin API — sync radius + spacing variables.
 * ARCHIVED — targets old file 7vP03INYMrwQ3Q6qT7A2NT.
 * Do not run on Ink Studio (DY4LOZnkponU6E1rmb34Fs).
 * Run via use_figma on fileKey 7vP03INYMrwQ3Q6qT7A2NT.
 */
const RADIUS_COLLECTION = "Manuscript / Radius";
const SPACING_COLLECTION = "Manuscript / Spacing";

const radiusTokens = [
  { name: "radius/base", value: 6, css: "var(--radius)" },
  { name: "radius/md", value: 4, css: "calc(var(--radius) - 2px)" },
  { name: "radius/sm", value: 2, css: "calc(var(--radius) - 4px)" },
];

const spacingTokens = [
  { name: "spacing/xs", value: 4 },
  { name: "spacing/sm", value: 8 },
  { name: "spacing/md", value: 16 },
  { name: "spacing/lg", value: 24 },
  { name: "spacing/xl", value: 32 },
];

async function getOrCreateCollection(name) {
  const existing = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === name);
  if (existing) return existing;
  return figma.variables.createVariableCollection(name);
}

async function getOrCreateFloatVariable(collection, varName) {
  const all = await figma.variables.getLocalVariablesAsync("FLOAT");
  const found = all.find((v) => v.name === varName && v.variableCollectionId === collection.id);
  if (found) return found;
  return figma.variables.createVariable(varName, collection, "FLOAT");
}

const radiusColl = await getOrCreateCollection(RADIUS_COLLECTION);
const spacingColl = await getOrCreateCollection(SPACING_COLLECTION);
const radiusMode = radiusColl.modes[0].modeId;
const spacingMode = spacingColl.modes[0].modeId;

const created = [];

for (const token of radiusTokens) {
  const variable = await getOrCreateFloatVariable(radiusColl, token.name);
  variable.scopes = ["CORNER_RADIUS"];
  variable.setValueForMode(radiusMode, token.value);
  if (token.css) variable.setVariableCodeSyntax("WEB", token.css);
  created.push({ collection: RADIUS_COLLECTION, name: token.name, id: variable.id });
}

for (const token of spacingTokens) {
  const variable = await getOrCreateFloatVariable(spacingColl, token.name);
  variable.scopes = ["GAP", "WIDTH_HEIGHT"];
  variable.setValueForMode(spacingMode, token.value);
  created.push({ collection: SPACING_COLLECTION, name: token.name, id: variable.id });
}

return { variableCount: created.length, variables: created };
