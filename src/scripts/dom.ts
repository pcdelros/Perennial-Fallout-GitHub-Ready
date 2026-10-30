/** Strict DOM selection, keeping missing page elements actionable during development. */
export function get<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Perennial Fallout: missing DOM element ${selector}`);
  return node;
}
export function all<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
export function safeUrl(input: unknown): string | null {
  if (typeof input !== 'string' || !input.trim()) return null;
  try { const url = new URL(input); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
