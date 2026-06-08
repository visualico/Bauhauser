import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SHAPES, CATEGORIES, CATEGORY_OF, renderShape, type ShapeKind } from "../lib/shapes";
import { ImportsPanel } from "./ImportsPanel";
import type { ImportedSvg } from "../lib/svgImport";

type Props = {
  enabled: ShapeKind[];
  onToggle: (k: ShapeKind) => void;
  onToggleAll: (kinds: ShapeKind[], on: boolean) => void;
  imports: ImportedSvg[];
  onAddImport: (im: ImportedSvg) => void;
  onUpdateImport: (id: string, patch: Partial<ImportedSvg>) => void;
  onRemoveImport: (id: string) => void;
  outlines: Record<string, boolean>;
  outlineWidths: Record<string, number>;
  onToggleOutline: (catId: string) => void;
  onChangeOutlineWidth: (catId: string, n: number) => void;
};

const micro: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
};

const THUMB = 32; // thumbnail render size

function ShapeThumb({ shape, enabled, onToggle }: {
  shape: ShapeKind;
  enabled: boolean;
  onToggle: () => void;
}) {
  const svgBody = renderShape(shape, enabled ? "#fff" : "#000", 4, 4, THUMB - 8, THUMB - 8);
  return (
    <button
      onClick={onToggle}
      title={shape}
      aria-pressed={enabled}
      style={{
        width: THUMB + 4,
        height: THUMB + 4,
        border: enabled ? "1.5px solid #000" : "1px solid rgba(0,0,0,0.14)",
        background: enabled ? "#000" : "#fff",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <svg
        width={THUMB}
        height={THUMB}
        viewBox={`0 0 ${THUMB} ${THUMB}`}
        style={{ display: "block", overflow: "visible" }}
        dangerouslySetInnerHTML={{ __html: svgBody }}
      />
    </button>
  );
}

export function ShapePicker(props: Props) {
  const {
    enabled, onToggle, onToggleAll,
    imports, onAddImport, onUpdateImport, onRemoveImport,
    outlines, outlineWidths,
    onToggleOutline, onChangeOutlineWidth,
  } = props;
  const enabledSet = new Set(enabled);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-2">
      {CATEGORIES.map((cat) => {
        const kinds = SHAPES.filter((s) => CATEGORY_OF[s] === cat.id);
        const allOn = kinds.every((k) => enabledSet.has(k));
        const anyOn = kinds.some((k) => enabledSet.has(k));
        const open = !collapsed[cat.id];
        const outlineOn = outlines[cat.id] ?? false;
        const outlineWidth = outlineWidths[cat.id] ?? 2;

        return (
          <div key={cat.id} style={{ border: "1px solid rgba(0,0,0,0.10)" }}>
            <div
              className="flex items-center px-2 py-1.5"
              style={{
                background: "rgba(0,0,0,0.03)",
                borderBottom: open ? "1px solid rgba(0,0,0,0.08)" : "none",
              }}
            >
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [cat.id]: !c[cat.id] }))}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}
                aria-label={open ? "Collapse" : "Expand"}
              >
                {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>
              <span style={{ ...micro, flex: 1, marginLeft: 4 }}>{cat.label}</span>
              <span style={{ ...micro, opacity: 0.35, marginRight: 8, fontSize: 9 }}>
                {kinds.filter((k) => enabledSet.has(k)).length}/{kinds.length}
              </span>
              <button
                onClick={() => onToggleAll(kinds, !allOn)}
                style={{ ...micro, border: "none", background: "none", cursor: "pointer", opacity: anyOn ? 1 : 0.4, paddingRight: 0, fontSize: 9 }}
                title={allOn ? "Deselect all" : "Select all"}
              >
                {allOn ? "None" : "All"}
              </button>
            </div>

            {open && (
              <div className="p-2">
                <div className="flex flex-wrap gap-1">
                  {kinds.map((k) => (
                    <ShapeThumb
                      key={k}
                      shape={k}
                      enabled={enabledSet.has(k)}
                      onToggle={() => onToggle(k)}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => onToggleOutline(cat.id)}
                    style={{
                      ...micro,
                      fontSize: 9,
                      border: "1px solid #000",
                      background: outlineOn ? "#000" : "#fff",
                      color: outlineOn ? "#fff" : "#000",
                      padding: "2px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Outline
                  </button>
                  {outlineOn && (
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={outlineWidth}
                      onChange={(e) => onChangeOutlineWidth(cat.id, parseInt(e.target.value, 10))}
                      style={{ flex: 1, accentColor: "#000" }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ border: "1px solid rgba(0,0,0,0.10)" }}>
        <div
          className="flex items-center px-2 py-1.5"
          style={{ background: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <span style={micro}>Imports</span>
        </div>
        <div className="p-2">
          <ImportsPanel imports={imports} onAdd={onAddImport} onUpdate={onUpdateImport} onRemove={onRemoveImport} />
        </div>
      </div>
    </div>
  );
}
