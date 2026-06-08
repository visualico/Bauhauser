import { Download, Trash2, Copy } from "lucide-react";
import { Composition, compositionToSvg } from "../lib/generator";
import type { ImportedSvg } from "../lib/svgImport";

type Props = {
  items: Composition[];
  imports: ImportedSvg[];
  onOpen: (c: Composition) => void;
  onDelete: (id: string) => void;
  onDuplicate: (c: Composition) => void;
  onNew: () => void;
};

function downloadSvg(c: Composition, imports: ImportedSvg[]) {
  const svg = compositionToSvg(c, imports);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${c.name || "composition"}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

const micro: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
};

export function StartPage({ items, imports, onOpen, onDelete, onDuplicate, onNew }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#f5f5f5", color: "#000" }}
    >
      <header
        className="flex items-center justify-between px-10"
        style={{
          height: 57,
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ ...micro, fontSize: 13 }}>Bauhauser</span>
        <button
          onClick={onNew}
          style={{
            ...micro,
            border: "1px solid #000",
            background: "#000",
            color: "#fff",
            padding: "6px 20px",
            cursor: "pointer",
          }}
        >
          New
        </button>
      </header>

      <main className="p-10">
        {items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ minHeight: 400 }}
          >
            <p style={{ ...micro, opacity: 0.4 }}>No saved compositions</p>
            <button
              onClick={onNew}
              style={{
                ...micro,
                border: "1px solid #000",
                background: "#000",
                color: "#fff",
                padding: "8px 24px",
                cursor: "pointer",
                marginTop: 20,
              }}
            >
              Create first
            </button>
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
          >
            {items.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.10)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "box-shadow 120ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.10)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <button
                  onClick={() => onOpen(c)}
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                  aria-label={`Open ${c.name || "composition"}`}
                >
                  <svg
                    viewBox={`0 0 ${c.width} ${c.height}`}
                    style={{
                      display: "block",
                      width: "100%",
                      aspectRatio: `${c.width}/${c.height}`,
                      background: c.bg,
                    }}
                    preserveAspectRatio="xMidYMid meet"
                    dangerouslySetInnerHTML={{
                      __html: c.svgBody ?? "",
                    }}
                  />
                </button>

                <div
                  className="flex items-center justify-between px-3 py-2"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        ...micro,
                        fontSize: 9,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.name || "Untitled"}
                    </div>
                    {c.author && (
                      <div style={{ ...micro, fontSize: 8, opacity: 0.4 }}>
                        {c.author}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => downloadSvg(c, imports)}
                      title="Download SVG"
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}
                    >
                      <Download size={11} />
                    </button>
                    <button
                      onClick={() => onDuplicate(c)}
                      title="Duplicate"
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}
                    >
                      <Copy size={11} />
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      title="Delete"
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4, opacity: 0.4 }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
