import type { Composition } from "./generator";

const KEY = "bauhauser:gallery";

export function loadGallery(): Composition[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: Composition[] = JSON.parse(raw);
    return parsed.filter((c) => c && c.id && c.params);
  } catch {
    return [];
  }
}

export function saveGallery(items: Composition[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, 200)));
  } catch {}
}
