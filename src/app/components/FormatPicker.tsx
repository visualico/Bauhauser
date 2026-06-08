import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FORMATS, type FormatId } from "../lib/palettes";

type Props = {
  value: FormatId;
  onChange: (id: FormatId) => void;
};

const micro: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
};

export function FormatPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const groups: Record<string, typeof FORMATS> = {};
  for (const f of FORMATS) {
    (groups[f.category] ??= []).push(f);
  }

  const current = FORMATS.find((f) => f.id === value) ?? FORMATS[0];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-2 py-2"
        style={{ border: "1px solid #000", background: "#fff", color: "#000", cursor: "pointer", ...micro }}
      >
        <span>{current.label}</span>
        <span className="flex items-center gap-2" style={{ opacity: 0.5 }}>
          <span>{current.width}×{current.height}</span>
          <ChevronDown size={11} />
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% - 1px)",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "#fff",
            border: "1px solid #000",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {Object.entries(groups).map(([category, formats], gi) => (
            <div key={category} style={{ borderTop: gi === 0 ? "none" : "1px solid #000" }}>
              <div className="px-2 py-1.5" style={{ ...micro, opacity: 0.5, background: "#fafafa" }}>
                {category}
              </div>
              {formats.map((f) => {
                const active = f.id === value;
                return (
                  <button
                    key={f.id}
                    onClick={() => { onChange(f.id); setOpen(false); }}
                    className="w-full flex items-center justify-between px-2 py-1.5"
                    style={{
                      background: active ? "#000" : "#fff",
                      color: active ? "#fff" : "#000",
                      border: "none",
                      borderTop: "1px solid rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      textAlign: "left",
                      ...micro,
                    }}
                  >
                    <span>{f.label}</span>
                    <span style={{ opacity: active ? 0.7 : 0.4 }}>{f.width}×{f.height}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
