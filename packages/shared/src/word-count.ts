const WORD_RE = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;

export function countWords(plainText: string): number {
  if (!plainText) return 0;
  const matches = plainText.match(WORD_RE);
  return matches?.length ?? 0;
}

export function countCharacters(plainText: string, includeSpaces = true): number {
  if (!plainText) return 0;
  return includeSpaces ? [...plainText].length : [...plainText.replace(/\s/g, "")].length;
}
