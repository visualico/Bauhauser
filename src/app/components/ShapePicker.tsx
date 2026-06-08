import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SHAPES, CATEGORIES, CATEGORY_OF, type ShapeKind } from "../lib/shapes";
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

function ShapeBtn({ shape, enabled, onToggle }: {
  shape: ShapeKind; enabled: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      title={shape}
      aria-pressed={enabled}
      style={{
        border: enabled ? "1px solid #000" : "1px solid rgba(0,0,0,0.12)",
        background: enabled ? "#000" : "#fff",
        color: enabled ? "#fff" : "rgba(0,0,0,0.35)",
        width: 36,
        height: 36,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        letterSpacing: 1,
        textTransform: "uppercase",
        overflow: "hidden",
        padding: 2,
      }}
    >
      <span style={{
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        fontSize: 8,
      }}>
        {shape.slice(0, 4)}
      </span>
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
    <div className="flex flex-col gap-3">
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
              style={{ background: "rgba(0,0,0,0.03)", borderBottom: open ? "1px solid rgba(0,0,0,0.08)" : "none" }}
            >
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [cat.id]: !c[cat.id] }))}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}
                aria-label={open ? "Collapse" : "Expand"}
              >
                {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>
              <span style={{ ...micro, flex: 1, marginLeft: 4 }}>{cat.label}</span>
              <button
                onClick={() => onToggleAll(kinds, !allOn)}
                style={{
                  ...micro,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  opacity: anyOn ? 1 : 0.4,
                  paddingRight: 0,
                }}
                title={allOn ? "Deselect all" : "Select all"}
              >
                {allOn ? "None" : "All"}
              </button>
            </div>

            {open && (
              <div className="p-2">
                <div className="flex flex-wrap gap-1">
                  {kinds.map((k) => (
                    <ShapeBtn
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
                      border: "1px solid #000",
                      background: outlineOn ? "#000" : "#fff",
                      color: outlineOn ? "#fff" : "#000",
                      padding: "3px 8px",
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
          <ImportsPanel
            imports={imports}
            onAdd={onAddImport}
            onUpdate={onUpdateImport}
            onRemove={onRemoveImport}
          />
        </div>
      </div>
    </div>
  );
}
