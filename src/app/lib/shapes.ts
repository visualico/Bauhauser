export type ShapeKind =
  | "rect" | "circle" | "triangle" | "diamond" | "hexagon" | "octagon"
  | "half-circle" | "quarter-circle" | "cross" | "star" | "arrow" | "chevron"
  | "ellipse-h" | "ellipse-v" | "donut" | "crescent" | "arc" | "wave"
  | "zigzag" | "spiral" | "blob" | "leaf" | "teardrop" | "heart"
  | "parallelogram" | "trapezoid" | "rhombus" | "pentagon" | "heptagon"
  | "l-shape" | "t-shape" | "plus" | "x-shape" | "bracket" | "angle"
  | "dash" | "dot" | "stripe" | "grid-cell" | "corner" | "notch"
  | "ring" | "eye" | "moon" | "sun" | "flower" | "gear";

export type ShapeCategory = {
  id: string;
  label: string;
};

export const CATEGORIES: ShapeCategory[] = [
  { id: "geometric", label: "Geometric" },
  { id: "curved", label: "Curved" },
  { id: "angular", label: "Angular" },
  { id: "linear", label: "Linear" },
  { id: "organic", label: "Organic" },
];

export const SHAPES: ShapeKind[] = [
  "rect", "circle", "triangle", "diamond", "hexagon", "octagon",
  "half-circle", "quarter-circle", "cross", "star", "arrow", "chevron",
  "ellipse-h", "ellipse-v", "donut", "crescent", "arc", "wave",
  "zigzag", "spiral", "blob", "leaf", "teardrop", "heart",
  "parallelogram", "trapezoid", "rhombus", "pentagon", "heptagon",
  "l-shape", "t-shape", "plus", "x-shape", "bracket", "angle",
  "dash", "dot", "stripe", "grid-cell", "corner", "notch",
  "ring", "eye", "moon", "sun", "flower", "gear",
];

export const CATEGORY_OF: Record<ShapeKind, string> = {
  rect: "geometric",
  circle: "geometric",
  triangle: "geometric",
  diamond: "geometric",
  hexagon: "geometric",
  octagon: "geometric",
  "half-circle": "curved",
  "quarter-circle": "curved",
  cross: "geometric",
  star: "geometric",
  arrow: "angular",
  chevron: "angular",
  "ellipse-h": "curved",
  "ellipse-v": "curved",
  donut: "curved",
  crescent: "curved",
  arc: "curved",
  wave: "organic",
  zigzag: "angular",
  spiral: "curved",
  blob: "organic",
  leaf: "organic",
  teardrop: "organic",
  heart: "organic",
  parallelogram: "angular",
  trapezoid: "angular",
  rhombus: "angular",
  pentagon: "geometric",
  heptagon: "geometric",
  "l-shape": "angular",
  "t-shape": "angular",
  plus: "linear",
  "x-shape": "linear",
  bracket: "linear",
  angle: "linear",
  dash: "linear",
  dot: "geometric",
  stripe: "linear",
  "grid-cell": "geometric",
  corner: "angular",
  notch: "angular",
  ring: "curved",
  eye: "organic",
  moon: "curved",
  sun: "geometric",
  flower: "organic",
  gear: "geometric",
};

export function renderShape(
  kind: ShapeKind,
  fill: string,
  x: number,
  y: number,
  w: number,
  h: number,
  outline?: boolean,
  outlineWidth?: number,
): string {
  const stroke = outline ? fill : "none";
  const sw = outlineWidth ?? 2;
  const f = outline ? "none" : fill;
  const attrs = `fill="${f}" stroke="${stroke}" stroke-width="${sw}"`;
  const cx = x + w / 2;
  const cy = y + h / 2;

  switch (kind) {
    case "rect":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs}/>`;

    case "circle": {
      const r = Math.min(w, h) / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`;
    }

    case "triangle": {
      const pts = `${cx},${y} ${x + w},${y + h} ${x},${y + h}`;
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "diamond": {
      const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "hexagon": {
      const r = Math.min(w, h) / 2;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "octagon": {
      const r = Math.min(w, h) / 2;
      const pts = Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 4) * i - Math.PI / 8;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "half-circle":
      return `<path d="M${x},${cy} A${w / 2},${h / 2} 0 0 1 ${x + w},${cy} Z" ${attrs}/>`;

    case "quarter-circle":
      return `<path d="M${x},${y + h} A${w},${h} 0 0 1 ${x + w},${y} L${x + w},${y + h} Z" ${attrs}/>`;

    case "cross": {
      const tw = w / 3;
      const th = h / 3;
      return `<path d="M${x + tw},${y} h${tw} v${th} h${tw} v${th} h-${tw} v${th} h-${tw} v-${th} h-${tw} v-${th} h${tw} Z" ${attrs}/>`;
    }

    case "star": {
      const r1 = Math.min(w, h) / 2;
      const r2 = r1 * 0.4;
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "arrow": {
      const aw = w * 0.4;
      const ah = h * 0.35;
      return `<path d="M${x},${cy - h * 0.15} h${w - aw} v-${ah} L${x + w},${cy} L${x + w - aw},${cy + ah + h * 0.15} v-${ah} H${x} Z" ${attrs}/>`;
    }

    case "chevron": {
      const d = w * 0.25;
      return `<path d="M${x},${y} L${x + w - d},${cy} L${x},${y + h} L${x + d},${y + h} L${x + w},${cy} L${x + d},${y} Z" ${attrs}/>`;
    }

    case "ellipse-h":
      return `<ellipse cx="${cx}" cy="${cy}" rx="${w * 0.48}" ry="${h * 0.3}" ${attrs}/>`;

    case "ellipse-v":
      return `<ellipse cx="${cx}" cy="${cy}" rx="${w * 0.3}" ry="${h * 0.48}" ${attrs}/>`;

    case "donut": {
      const r1 = Math.min(w, h) / 2;
      const r2 = r1 * 0.55;
      return `<path fill-rule="evenodd" d="M${cx + r1},${cy} A${r1},${r1} 0 1 0 ${cx - r1},${cy} A${r1},${r1} 0 1 0 ${cx + r1},${cy} M${cx + r2},${cy} A${r2},${r2} 0 1 1 ${cx - r2},${cy} A${r2},${r2} 0 1 1 ${cx + r2},${cy}" fill="${f}" stroke="${stroke}" stroke-width="${sw}"/>`;
    }

    case "crescent":
      return `<path d="M${cx},${y} A${w / 2},${h / 2} 0 1 0 ${cx},${y + h} A${w * 0.35},${h * 0.45} 0 1 1 ${cx},${y}" ${attrs}/>`;

    case "arc":
      return `<path d="M${x + w * 0.1},${y + h * 0.85} A${w * 0.4},${h * 0.6} 0 0 1 ${x + w * 0.9},${y + h * 0.85}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 4)}" stroke-linecap="round"/>`;

    case "wave": {
      const wy = cy;
      const amp = h * 0.25;
      const seg = w / 4;
      return `<path d="M${x},${wy} C${x + seg * 0.5},${wy - amp} ${x + seg * 1.5},${wy - amp} ${x + seg * 2},${wy} C${x + seg * 2.5},${wy + amp} ${x + seg * 3.5},${wy + amp} ${x + seg * 4},${wy}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 3)}" stroke-linecap="round"/>`;
    }

    case "zigzag": {
      const segs = 4;
      const sw2 = w / segs;
      const pts = Array.from({ length: segs + 1 }, (_, i) => {
        const px = x + sw2 * i;
        const py = i % 2 === 0 ? y + h * 0.8 : y + h * 0.2;
        return `${px},${py}`;
      }).join(" ");
      return `<polyline points="${pts}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 3)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    case "spiral": {
      const turns = 2.5;
      const step = 5;
      let d = `M${cx},${cy}`;
      for (let i = 1; i < turns * 360; i += step) {
        const a = (i * Math.PI) / 180;
        const r = (Math.min(w, h) / 2) * (i / (turns * 360));
        d += ` L${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }
      return `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 2)}" stroke-linecap="round"/>`;
    }

    case "blob": {
      const bw = w * 0.45;
      const bh = h * 0.45;
      return `<path d="M${cx + bw},${cy} C${cx + bw},${cy - bh * 1.2} ${cx - bw * 1.2},${cy - bh} ${cx - bw},${cy} C${cx - bw * 1.2},${cy + bh} ${cx + bw * 1.1},${cy + bh * 1.1} ${cx + bw},${cy} Z" ${attrs}/>`;
    }

    case "leaf":
      return `<path d="M${cx},${y} Q${x + w},${cy} ${cx},${y + h} Q${x},${cy} ${cx},${y} Z" ${attrs}/>`;

    case "teardrop":
      return `<path d="M${cx},${y + h} C${x},${cy} ${x + w * 0.3},${y} ${cx},${y} C${x + w * 0.7},${y} ${x + w},${cy} ${cx},${y + h} Z" ${attrs}/>`;

    case "heart": {
      const hx = cx;
      const hy = y + h * 0.3;
      const qx = w * 0.25;
      return `<path d="M${hx},${y + h * 0.95} C${x},${hy + h * 0.1} ${x},${y} ${hx - qx},${y} Q${x},${y} ${x},${hy} C${x},${hy - h * 0.15} ${hx - qx},${y} ${hx},${hy} C${hx + qx},${y} ${x + w},${hy - h * 0.15} ${x + w},${hy} Q${x + w},${y} ${hx + qx},${y} C${x + w},${y} ${x + w},${hy + h * 0.1} ${hx},${y + h * 0.95} Z" ${attrs}/>`;
    }

    case "parallelogram": {
      const offset = w * 0.2;
      return `<polygon points="${x + offset},${y} ${x + w},${y} ${x + w - offset},${y + h} ${x},${y + h}" ${attrs}/>`;
    }

    case "trapezoid": {
      const inset = w * 0.15;
      return `<polygon points="${x + inset},${y} ${x + w - inset},${y} ${x + w},${y + h} ${x},${y + h}" ${attrs}/>`;
    }

    case "rhombus": {
      const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "pentagon": {
      const r = Math.min(w, h) / 2;
      const pts = Array.from({ length: 5 }, (_, i) => {
        const a = (2 * Math.PI * i) / 5 - Math.PI / 2;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "heptagon": {
      const r = Math.min(w, h) / 2;
      const pts = Array.from({ length: 7 }, (_, i) => {
        const a = (2 * Math.PI * i) / 7 - Math.PI / 2;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "l-shape": {
      const lw = w * 0.4;
      const lh = h * 0.4;
      return `<path d="M${x},${y} h${lw} v${h - lh} h${w - lw} v${lh} h-${w} Z" ${attrs}/>`;
    }

    case "t-shape": {
      const tw = w * 0.35;
      const th = h * 0.35;
      return `<path d="M${x},${y} h${w} v${th} h-${(w - tw) / 2} v${h - th} h-${tw} v-${h - th} h-${(w - tw) / 2} Z" ${attrs}/>`;
    }

    case "plus": {
      const pw = w / 3;
      const ph = h / 3;
      return `<path d="M${x + pw},${y} h${pw} v${ph} h${pw} v${ph} h-${pw} v${ph} h-${pw} v-${ph} h-${pw} v-${ph} h${pw} Z" ${attrs}/>`;
    }

    case "x-shape": {
      const t = Math.min(w, h) * 0.15;
      return `<path d="M${x},${y + t} L${cx - t},${cy} L${x},${y + h - t} L${x + t},${y + h} L${cx},${cy + t} L${x + w - t},${y + h} L${x + w},${y + h - t} L${cx + t},${cy} L${x + w},${y + t} L${x + w - t},${y} L${cx},${cy - t} L${x + t},${y} Z" ${attrs}/>`;
    }

    case "bracket":
      return `<path d="M${cx + w * 0.2},${y + h * 0.05} L${x + w * 0.2},${y + h * 0.05} L${x + w * 0.2},${y + h * 0.95} L${cx + w * 0.2},${y + h * 0.95}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 4)}" stroke-linecap="round" stroke-linejoin="round"/>`;

    case "angle":
      return `<path d="M${x + w * 0.1},${y + h * 0.1} L${x + w * 0.1},${y + h * 0.9} L${x + w * 0.9},${y + h * 0.9}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 4)}" stroke-linecap="round" stroke-linejoin="round"/>`;

    case "dash":
      return `<line x1="${x + w * 0.1}" y1="${cy}" x2="${x + w * 0.9}" y2="${cy}" stroke="${fill}" stroke-width="${Math.max(sw, h * 0.2)}" stroke-linecap="round"/>`;

    case "dot": {
      const r = Math.min(w, h) * 0.15;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
    }

    case "stripe":
      return `<rect x="${x}" y="${y + h * 0.4}" width="${w}" height="${h * 0.2}" fill="${fill}"/>`;

    case "grid-cell":
      return `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 1)}"/>`;

    case "corner": {
      const cl = Math.min(w, h) * 0.5;
      return `<path d="M${x + cl},${y} L${x},${y} L${x},${y + cl}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw, 4)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    case "notch": {
      const nd = Math.min(w, h) * 0.3;
      return `<path d="M${x},${y} h${w} v${h} h-${w} v-${(h - nd) / 2} h${nd} v-${nd} h-${nd} Z" ${attrs}/>`;
    }

    case "ring": {
      const r1 = Math.min(w, h) / 2;
      const r2 = r1 * 0.7;
      return `<path fill-rule="evenodd" d="M${cx},${cy - r1} A${r1},${r1} 0 1 0 ${cx},${cy + r1} A${r1},${r1} 0 1 0 ${cx},${cy - r1} M${cx},${cy - r2} A${r2},${r2} 0 1 1 ${cx},${cy + r2} A${r2},${r2} 0 1 1 ${cx},${cy - r2}" fill="${f}" stroke="${stroke}" stroke-width="${sw}"/>`;
    }

    case "eye":
      return `<path d="M${x},${cy} Q${cx},${y} ${x + w},${cy} Q${cx},${y + h} ${x},${cy} Z" ${attrs}/>`;

    case "moon": {
      const mr = Math.min(w, h) / 2;
      return `<path d="M${cx},${y} A${mr},${mr} 0 1 0 ${cx},${y + h} A${mr * 0.65},${mr * 0.75} 0 1 1 ${cx},${y} Z" ${attrs}/>`;
    }

    case "sun": {
      const sr = Math.min(w, h) * 0.28;
      const rays = Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 4) * i;
        const r1 = Math.min(w, h) * 0.42;
        const r2 = Math.min(w, h) * 0.48;
        const ra = a + Math.PI / 8;
        return `L${cx + r1 * Math.cos(a)},${cy + r1 * Math.sin(a)} L${cx + r2 * Math.cos(ra)},${cy + r2 * Math.sin(ra)}`;
      }).join(" ");
      return `<circle cx="${cx}" cy="${cy}" r="${sr}" fill="${f}"/>
              <path d="M${cx + Math.min(w, h) * 0.42},${cy} ${rays}" ${attrs} fill="${f}"/>`;
    }

    case "flower": {
      const pr = Math.min(w, h) * 0.22;
      const pd = Math.min(w, h) * 0.28;
      const petals = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i;
        const px = cx + pd * Math.cos(a);
        const py = cy + pd * Math.sin(a);
        return `<ellipse cx="${px}" cy="${py}" rx="${pr}" ry="${pr * 0.5}" transform="rotate(${(a * 180) / Math.PI} ${px} ${py})" fill="${f}" stroke="${stroke}" stroke-width="${sw}"/>`;
      }).join("");
      return `${petals}<circle cx="${cx}" cy="${cy}" r="${pr * 0.7}" fill="${f}" stroke="${stroke}" stroke-width="${sw}"/>`;
    }

    case "gear": {
      const gr = Math.min(w, h) * 0.35;
      const ir = gr * 0.55;
      const teeth = 8;
      const pts = Array.from({ length: teeth * 4 }, (_, i) => {
        const frac = i / (teeth * 4);
        const a = frac * 2 * Math.PI;
        const toothOn = Math.floor(i / 2) % 2 === 0;
        const r = toothOn ? gr : gr * 0.75;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
      return `<polygon points="${pts}" ${attrs}/><circle cx="${cx}" cy="${cy}" r="${ir}" fill="${outline ? "none" : f === "none" ? "none" : f}" stroke="${fill}" stroke-width="${sw}"/>`;
    }

    default:
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  }
}

export function applyOutline(svgStr: string, _fill: string): string {
  return svgStr.replace(/fill="[^"]*"/g, 'fill="none"');
}
