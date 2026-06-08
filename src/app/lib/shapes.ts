export type ShapeKind =
  // geometric
  | "rect" | "circle" | "triangle" | "diamond" | "hexagon" | "octagon"
  | "cross" | "star" | "pentagon" | "heptagon" | "dot" | "grid-cell"
  | "sun" | "gear" | "rounded-rect" | "shield" | "kite" | "frame" | "badge"
  // curved
  | "half-circle" | "quarter-circle" | "ellipse-h" | "ellipse-v" | "donut"
  | "crescent" | "arc" | "spiral" | "ring" | "moon"
  | "pill" | "lens" | "stadium" | "drop" | "arc-seg"
  // angular
  | "arrow" | "chevron" | "zigzag" | "parallelogram" | "trapezoid"
  | "rhombus" | "l-shape" | "t-shape" | "angle" | "notch" | "corner"
  | "arrow-left" | "flag" | "wedge" | "bowtie" | "step"
  // linear
  | "plus" | "x-shape" | "bracket" | "dash" | "stripe"
  | "line-h" | "line-v" | "crosshair" | "double-dash" | "fence"
  // organic
  | "wave" | "blob" | "leaf" | "teardrop" | "heart" | "eye" | "flower"
  | "cloud" | "raindrop" | "petal" | "clover" | "splash";

export type ShapeCategory = { id: string; label: string };

export const CATEGORIES: ShapeCategory[] = [
  { id: "geometric", label: "Geometric" },
  { id: "curved",    label: "Curved"    },
  { id: "angular",   label: "Angular"   },
  { id: "linear",    label: "Linear"    },
  { id: "organic",   label: "Organic"   },
];

export const SHAPES: ShapeKind[] = [
  // geometric
  "rect","circle","triangle","diamond","hexagon","octagon",
  "cross","star","pentagon","heptagon","dot","grid-cell",
  "sun","gear","rounded-rect","shield","kite","frame","badge",
  // curved
  "half-circle","quarter-circle","ellipse-h","ellipse-v","donut",
  "crescent","arc","spiral","ring","moon",
  "pill","lens","stadium","drop","arc-seg",
  // angular
  "arrow","chevron","zigzag","parallelogram","trapezoid",
  "rhombus","l-shape","t-shape","angle","notch","corner",
  "arrow-left","flag","wedge","bowtie","step",
  // linear
  "plus","x-shape","bracket","dash","stripe",
  "line-h","line-v","crosshair","double-dash","fence",
  // organic
  "wave","blob","leaf","teardrop","heart","eye","flower",
  "cloud","raindrop","petal","clover","splash",
];

export const CATEGORY_OF: Record<ShapeKind, string> = {
  // geometric
  rect:"geometric", circle:"geometric", triangle:"geometric", diamond:"geometric",
  hexagon:"geometric", octagon:"geometric", cross:"geometric", star:"geometric",
  pentagon:"geometric", heptagon:"geometric", dot:"geometric", "grid-cell":"geometric",
  sun:"geometric", gear:"geometric", "rounded-rect":"geometric", shield:"geometric",
  kite:"geometric", frame:"geometric", badge:"geometric",
  // curved
  "half-circle":"curved", "quarter-circle":"curved", "ellipse-h":"curved",
  "ellipse-v":"curved", donut:"curved", crescent:"curved", arc:"curved",
  spiral:"curved", ring:"curved", moon:"curved",
  pill:"curved", lens:"curved", stadium:"curved", drop:"curved", "arc-seg":"curved",
  // angular
  arrow:"angular", chevron:"angular", zigzag:"angular", parallelogram:"angular",
  trapezoid:"angular", rhombus:"angular", "l-shape":"angular", "t-shape":"angular",
  angle:"angular", notch:"angular", corner:"angular",
  "arrow-left":"angular", flag:"angular", wedge:"angular", bowtie:"angular", step:"angular",
  // linear
  plus:"linear", "x-shape":"linear", bracket:"linear", dash:"linear", stripe:"linear",
  "line-h":"linear", "line-v":"linear", crosshair:"linear", "double-dash":"linear", fence:"linear",
  // organic
  wave:"organic", blob:"organic", leaf:"organic", teardrop:"organic",
  heart:"organic", eye:"organic", flower:"organic",
  cloud:"organic", raindrop:"organic", petal:"organic", clover:"organic", splash:"organic",
};

export function renderShape(
  kind: ShapeKind,
  fill: string,
  x: number, y: number, w: number, h: number,
  outline?: boolean,
  outlineWidth?: number,
): string {
  const sw  = outlineWidth ?? 2;
  const f   = outline ? "none" : fill;
  const stk = outline ? fill : "none";
  const attrs = `fill="${f}" stroke="${stk}" stroke-width="${sw}"`;
  const cx = x + w / 2, cy = y + h / 2;

  switch (kind) {
    /* ── geometric ───────────────────────────────────────── */
    case "rect":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs}/>`;

    case "circle": {
      const r = Math.min(w,h)/2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`;
    }

    case "triangle":
      return `<polygon points="${cx},${y} ${x+w},${y+h} ${x},${y+h}" ${attrs}/>`;

    case "diamond":
      return `<polygon points="${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}" ${attrs}/>`;

    case "hexagon": {
      const r=Math.min(w,h)/2;
      const pts=Array.from({length:6},(_,i)=>{const a=(Math.PI/3)*i-Math.PI/6;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "octagon": {
      const r=Math.min(w,h)/2;
      const pts=Array.from({length:8},(_,i)=>{const a=(Math.PI/4)*i-Math.PI/8;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "cross": {
      const tw=w/3, th=h/3;
      return `<path d="M${x+tw},${y} h${tw} v${th} h${tw} v${th} h-${tw} v${th} h-${tw} v-${th} h-${tw} v-${th} h${tw} Z" ${attrs}/>`;
    }

    case "star": {
      const r1=Math.min(w,h)/2, r2=r1*0.4;
      const pts=Array.from({length:10},(_,i)=>{const a=(Math.PI/5)*i-Math.PI/2;const r=i%2===0?r1:r2;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "pentagon": {
      const r=Math.min(w,h)/2;
      const pts=Array.from({length:5},(_,i)=>{const a=(2*Math.PI*i)/5-Math.PI/2;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "heptagon": {
      const r=Math.min(w,h)/2;
      const pts=Array.from({length:7},(_,i)=>{const a=(2*Math.PI*i)/7-Math.PI/2;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "dot": {
      const r=Math.min(w,h)*0.15;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
    }

    case "grid-cell":
      return `<rect x="${x+1}" y="${y+1}" width="${w-2}" height="${h-2}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,1)}"/>`;

    case "sun": {
      const sr=Math.min(w,h)*0.28;
      const rays=Array.from({length:8},(_,i)=>{const a=(Math.PI/4)*i;const r1=Math.min(w,h)*0.42;const r2=Math.min(w,h)*0.48;const ra=a+Math.PI/8;return `L${cx+r1*Math.cos(a)},${cy+r1*Math.sin(a)} L${cx+r2*Math.cos(ra)},${cy+r2*Math.sin(ra)}`;}).join(" ");
      return `<circle cx="${cx}" cy="${cy}" r="${sr}" fill="${f}"/><path d="M${cx+Math.min(w,h)*0.42},${cy} ${rays}" ${attrs} fill="${f}"/>`;
    }

    case "gear": {
      const gr=Math.min(w,h)*0.35, ir=gr*0.55, teeth=8;
      const pts=Array.from({length:teeth*4},(_,i)=>{const frac=i/(teeth*4);const a=frac*2*Math.PI;const on=Math.floor(i/2)%2===0;const r=on?gr:gr*0.75;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
      return `<polygon points="${pts}" ${attrs}/><circle cx="${cx}" cy="${cy}" r="${ir}" fill="none" stroke="${fill}" stroke-width="${sw}"/>`;
    }

    case "rounded-rect": {
      const rx=Math.min(w,h)*0.2;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" ${attrs}/>`;
    }

    case "shield": {
      const pts=`${cx},${y} ${x+w},${y+h*0.35} ${cx},${y+h} ${x},${y+h*0.35}`;
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "kite": {
      const pts=`${cx},${y} ${x+w},${cy} ${cx},${y+h*0.85} ${x},${cy}`;
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    case "frame": {
      const b=Math.min(w,h)*0.2;
      return `<path fill-rule="evenodd" d="M${x},${y} h${w} v${h} h-${w}Z M${x+b},${y+b} h${w-2*b} v${h-2*b} h-${w-2*b}Z" fill="${fill}"/>`;
    }

    case "badge": {
      const pts=Array.from({length:12},(_,i)=>{const a=(2*Math.PI*i)/12-Math.PI/2;const r=i%2===0?Math.min(w,h)/2:Math.min(w,h)*0.4;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
      return `<polygon points="${pts}" ${attrs}/>`;
    }

    /* ── curved ──────────────────────────────────────────── */
    case "half-circle":
      return `<path d="M${x},${cy} A${w/2},${h/2} 0 0 1 ${x+w},${cy} Z" ${attrs}/>`;

    case "quarter-circle":
      return `<path d="M${x},${y+h} A${w},${h} 0 0 1 ${x+w},${y} L${x+w},${y+h} Z" ${attrs}/>`;

    case "ellipse-h":
      return `<ellipse cx="${cx}" cy="${cy}" rx="${w*0.48}" ry="${h*0.3}" ${attrs}/>`;

    case "ellipse-v":
      return `<ellipse cx="${cx}" cy="${cy}" rx="${w*0.3}" ry="${h*0.48}" ${attrs}/>`;

    case "donut": {
      const r1=Math.min(w,h)/2, r2=r1*0.55;
      return `<path fill-rule="evenodd" d="M${cx+r1},${cy} A${r1},${r1} 0 1 0 ${cx-r1},${cy} A${r1},${r1} 0 1 0 ${cx+r1},${cy} M${cx+r2},${cy} A${r2},${r2} 0 1 1 ${cx-r2},${cy} A${r2},${r2} 0 1 1 ${cx+r2},${cy}" fill="${f}" stroke="${stk}" stroke-width="${sw}"/>`;
    }

    case "crescent":
      return `<path d="M${cx},${y} A${w/2},${h/2} 0 1 0 ${cx},${y+h} A${w*0.35},${h*0.45} 0 1 1 ${cx},${y}" ${attrs}/>`;

    case "arc":
      return `<path d="M${x+w*0.1},${y+h*0.85} A${w*0.4},${h*0.6} 0 0 1 ${x+w*0.9},${y+h*0.85}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,4)}" stroke-linecap="round"/>`;

    case "spiral": {
      const turns=2.5, step=5;
      let d=`M${cx},${cy}`;
      for(let i=1;i<turns*360;i+=step){const a=(i*Math.PI)/180;const r=(Math.min(w,h)/2)*(i/(turns*360));d+=` L${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}
      return `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,2)}" stroke-linecap="round"/>`;
    }

    case "ring": {
      const r1=Math.min(w,h)/2, r2=r1*0.7;
      return `<path fill-rule="evenodd" d="M${cx},${cy-r1} A${r1},${r1} 0 1 0 ${cx},${cy+r1} A${r1},${r1} 0 1 0 ${cx},${cy-r1} M${cx},${cy-r2} A${r2},${r2} 0 1 1 ${cx},${cy+r2} A${r2},${r2} 0 1 1 ${cx},${cy-r2}" fill="${f}" stroke="${stk}" stroke-width="${sw}"/>`;
    }

    case "moon": {
      const mr=Math.min(w,h)/2;
      return `<path d="M${cx},${y} A${mr},${mr} 0 1 0 ${cx},${y+h} A${mr*0.65},${mr*0.75} 0 1 1 ${cx},${y} Z" ${attrs}/>`;
    }

    case "pill": {
      const r=Math.min(w,h)/2;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" ${attrs}/>`;
    }

    case "lens":
      return `<path d="M${x},${cy} Q${cx},${y} ${x+w},${cy} Q${cx},${y+h} ${x},${cy} Z" ${attrs}/>`;

    case "stadium": {
      const r=h/2;
      return `<path d="M${x+r},${y} h${w-2*r} A${r},${r} 0 0 1 ${x+r},${y+h} h-${w-2*r} A${r},${r} 0 0 1 ${x+r},${y} Z" ${attrs}/>`;
    }

    case "drop":
      return `<path d="M${cx},${y+h} C${x},${cy+h*0.1} ${x+w*0.15},${y+h*0.2} ${cx},${y} C${x+w*0.85},${y+h*0.2} ${x+w},${cy+h*0.1} ${cx},${y+h} Z" ${attrs}/>`;

    case "arc-seg":
      return `<path d="M${x+w*0.05},${y+h*0.9} A${w*0.45},${h*0.55} 0 0 1 ${x+w*0.95},${y+h*0.9} L${cx},${cy} Z" ${attrs}/>`;

    /* ── angular ─────────────────────────────────────────── */
    case "arrow": {
      const aw=w*0.4, ah=h*0.35;
      return `<path d="M${x},${cy-h*0.15} h${w-aw} v-${ah} L${x+w},${cy} L${x+w-aw},${cy+ah+h*0.15} v-${ah} H${x} Z" ${attrs}/>`;
    }

    case "chevron": {
      const d=w*0.25;
      return `<path d="M${x},${y} L${x+w-d},${cy} L${x},${y+h} L${x+d},${y+h} L${x+w},${cy} L${x+d},${y} Z" ${attrs}/>`;
    }

    case "zigzag": {
      const segs=4, sw2=w/segs;
      const pts=Array.from({length:segs+1},(_,i)=>{const px=x+sw2*i;const py=i%2===0?y+h*0.8:y+h*0.2;return `${px},${py}`;}).join(" ");
      return `<polyline points="${pts}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,3)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    case "parallelogram": {
      const off=w*0.2;
      return `<polygon points="${x+off},${y} ${x+w},${y} ${x+w-off},${y+h} ${x},${y+h}" ${attrs}/>`;
    }

    case "trapezoid": {
      const ins=w*0.15;
      return `<polygon points="${x+ins},${y} ${x+w-ins},${y} ${x+w},${y+h} ${x},${y+h}" ${attrs}/>`;
    }

    case "rhombus":
      return `<polygon points="${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}" ${attrs}/>`;

    case "l-shape": {
      const lw=w*0.4, lh=h*0.4;
      return `<path d="M${x},${y} h${lw} v${h-lh} h${w-lw} v${lh} h-${w} Z" ${attrs}/>`;
    }

    case "t-shape": {
      const tw=w*0.35, th=h*0.35;
      return `<path d="M${x},${y} h${w} v${th} h-${(w-tw)/2} v${h-th} h-${tw} v-${h-th} h-${(w-tw)/2} Z" ${attrs}/>`;
    }

    case "angle":
      return `<path d="M${x+w*0.1},${y+h*0.1} L${x+w*0.1},${y+h*0.9} L${x+w*0.9},${y+h*0.9}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,4)}" stroke-linecap="round" stroke-linejoin="round"/>`;

    case "notch": {
      const nd=Math.min(w,h)*0.3;
      return `<path d="M${x},${y} h${w} v${h} h-${w} v-${(h-nd)/2} h${nd} v-${nd} h-${nd} Z" ${attrs}/>`;
    }

    case "corner": {
      const cl=Math.min(w,h)*0.5;
      return `<path d="M${x+cl},${y} L${x},${y} L${x},${y+cl}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,4)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    case "arrow-left": {
      const aw=w*0.4, ah=h*0.35;
      return `<path d="M${x+w},${cy-h*0.15} h-${w-aw} v-${ah} L${x},${cy} L${x+aw},${cy+ah+h*0.15} v-${ah} H${x+w} Z" ${attrs}/>`;
    }

    case "flag": {
      const sw3=w*0.15;
      return `<path d="M${x+sw3},${y} h${w-sw3} L${x+w-sw3*2},${cy} L${x+w},${cy} L${x+w-sw3*2},${y+h*0.6} h-${w-sw3-sw3*2} Z M${x+sw3},${y} v${h}" fill="${f}" stroke="${fill}" stroke-width="${Math.max(sw,3)}" stroke-linecap="round"/>`;
    }

    case "wedge":
      return `<path d="M${x},${y+h} L${x+w},${y+h} L${x+w},${y} Z" ${attrs}/>`;

    case "bowtie":
      return `<path d="M${x},${y} L${x+w},${y+h} L${x+w},${y} L${x},${y+h} Z" ${attrs}/>`;

    case "step": {
      const sw4=w/2, sh=h/2;
      return `<path d="M${x},${y+h} h${sw4} v-${sh} h${sw4} v-${sh} h-${w} Z" ${attrs}/>`;
    }

    /* ── linear ──────────────────────────────────────────── */
    case "plus": {
      const pw=w/3, ph=h/3;
      return `<path d="M${x+pw},${y} h${pw} v${ph} h${pw} v${ph} h-${pw} v${ph} h-${pw} v-${ph} h-${pw} v-${ph} h${pw} Z" ${attrs}/>`;
    }

    case "x-shape": {
      const t=Math.min(w,h)*0.15;
      return `<path d="M${x},${y+t} L${cx-t},${cy} L${x},${y+h-t} L${x+t},${y+h} L${cx},${cy+t} L${x+w-t},${y+h} L${x+w},${y+h-t} L${cx+t},${cy} L${x+w},${y+t} L${x+w-t},${y} L${cx},${cy-t} L${x+t},${y} Z" ${attrs}/>`;
    }

    case "bracket":
      return `<path d="M${cx+w*0.2},${y+h*0.05} L${x+w*0.2},${y+h*0.05} L${x+w*0.2},${y+h*0.95} L${cx+w*0.2},${y+h*0.95}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,4)}" stroke-linecap="round" stroke-linejoin="round"/>`;

    case "dash":
      return `<line x1="${x+w*0.1}" y1="${cy}" x2="${x+w*0.9}" y2="${cy}" stroke="${fill}" stroke-width="${Math.max(sw,h*0.2)}" stroke-linecap="round"/>`;

    case "stripe":
      return `<rect x="${x}" y="${y+h*0.4}" width="${w}" height="${h*0.2}" fill="${fill}"/>`;

    case "line-h":
      return `<line x1="${x+w*0.05}" y1="${cy}" x2="${x+w*0.95}" y2="${cy}" stroke="${fill}" stroke-width="${Math.max(sw,3)}" stroke-linecap="round"/>`;

    case "line-v":
      return `<line x1="${cx}" y1="${y+h*0.05}" x2="${cx}" y2="${y+h*0.95}" stroke="${fill}" stroke-width="${Math.max(sw,3)}" stroke-linecap="round"/>`;

    case "crosshair": {
      const sw5=Math.max(sw,2);
      return `<line x1="${x+w*0.05}" y1="${cy}" x2="${x+w*0.95}" y2="${cy}" stroke="${fill}" stroke-width="${sw5}" stroke-linecap="round"/>` +
             `<line x1="${cx}" y1="${y+h*0.05}" x2="${cx}" y2="${y+h*0.95}" stroke="${fill}" stroke-width="${sw5}" stroke-linecap="round"/>`;
    }

    case "double-dash": {
      const sw6=Math.max(sw,h*0.12);
      return `<line x1="${x+w*0.1}" y1="${cy-h*0.15}" x2="${x+w*0.9}" y2="${cy-h*0.15}" stroke="${fill}" stroke-width="${sw6}" stroke-linecap="round"/>` +
             `<line x1="${x+w*0.1}" y1="${cy+h*0.15}" x2="${x+w*0.9}" y2="${cy+h*0.15}" stroke="${fill}" stroke-width="${sw6}" stroke-linecap="round"/>`;
    }

    case "fence": {
      const n=4, bw=w/n, bsw=Math.max(sw,2);
      return Array.from({length:n},(_,i)=>`<line x1="${x+bw*i+bw/2}" y1="${y+h*0.1}" x2="${x+bw*i+bw/2}" y2="${y+h*0.9}" stroke="${fill}" stroke-width="${bsw}" stroke-linecap="round"/>`).join("") +
             `<line x1="${x+w*0.05}" y1="${cy}" x2="${x+w*0.95}" y2="${cy}" stroke="${fill}" stroke-width="${bsw}" stroke-linecap="round"/>`;
    }

    /* ── organic ─────────────────────────────────────────── */
    case "wave": {
      const amp=h*0.25, seg=w/4;
      return `<path d="M${x},${cy} C${x+seg*0.5},${cy-amp} ${x+seg*1.5},${cy-amp} ${x+seg*2},${cy} C${x+seg*2.5},${cy+amp} ${x+seg*3.5},${cy+amp} ${x+seg*4},${cy}" fill="none" stroke="${fill}" stroke-width="${Math.max(sw,3)}" stroke-linecap="round"/>`;
    }

    case "blob": {
      const bw=w*0.45, bh=h*0.45;
      return `<path d="M${cx+bw},${cy} C${cx+bw},${cy-bh*1.2} ${cx-bw*1.2},${cy-bh} ${cx-bw},${cy} C${cx-bw*1.2},${cy+bh} ${cx+bw*1.1},${cy+bh*1.1} ${cx+bw},${cy} Z" ${attrs}/>`;
    }

    case "leaf":
      return `<path d="M${cx},${y} Q${x+w},${cy} ${cx},${y+h} Q${x},${cy} ${cx},${y} Z" ${attrs}/>`;

    case "teardrop":
      return `<path d="M${cx},${y+h} C${x},${cy} ${x+w*0.3},${y} ${cx},${y} C${x+w*0.7},${y} ${x+w},${cy} ${cx},${y+h} Z" ${attrs}/>`;

    case "heart": {
      const qx=w*0.25, hy2=y+h*0.3;
      return `<path d="M${cx},${y+h*0.95} C${x},${hy2+h*0.1} ${x},${y} ${cx-qx},${y} Q${x},${y} ${x},${hy2} C${x},${hy2-h*0.15} ${cx-qx},${y} ${cx},${hy2} C${cx+qx},${y} ${x+w},${hy2-h*0.15} ${x+w},${hy2} Q${x+w},${y} ${cx+qx},${y} C${x+w},${y} ${x+w},${hy2+h*0.1} ${cx},${y+h*0.95} Z" ${attrs}/>`;
    }

    case "eye":
      return `<path d="M${x},${cy} Q${cx},${y} ${x+w},${cy} Q${cx},${y+h} ${x},${cy} Z" ${attrs}/>`;

    case "flower": {
      const pr=Math.min(w,h)*0.22, pd=Math.min(w,h)*0.28;
      const petals=Array.from({length:6},(_,i)=>{const a=(Math.PI/3)*i;const px=cx+pd*Math.cos(a);const py=cy+pd*Math.sin(a);return `<ellipse cx="${px}" cy="${py}" rx="${pr}" ry="${pr*0.5}" transform="rotate(${(a*180)/Math.PI} ${px} ${py})" fill="${f}" stroke="${stk}" stroke-width="${sw}"/>`;}).join("");
      return `${petals}<circle cx="${cx}" cy="${cy}" r="${pr*0.7}" fill="${f}" stroke="${stk}" stroke-width="${sw}"/>`;
    }

    case "cloud": {
      const r1=h*0.35, r2=h*0.28, r3=h*0.22;
      return `<path d="M${x+w*0.2},${y+h} h${w*0.6} Q${x+w},${y+h} ${x+w},${cy+h*0.05} A${r2},${r2} 0 0 0 ${x+w*0.7},${y+h*0.25} A${r3},${r3} 0 0 0 ${cx},${y} A${r1},${r1} 0 0 0 ${x+w*0.15},${y+h*0.35} A${r2},${r2} 0 0 0 ${x},${cy+h*0.05} Q${x},${y+h} ${x+w*0.2},${y+h} Z" ${attrs}/>`;
    }

    case "raindrop":
      return `<path d="M${cx},${y} C${cx},${y} ${x+w*0.05},${cy} ${cx},${y+h} C${x+w*0.95},${cy} ${cx},${y} ${cx},${y} Z" ${attrs}/>`;

    case "petal":
      return `<path d="M${cx},${y+h} Q${x},${cy} ${cx},${y} Q${x+w},${cy} ${cx},${y+h} Z" ${attrs}/>`;

    case "clover": {
      const cr=Math.min(w,h)*0.28;
      const offsets=[[0,-1],[1,0],[0,1],[-1,0]];
      return offsets.map(([ox,oy])=>`<circle cx="${cx+ox*cr*0.8}" cy="${cy+oy*cr*0.8}" r="${cr}" fill="${f}" stroke="${stk}" stroke-width="${sw}"/>`).join("");
    }

    case "splash": {
      const sr=Math.min(w,h)*0.3;
      const spikes=Array.from({length:8},(_,i)=>{const a=(2*Math.PI*i)/8;const r=i%2===0?sr:sr*0.55;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" L");
      return `<path d="M${spikes} Z" ${attrs}/>`;
    }

    default:
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  }
}
