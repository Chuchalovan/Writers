/**
 * Figma Plugin API script — sync Manuscript color variables from globals.css.
 * Run via Figma MCP use_figma on fileKey 7vP03INYMrwQ3Q6qT7A2NT.
 * Idempotent: safe to re-run.
 */
const COLLECTION_NAME = "Manuscript / Color";
const MODE_LIGHT = "Light";
const MODE_DARK = "Dark";

const light = {
  background: { r: 0.984313725490196, g: 0.9803921568627451, b: 0.9764705882352941 },
  foreground: { r: 0.15294117647058825, g: 0.13725490196078433, b: 0.12549019607843137 },
  card: { r: 1, g: 1, b: 1 },
  "card-foreground": { r: 0.15294117647058825, g: 0.13725490196078433, b: 0.12549019607843137 },
  popover: { r: 1, g: 1, b: 1 },
  "popover-foreground": { r: 0.15294117647058825, g: 0.13725490196078433, b: 0.12549019607843137 },
  primary: { r: 0.15294117647058825, g: 0.13725490196078433, b: 0.12549019607843137 },
  "primary-foreground": { r: 0.984313725490196, g: 0.9803921568627451, b: 0.9764705882352941 },
  secondary: { r: 0.9490196078431372, g: 0.9411764705882353, b: 0.9294117647058824 },
  "secondary-foreground": { r: 0.2196078431372549, g: 0.19607843137254902, b: 0.1803921568627451 },
  muted: { r: 0.9333333333333333, g: 0.9215686274509803, b: 0.9098039215686274 },
  "muted-foreground": { r: 0.48627450980392156, g: 0.4549019607843137, b: 0.43137254901960786 },
  accent: { r: 0.48627450980392156, g: 0.3568627450980392, b: 0.27450980392156865 },
  "accent-foreground": { r: 0.984313725490196, g: 0.9803921568627451, b: 0.9764705882352941 },
  destructive: { r: 0.8627450980392157, g: 0.1568627450980392, b: 0.1568627450980392 },
  "destructive-foreground": { r: 0.9803921568627451, g: 0.9803921568627451, b: 0.9803921568627451 },
  border: { r: 0.8980392156862745, g: 0.8862745098039215, b: 0.8627450980392157 },
  input: { r: 0.8980392156862745, g: 0.8862745098039215, b: 0.8627450980392157 },
  ring: { r: 0.48627450980392156, g: 0.3568627450980392, b: 0.27450980392156865 },
  "sidebar-background": { r: 0.9686274509803922, g: 0.9607843137254902, b: 0.9529411764705882 },
  "sidebar-foreground": { r: 0.15294117647058825, g: 0.13725490196078433, b: 0.12549019607843137 },
  "sidebar-border": { r: 0.8980392156862745, g: 0.8862745098039215, b: 0.8627450980392157 },
  "sidebar-accent": { r: 0.9333333333333333, g: 0.9254901960784314, b: 0.9058823529411765 },
  "status-idea": { r: 0.48627450980392156, g: 0.4549019607843137, b: 0.43137254901960786 },
  "status-planned": { r: 0.7215686274509804, g: 0.5843137254901961, b: 0.4980392156862745 },
  "status-draft": { r: 0.48627450980392156, g: 0.3568627450980392, b: 0.27450980392156865 },
  "status-revision": { r: 0.8509803921568627, g: 0.4666666666666667, b: 0.023529411764705882 },
  "status-ready": { r: 0.08627450980392157, g: 0.6392156862745098, b: 0.2901960784313726 },
};

const dark = {
  background: { r: 0.10980392156862745, g: 0.09803921568627451, b: 0.09019607843137255 },
  foreground: { r: 0.9529411764705882, g: 0.9450980392156862, b: 0.9294117647058824 },
  card: { r: 0.13333333333333333, g: 0.11764705882352941, b: 0.10980392156862745 },
  "card-foreground": { r: 0.9529411764705882, g: 0.9450980392156862, b: 0.9294117647058824 },
  popover: { r: 0.13333333333333333, g: 0.11764705882352941, b: 0.10980392156862745 },
  "popover-foreground": { r: 0.9529411764705882, g: 0.9450980392156862, b: 0.9294117647058824 },
  primary: { r: 0.9529411764705882, g: 0.9450980392156862, b: 0.9294117647058824 },
  "primary-foreground": { r: 0.10980392156862745, g: 0.09803921568627451, b: 0.09019607843137255 },
  secondary: { r: 0.17254901960784313, g: 0.1568627450980392, b: 0.14901960784313725 },
  "secondary-foreground": { r: 0.8705882352941177, g: 0.8549019607843137, b: 0.8274509803921568 },
  muted: { r: 0.17254901960784313, g: 0.1568627450980392, b: 0.14901960784313725 },
  "muted-foreground": { r: 0.611764705882353, g: 0.5882352941176471, b: 0.5450980392156862 },
  accent: { r: 0.6274509803921569, g: 0.4980392156862745, b: 0.41568627450980394 },
  "accent-foreground": { r: 0.10980392156862745, g: 0.09803921568627451, b: 0.09019607843137255 },
  destructive: { r: 0.48627450980392156, g: 0.11372549019607843, b: 0.11372549019607843 },
  "destructive-foreground": { r: 0.9803921568627451, g: 0.9803921568627451, b: 0.9803921568627451 },
  border: { r: 0.19607843137254902, g: 0.17647058823529413, b: 0.16470588235294117 },
  input: { r: 0.19607843137254902, g: 0.17647058823529413, b: 0.16470588235294117 },
  ring: { r: 0.6274509803921569, g: 0.4980392156862745, b: 0.41568627450980394 },
  "sidebar-background": { r: 0.08627450980392157, g: 0.0784313725490196, b: 0.07058823529411765 },
  "sidebar-foreground": { r: 0.9529411764705882, g: 0.9450980392156862, b: 0.9294117647058824 },
  "sidebar-border": { r: 0.19607843137254902, g: 0.17647058823529413, b: 0.16470588235294117 },
  "sidebar-accent": { r: 0.15294117647058825, g: 0.13725490196078433, b: 0.12941176470588237 },
  "status-idea": { r: 0.611764705882353, g: 0.5882352941176471, b: 0.5450980392156862 },
  "status-planned": { r: 0.7686274509803922, g: 0.6627450980392157, b: 0.5843137254901961 },
  "status-draft": { r: 0.6274509803921569, g: 0.4980392156862745, b: 0.41568627450980394 },
  "status-revision": { r: 0.9607843137254902, g: 0.6196078431372549, b: 0.043137254901960784 },
  "status-ready": { r: 0.13333333333333333, g: 0.7725490196078432, b: 0.3686274509803922 },
};

const SCOPES = {
  fill: ["FRAME_FILL", "SHAPE_FILL"],
  text: ["TEXT_FILL"],
  stroke: ["STROKE_COLOR"],
};

function toFigmaName(token) {
  if (token.startsWith("status-")) {
    return `color/status/${token.replace("status-", "")}`;
  }
  if (token.startsWith("sidebar-")) {
    return `color/sidebar/${token.replace("sidebar-", "")}`;
  }
  if (token.includes("-foreground")) {
    const base = token.replace("-foreground", "");
    return `color/${base}/foreground`;
  }
  return `color/${token}`;
}

function scopeFor(token) {
  if (token.includes("foreground") || token.startsWith("status-")) return SCOPES.text;
  if (token === "border" || token === "input" || token === "ring" || token === "sidebar-border") {
    return SCOPES.stroke;
  }
  return SCOPES.fill;
}

function colorPaint(rgb) {
  return { type: "SOLID", color: rgb };
}

async function getOrCreateCollection(name) {
  const existing = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === name);
  if (existing) return existing;
  return figma.variables.createVariableCollection(name);
}

async function getOrCreateVariable(collection, varName) {
  const all = await figma.variables.getLocalVariablesAsync("COLOR");
  const found = all.find((v) => v.name === varName && v.variableCollectionId === collection.id);
  if (found) return found;
  return figma.variables.createVariable(varName, collection, "COLOR");
}

const collection = await getOrCreateCollection(COLLECTION_NAME);
const modes = collection.modes;
let lightModeId = modes.find((m) => m.name === MODE_LIGHT)?.modeId;
let darkModeId = modes.find((m) => m.name === MODE_DARK)?.modeId;

if (!lightModeId) {
  collection.renameMode(modes[0].modeId, MODE_LIGHT);
  lightModeId = modes[0].modeId;
}
if (!darkModeId) {
  darkModeId = collection.addMode(MODE_DARK);
}

const created = [];
for (const token of Object.keys(light)) {
  const varName = toFigmaName(token);
  const variable = await getOrCreateVariable(collection, varName);
  variable.scopes = scopeFor(token);
  variable.setValueForMode(lightModeId, colorPaint(light[token]));
  variable.setValueForMode(darkModeId, colorPaint(dark[token] ?? light[token]));
  variable.setVariableCodeSyntax("WEB", `var(--${token})`);
  created.push({ name: varName, id: variable.id });
}

return {
  collectionId: collection.id,
  collectionName: COLLECTION_NAME,
  modes: [MODE_LIGHT, MODE_DARK],
  variableCount: created.length,
  variables: created,
};
