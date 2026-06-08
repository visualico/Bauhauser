export type ImportedSvg = {
  id: string;
  name: string;
  viewBox: string;
  body: string;
  enabled: boolean;
  weight: number;
};

const ALLOWED = new Set([
  "g", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon",
]);

function sanitize(node: Element): string {
  if (!ALLOWED.has(node.tagName.toLowerCase())) {
    let inner = "";
    node.childNodes.forEach((c) => {
      if (c.nodeType === 1) inner += sanitize(c as Element);
    });
    return inner;
  }
  const tag = node.tagName.toLowerCase();
  const attrs: string[] = [];
  for (const a of Array.from(node.attributes)) {
    const n = a.name.toLowerCase();
    if (n.startsWith("on")) continue;
    if (n === "style") continue;
    attrs.push(`${n}="${a.value.replace(/"/g, "&quot;")}"`);
  }
  let inner = "";
  node.childNodes.forEach((c) => {
    if (c.nodeType === 1) inner += sanitize(c as Element);
  });
  return `<${tag} ${attrs.join(" ")}>${inner}</${tag}>`;
}

export async function parseSvgFile(file: File): Promise<ImportedSvg | null> {
  const text = await file.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = doc.querySelector("svg");
  if (!root) return null;
  let viewBox = root.getAttribute("viewBox");
  if (!viewBox) {
    const w = root.getAttribute("width") || "100";
    const h = root.getAttribute("height") || "100";
    viewBox = `0 0 ${parseFloat(w)} ${parseFloat(h)}`;
  }
  let body = "";
  root.childNodes.forEach((c) => {
    if (c.nodeType === 1) body += sanitize(c as Element);
  });
  if (!body) return null;
  return {
    id: crypto.randomUUID(),
    name: file.name.replace(/\.svg$/i, ""),
    viewBox,
    body,
    enabled: true,
    weight: 0.5,
  };
}
