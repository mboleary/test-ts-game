/**
 * Checks that A has the same keys as B
 * @param a Array A
 * @param b Array B
 * @returns boolean
 */
export function sameKeys<T>(a: T[], b: T[]) {
  const keys = new Set<T>();

  for (const item of a) {
    keys.add(item);
  }

  for (const item of b) {
    if (!keys.has(item)) return false;
    keys.delete(item);
  }

  return keys.size === 0;
}

/**
 * Check if B has a subset of the keys of A
 * @param a Array A
 * @param b Array B
 * @returns boolean
 */
export function hasKeys<T>(a: T[], b: T[]) {
  const keys = new Set<T>();

  for (const item of a) {
    keys.add(item);
  }

  for (const item of b) {
    if (!keys.has(item)) return false;
  }

  return true;
}
