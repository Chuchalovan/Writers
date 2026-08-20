import { describe, expect, it } from "vitest";
import { collectSubtreeIds, wouldCreateCycle } from "./tree";

describe("wouldCreateCycle", () => {
  const parentById = new Map<string, string | null>([
    ["part", null],
    ["chapter", "part"],
    ["scene", "chapter"],
  ]);

  it("allows moving a scene under another part", () => {
    expect(wouldCreateCycle("scene", "part", parentById)).toBe(false);
  });

  it("rejects moving a part under its descendant scene", () => {
    expect(wouldCreateCycle("part", "scene", parentById)).toBe(true);
  });

  it("rejects moving a node under itself", () => {
    expect(wouldCreateCycle("chapter", "chapter", parentById)).toBe(true);
  });

  it("allows becoming a root", () => {
    expect(wouldCreateCycle("chapter", null, parentById)).toBe(false);
  });
});

describe("collectSubtreeIds", () => {
  it("includes the root and descendants", () => {
    const children = new Map<string | null, string[]>([
      [null, ["part"]],
      ["part", ["chapter"]],
      ["chapter", ["scene-a", "scene-b"]],
    ]);
    expect(collectSubtreeIds("part", children).sort()).toEqual(
      ["chapter", "part", "scene-a", "scene-b"].sort()
    );
  });
});
