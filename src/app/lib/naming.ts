import { Composition } from "./generator";

const ADJECTIVES = [
  "Abstract","Ancient","Bright","Calm","Crisp","Dark","Deep","Dense","Digital","Dynamic",
  "Electric","Ethereal","Flat","Fluid","Frozen","Geometric","Glossy","Golden","Gradual","Heavy",
  "Hollow","Humid","Infinite","Layered","Light","Linear","Liquid","Loud","Matte","Minimal",
  "Modern","Monochrome","Organic","Pale","Radiant","Raw","Scattered","Serene","Sharp","Silky",
  "Silent","Simple","Soft","Sparse","Static","Strict","Strong","Thin","Tight","Vivid",
  "Warm","Wild","Zen","Balanced","Broken","Cascading","Circular","Complex","Contrasted","Cool",
  "Curved","Diffuse","Discrete","Divided","Elegant","Faceted","Fine","Foggy","Fragile","Grand",
  "Gritty","Hazy","Intricate","Kinetic","Layered","Muted","Nested","Opaque","Orderly","Precise",
];

const NOUNS = [
  "Atelier","Atlas","Archive","Axiom","Blueprint","Canvas","Cascade","Chamber","Circuit","Cloud",
  "Code","Colony","Construct","Core","Diagram","Draft","Echo","Edge","Element","Expanse",
  "Field","Form","Fragment","Frame","Garden","Gate","Grid","Grove","Harbor","Horizon",
  "Index","Instance","Island","Junction","Kernel","Layer","Lattice","Lens","Map","Matrix",
  "Membrane","Module","Mosaic","Network","Node","Noise","Orbit","Origin","Panel","Pattern",
  "Phase","Plane","Point","Pool","Portal","Prism","Protocol","Realm","Region","Route",
  "Rune","Scale","Schema","Scope","Sector","Sequence","Series","Shadow","Sheet","Signal",
  "Space","Span","Sphere","Stack","State","Station","Stream","Structure","Study","Surface",
  "System","Tessellation","Thread","Tile","Topology","Trace","Vessel","Volume","Wave","Zone",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return Math.abs(s) / 2147483647;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function suggestName(comp: Composition): string {
  const rng = seededRandom(comp.params.seed * 397 + 1);
  const adj = pick(ADJECTIVES, rng);
  const noun = pick(NOUNS, rng);
  return `${adj} ${noun}`;
}

export function suggestNames(comp: Composition, count = 5): string[] {
  return Array.from({ length: count }, (_, i) => {
    const rng = seededRandom(comp.params.seed * 397 + i + 1);
    const adj = pick(ADJECTIVES, rng);
    const noun = pick(NOUNS, rng);
    return `${adj} ${noun}`;
  });
}
