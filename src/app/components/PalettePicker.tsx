import { useState } from "react";
import { Search } from "lucide-react";
import { PALETTES, type Palette } from "../lib/palettes";

type Props = {
  value: string;
  custom: Palette | null;
  onChange: (id: string) => void;
  onCustomChange: (p: Palette | null) => void;
};

const micro: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
};

export function PalettePicker({ value, onChange }: Props) {
  const [q, setQ] = useState("");
  const filtered = PALETTES.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1 mb-2"
        style={{ border: "1px solid #000" }}
      >
        <Search size={11} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SEARCH"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#000",
          }}
        />
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: 260, border: "1px solid #000" }}
      >
        {filtered.map((p, i) => {
          const active = p.id === value;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5"
              style={{
                background: active ? "#000" : "#fff",
                color: active ? "#fff" : "#000",
                border: "none",
                borderTop: i === 0 ? "none" : "1px solid #000",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  display: "flex",
                  gap: 3,
                  flexShrink: 0,
                }}
              >
                {p.colors.slice(0, 5).map((c, j) => (
                  <span
                    key={j}
                    style={{
                      width: 12,
                      height: 12,
                      background: c,
                      borderRadius: "50%",
                      border: active ? "1px solid #fff" : "1px solid #000",
                    }}
                  />
                ))}
              </span>
              <span style={{ ...micro, flex: 1 }}>{p.name}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-2 py-3" style={{ ...micro, opacity: 0.5 }}>
            None
          </div>
        )}
      </div>
      <div style={{ ...micro, opacity: 0.5, marginTop: 6 }}>
        {PALETTES.length} palettes · {filtered.length} shown
      </div>
    </div>
  );
}
