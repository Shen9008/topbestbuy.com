/** Locale-aware MYR copy (en-MY). */
export function formatRM(n: number): string {
  return `RM ${Number(n).toLocaleString('en-MY')}`;
}

export function productFullName(p: { brand: string; name: string }): string {
  return `${p.brand} ${p.name}`;
}