import type { GenParams } from "./generator";

const VERSION = 1;

function toBase64(s: string): string {
  return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  ));
}

function fromBase64(s: string): string {
  return decodeURIComponent(
    Array.from(atob(s))
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function encodeParams(params: GenParams): string {
  const { imports: _imports, customPalette, ...rest } = params;
  const payload = { v: VERSION, p: { ...rest, customPalette } };
  return toBase64(JSON.stringify(payload));
}

export function decodeParams(hash: string): Partial<GenParams> | null {
  try {
    const s = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!s) return null;
    const obj = JSON.parse(fromBase64(s));
    if (!obj || obj.v !== VERSION || !obj.p) return null;
    return obj.p as Partial<GenParams>;
  } catch {
    return null;
  }
}

export function readHashParams(): Partial<GenParams> | null {
  if (typeof window === "undefined") return null;
  return decodeParams(window.location.hash);
}

export function writeHashParams(params: GenParams): void {
  if (typeof window === "undefined") return;
  const encoded = encodeParams(params);
  history.replaceState(null, "", `#${encoded}`);
}

export function shareUrl(params: GenParams): string {
  return `${window.location.origin}${window.location.pathname}#${encodeParams(params)}`;
}
