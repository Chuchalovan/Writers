import { describe, expect, it } from "vitest";
import { countCharacters, countWords } from "./word-count";

describe("countWords", () => {
  it("returns 0 for empty or whitespace", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n\t")).toBe(0);
  });

  it("counts English words", () => {
    expect(countWords("hello world")).toBe(2);
  });

  it("counts Russian words", () => {
    expect(countWords("Привет мир")).toBe(2);
  });

  it("counts mixed locale text", () => {
    expect(countWords("Scene один 12")).toBe(3);
  });

  it("treats hyphenated and apostrophe tokens as one word", () => {
    expect(countWords("don't well-known")).toBe(2);
  });

  it("ignores punctuation-only tokens", () => {
    expect(countWords("Wait — what?")).toBe(2);
  });
});

describe("countCharacters", () => {
  it("counts with spaces by default", () => {
    expect(countCharacters("ab cd")).toBe(5);
  });

  it("can exclude spaces", () => {
    expect(countCharacters("ab cd", false)).toBe(4);
  });
});
