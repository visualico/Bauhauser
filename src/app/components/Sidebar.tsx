import { Lock, Unlock } from "lucide-react";
import { FormatPicker } from "./FormatPicker";
import { PalettePicker } from "./PalettePicker";
import { ShapePicker } from "./ShapePicker";
import { GenParams } from "../lib/generator";
import { FormatId, getPalette, type Palette } from "../lib/palettes";
import { ShapeKind } from "../lib/shapes";
import type { ImportedSvg } from "../lib/svgImport";

type Props = {
  params: GenParams;
  onChange: (p: Partial<GenParams>) => void;
  onAddImport: (im: ImportedSvg) => void;
  onUpdateImport: (id: string, patch: Partial<ImportedSvg>) => void;
  onRemoveImport: (id: string) => void;
  locks: Set<string>;
  onToggleLock: (key: string) => void;
};

function LockBtn({ locked, onClick }: { locked: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={locked ? "Unlock" : "Lock"}
      title={locked ? "Locked — random will skip this" : "Lock from random"}
      style={{
        border: "none",
        background: "none",
        padding: 0,
        marginLeft: 6,
        cursor: "pointer",
        display: "inline-flex",
        opacity: locked ? 1 : 0.35,
      }}
    >
      {locked ? <Lock size={10} /> : <Unlock size={10} />}
    </button>
  );
}

const micro: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
};

function Section({
  title, children, meta, right,
}: {
  title: string; children: React.ReactNode; meta?: string; right?: React.ReactNode;
}) {
  return (
    <section className="px-5 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div style={micro}>{title}</div>
        <div className="flex items-center">
          {meta && <span style={{ ...micro, opacity: 0.5 }}>{meta}</span>}
          {right}
        </div>
      </div>
      {children}
    </section>
  );
}

function Slider({
  value, min = 0, max = 100, step = 1, onChange,
}: {
  value: number; min?: number; max?: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: "#000" }}
    />
  );
}

export function Sidebar(props: Props) {
  const {
    params, onChange,
    onAddImport, onUpdateImport, onRemoveImport,
    locks, onToggleLock,
  } = props;
  const lock = (key: string) => (
    <LockBtn locked={locks.has(key)} onClick={() => onToggleLock(key)} />
  );

  const toggleShape = (k: ShapeKind) => {
    const cur = params.enabledShapes;
    onChange({
      enabledShapes: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k],
    });
  };
  const toggleShapeGroup = (kinds: ShapeKind[], on: boolean) => {
    const cur = new Set(params.enabledShapes);
    if (on) kinds.forEach((k) => cur.add(k));
    else kinds.forEach((k) => cur.delete(k));
    onChange({ enabledShapes: Array.from(cur) });
  };

  const activePalette: Palette =
    params.paletteId === "custom" && params.customPalette
      ? params.customPalette
      : getPalette(params.paletteId);
  const maxSpread = activePalette.colors.length;

  return (
    <aside
      className="h-full overflow-y-auto"
      style={{
        background: "#fff",
        color: "#000",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        width: 300,
        flexShrink: 0,
      }}
    >
      <Section title="Shapes" meta={`${params.enabledShapes.length}`} right={lock("enabledShapes")}>
        <ShapePicker
          enabled={params.enabledShapes}
          onToggle={toggleShape}
          onToggleAll={toggleShapeGroup}
          imports={params.imports}
          onAddImport={onAddImport}
          onUpdateImport={onUpdateImport}
          onRemoveImport={onRemoveImport}
          outlines={params.shapeOutlines ?? {}}
          outlineWidths={params.shapeOutlineWidth ?? {}}
          onToggleOutline={(catId) =>
            onChange({
              shapeOutlines: {
                ...(params.shapeOutlines ?? {}),
                [catId]: !(params.shapeOutlines?.[catId] ?? false),
              },
            })
          }
          onChangeOutlineWidth={(catId, n) =>
            onChange({
              shapeOutlineWidth: {
                ...(params.shapeOutlineWidth ?? {}),
                [catId]: n,
              },
            })
          }
        />
      </Section>

      <Section title="Format">
        <FormatPicker
          value={params.format}
          onChange={(f: FormatId) => onChange({ format: f })}
        />
      </Section>

      <Section title="Palette" right={lock("paletteId")}>
        <PalettePicker
          value={params.paletteId}
          custom={params.customPalette}
          onChange={(id) =>
            onChange({
              paletteId: id,
              colorSpread: Math.min(
                params.colorSpread,
                id === "custom" && params.customPalette
                  ? params.customPalette.colors.length
                  : getPalette(id).colors.length,
              ),
            })
          }
          onCustomChange={(p) => onChange({ customPalette: p })}
        />
        <button
          onClick={() => onChange({ invertColors: !params.invertColors })}
          style={{
            marginTop: 10,
            width: "100%",
            border: "1px solid #000",
            background: params.invertColors ? "#000" : "#fff",
            color: params.invertColors ? "#fff" : "#000",
            padding: "6px 0",
            cursor: "pointer",
            ...micro,
          }}
        >
          {params.invertColors ? "Invert: On" : "Invert: Off"}
        </button>
        <div className="flex items-center justify-between mt-3">
          <span style={{ ...micro, display: "inline-flex", alignItems: "center" }}>
            Background{lock("bgOverride")}
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="swatch-circle"
              value={params.bgOverride || activePalette.bg}
              onChange={(e) => onChange({ bgOverride: e.target.value })}
              style={{ width: 24, height: 24, border: "1px solid #000", padding: 0, cursor: "pointer" }}
            />
            {params.bgOverride && (
              <button
                onClick={() => onChange({ bgOverride: null })}
                style={{ ...micro, border: "none", background: "none", cursor: "pointer", opacity: 0.5, padding: 0 }}
                title="Reset to palette default"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </Section>

      <Section title="Composition">
        <div className="flex flex-col gap-3">
          {[
            { label: ["Loose", "Tight"], key: "jitter" as const, value: (1 - params.jitter) * 100, onChange: (v: number) => onChange({ jitter: 1 - v / 100 }) },
            { label: ["Calm", "Energetic"], key: "rotationChance" as const, value: params.rotationChance * 100, onChange: (v: number) => onChange({ rotationChance: v / 100 }) },
            { label: ["Quiet", "Bold"], key: "colorSpread" as const, value: params.colorSpread, onChange: (v: number) => onChange({ colorSpread: Math.round(v) }), min: 1, max: maxSpread },
            { label: ["Empty", "Full"], key: "density" as const, value: params.density * 100, onChange: (v: number) => onChange({ density: v / 100 }) },
            { label: ["Fragmented", "Chunky"], key: "mergeChance" as const, value: params.mergeChance * 100, onChange: (v: number) => onChange({ mergeChance: v / 100 }) },
          ].map(({ label, key, value, onChange: onCh, min, max }) => (
            <div key={key}>
              <div className="flex justify-between items-center" style={{ ...micro, opacity: 0.6 }}>
                <span>{label[0]}</span>
                <span className="flex items-center">{label[1]}{lock(key)}</span>
              </div>
              <Slider value={value} min={min} max={max} onChange={onCh} />
            </div>
          ))}
          <div>
            <div className="flex justify-between items-center" style={micro}>
              <span>Min Size</span>
              <span className="flex items-center" style={{ opacity: 0.5 }}>
                {params.minShapeCells}×{params.minShapeCells}{lock("minShapeCells")}
              </span>
            </div>
            <Slider
              value={params.minShapeCells}
              min={1}
              max={8}
              onChange={(v) => {
                const n = Math.round(v);
                onChange({ minShapeCells: n, ...(n > params.maxShapeCells ? { maxShapeCells: n } : {}) });
              }}
            />
          </div>
          <div>
            <div className="flex justify-between items-center" style={micro}>
              <span>Max Size</span>
              <span className="flex items-center" style={{ opacity: 0.5 }}>
                {params.maxShapeCells}×{params.maxShapeCells}{lock("maxShapeCells")}
              </span>
            </div>
            <Slider
              value={params.maxShapeCells}
              min={1}
              max={8}
              onChange={(v) => {
                const n = Math.round(v);
                onChange({ maxShapeCells: n, ...(n < params.minShapeCells ? { minShapeCells: n } : {}) });
              }}
            />
          </div>
        </div>
      </Section>

      <Section title="Grid">
        <div className="flex flex-col gap-3">
          {[
            { label: "Cols", key: "cols" as const, value: params.cols, min: 2, max: 16, display: `${params.cols}` },
            { label: "Rows", key: "rows" as const, value: params.rows, min: 2, max: 16, display: `${params.rows}` },
            { label: "Gutter", key: "gutter" as const, value: params.gutter, min: 0, max: 40, display: `${params.gutter}` },
          ].map(({ label, key, value, min, max, display }) => (
            <div key={key}>
              <div className="flex justify-between items-center" style={micro}>
                <span>{label}</span>
                <span className="flex items-center" style={{ opacity: 0.5 }}>{display}{lock(key)}</span>
              </div>
              <Slider value={value} min={min} max={max} onChange={(v) => onChange({ [key]: v })} />
            </div>
          ))}
          <div>
            <div className="flex justify-between" style={micro}>
              <span>Padding</span>
              <span style={{ opacity: 0.5 }}>{params.padding}</span>
            </div>
            <Slider value={params.padding} min={0} max={120} onChange={(v) => onChange({ padding: v })} />
          </div>
        </div>
      </Section>

      <div className="px-5 py-4 flex items-center" style={{ ...micro, opacity: 0.5 }}>
        <span>Seed · {params.seed}</span>
        <span style={{ opacity: 2 }}>{lock("seed")}</span>
      </div>
    </aside>
  );
}
