export function wouldCreateCycle(
  nodeId: string,
  newParentId: string | null,
  parentById: Map<string, string | null>
): boolean {
  if (newParentId === null) return false;
  if (newParentId === nodeId) return true;
  let current: string | null = newParentId;
  const seen = new Set<string>();
  while (current) {
    if (current === nodeId) return true;
    if (seen.has(current)) return true;
    seen.add(current);
    current = parentById.get(current) ?? null;
  }
  return false;
}

export function collectSubtreeIds(
  rootId: string,
  childrenByParent: Map<string | null, string[]>
): string[] {
  const result: string[] = [];
  const stack = [rootId];
  while (stack.length > 0) {
    const id = stack.pop()!;
    result.push(id);
    const children = childrenByParent.get(id) ?? [];
    for (const child of children) stack.push(child);
  }
  return result;
}
