import type { ImportedSvg } from "./svgImport";
import { FORMATS, FormatId, getPalette, type Palette } from "./palettes";
import { CATEGORY_OF, renderShape, type ShapeKind } from "./shapes";

export type { FormatId, ShapeKind };
export { FORMATS };

export type Shape = {
  kind: ShapeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  rot: 0 | 1 | 2 | 3;
  customId?: string;
  outline?: boolean;
  outlineWidth?: number;
};

export type Composition = {
  id: string;
  width: number;
  height: number;
  bg: string;
  shapes: Shape[];
  seed: number;
  name?: string;
  author?: string;
  savedAt?: number;
  svgBody?: string;
  params: GenParams;
};

export type GenParams = {
  seed: number;
  format: FormatId;
  paletteId: string;
  density: number;
  cols: number;
  rows: number;
  gutter: number;
  padding: number;
  jitter: number;
  mergeChance: number;
  rotationChance: number;
  colorSpread: number;
  enabledShapes: ShapeKind[];
  imports: ImportedSvg[];
  customPalette: Palette | null;
  invertColors?: boolean;
  bgOverride?: string | null;
  minShapeCells: number;
  maxShapeCells: number;
  layerSeed?: number;
  shapeOutlines?: Record<string, boolean>;
  shapeOutlineWidth?: Record<string, number>;
};

export const DEFAULT_PARAMS: GenParams = {
  seed: 42,
  format: "square-1x1",
  paletteId: "bauhaus-classic",
  density: 0.7,
  cols: 8,
  rows: 8,
  gutter: 4,
  padding: 20,
  jitter: 0.1,
  mergeChance: 0.4,
  rotationChance: 0.25,
  colorSpread: 4,
  enabledShapes: ["rect", "circle", "triangle", "diamond"],
  imports: [],
  customPalette: null,
  invertColors: false,
  bgOverride: null,
  minShapeCells: 1,
  maxShapeCells: 3,
};

const MAX_SHAPE_CELLS = 8;
const BIG_SHAPE_BASE = 4;
const BIG_SHAPE_SCALE = 16;
const FILL_THRESHOLD_BASE = 0.35;
const FILL_THRESHOLD_SCALE = 0.55;

function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length)];

export function generate(params: GenParams): Composition {
  const {
    seed, format, paletteId, density, cols, rows, gutter, padding, jitter, mergeChance,
    rotationChance, colorSpread, enabledShapes, imports,
  } = params;

  const fmt = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
  const pal =
    paletteId === "custom" && params.customPalette
      ? params.customPalette
      : getPalette(paletteId);
  const r = rng(seed);

  const innerW = fmt.width - padding * 2;
  const innerH = fmt.height - padding * 2;
  const cellW = (innerW - gutter * (cols - 1)) / cols;
  const cellH = (innerH - gutter * (rows - 1)) / rows;

  const enabledImports = (imports ?? []).filter((i) => i.enabled);
  const pool: { kind: ShapeKind; customId?: string }[] = enabledShapes
    .filter((s) => s !== ("custom" as ShapeKind))
    .map((kind) => ({ kind }));
  for (const im of enabledImports) {
    const n = Math.max(1, Math.round(im.weight * 4));
    for (let i = 0; i < n; i++) pool.push({ kind: "rect", customId: im.id });
  }
  if (pool.length === 0) pool.push({ kind: "rect" });

  const spread = Math.max(1, Math.min(colorSpread, pal.colors.length));
  const activeColors = pal.colors.slice(0, spread);

  // Shuffled color bag: each color appears ceil(bagSize/spread) times.
  // Guarantees every color is visible before any color repeats twice.
  const bagReps = Math.max(3, Math.ceil(40 / spread));
  const colorBag: string[] = [];
  for (let i = 0; i < bagReps; i++)
    for (const c of activeColors) colorBag.push(c);
  for (let i = colorBag.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [colorBag[i], colorBag[j]] = [colorBag[j], colorBag[i]];
  }
  let bagIdx = 0;
  const nextColor = () => colorBag[bagIdx++ % colorBag.length];

  const rotOf = (): 0 | 1 | 2 | 3 =>
    (r() < rotationChance ? Math.floor(r() * 4) : 0) as 0 | 1 | 2 | 3;

  const occupied: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const shapes: Shape[] = [];

  const cellX = (i: number) => padding + i * (cellW + gutter);
  const cellY = (j: number) => padding + j * (cellH + gutter);

  const lo = Math.max(1, Math.min(MAX_SHAPE_CELLS, params.minShapeCells ?? 1));
  const hi = Math.max(lo, Math.min(MAX_SHAPE_CELLS, params.maxShapeCells ?? 3));
  const span = hi - lo + 1;
  const bigCount = Math.floor(BIG_SHAPE_BASE + density * BIG_SHAPE_SCALE);
  for (let i = 0; i < bigCount; i++) {
    if (r() > mergeChance) continue;
    const bw = Math.min(cols, lo + Math.floor(r() * span));
    const bh = Math.min(rows, lo + Math.floor(r() * span));
    if (lo === 1 && bw === 1 && bh === 1) continue;
    const bx = Math.floor(r() * Math.max(1, cols - bw + 1));
    const by = Math.floor(r() * Math.max(1, rows - bh + 1));
    let free = true;
    for (let y = by; y < by + bh && free; y++)
      for (let x = bx; x < bx + bw && free; x++) if (occupied[y]?.[x]) free = false;
    if (!free) continue;
    for (let y = by; y < by + bh; y++) for (let x = bx; x < bx + bw; x++) occupied[y][x] = true;
    const choice = pick(r, pool);
    const w = bw * cellW + (bw - 1) * gutter;
    const h = bh * cellH + (bh - 1) * gutter;
    const catId = CATEGORY_OF[choice.kind];
    shapes.push({
      kind: choice.kind,
      customId: choice.customId,
      x: cellX(bx),
      y: cellY(by),
      w,
      h,
      fill: nextColor(),
      rot: rotOf(),
      outline: params.shapeOutlines?.[catId] ?? false,
      outlineWidth: params.shapeOutlineWidth?.[catId] ?? 2,
    });
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (occupied[y][x]) continue;
      if (r() > FILL_THRESHOLD_BASE + density * FILL_THRESHOLD_SCALE) continue;
      const choice = pick(r, pool);
      const jx = (r() - 0.5) * jitter * cellW;
      const jy = (r() - 0.5) * jitter * cellH;
      const catId = CATEGORY_OF[choice.kind];
      shapes.push({
        kind: choice.kind,
        customId: choice.customId,
        x: cellX(x) + jx,
        y: cellY(y) + jy,
        w: cellW,
        h: cellH,
        fill: nextColor(),
        rot: rotOf(),
        outline: params.shapeOutlines?.[catId] ?? false,
        outlineWidth: params.shapeOutlineWidth?.[catId] ?? 2,
      });
      occupied[y][x] = true;
    }
  }

  if (params.layerSeed) {
    const lr = rng(params.layerSeed);
    for (let i = shapes.length - 1; i > 0; i--) {
      const j = Math.floor(lr() * (i + 1));
      [shapes[i], shapes[j]] = [shapes[j], shapes[i]];
    }
  }

  const bg = params.bgOverride ||
    (params.invertColors && pal.colors.length > 0 ? pal.colors[0] : pal.bg);

  let finalShapes = shapes;
  if (params.invertColors && pal.colors.length > 0 && !params.bgOverride) {
    const newColors = [pal.bg, ...pal.colors.slice(1)];
    finalShapes = shapes.map((s) => {
      const idx = pal.colors.indexOf(s.fill);
      return { ...s, fill: idx >= 0 ? newColors[idx % newColors.length] : s.fill };
    });
  }

  return {
    id: "",
    width: fmt.width,
    height: fmt.height,
    bg,
    shapes: finalShapes,
    seed,
    params,
  };
}

export function shapeToSvg(s: Shape, imports: ImportedSvg[]): string {
  if (s.customId) {
    const im = imports.find((i) => i.id === s.customId);
    if (!im) return "";
    const rot = s.rot * 90;
    return `<g transform="translate(${s.x + s.w / 2},${s.y + s.h / 2}) rotate(${rot}) translate(${-s.w / 2},${-s.h / 2})"><svg viewBox="${im.viewBox}" width="${s.w}" height="${s.h}">${im.body}</svg></g>`;
  }
  const rot = s.rot * 90;
  if (rot === 0) {
    return renderShape(s.kind, s.fill, s.x, s.y, s.w, s.h, s.outline, s.outlineWidth);
  }
  return `<g transform="translate(${s.x + s.w / 2},${s.y + s.h / 2}) rotate(${rot}) translate(${-s.w / 2},${-s.h / 2})">${renderShape(s.kind, s.fill, 0, 0, s.w, s.h, s.outline, s.outlineWidth)}</g>`;
}

export function compositionToSvg(c: Composition, imports: ImportedSvg[] = []): string {
  const body = c.shapes.map((s) => shapeToSvg(s, imports)).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.width} ${c.height}"><rect width="${c.width}" height="${c.height}" fill="${c.bg}"/>${body}</svg>`;
}
