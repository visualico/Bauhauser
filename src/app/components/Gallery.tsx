import { Composition } from "../lib/generator";

type Props = {
  items: Composition[];
  imports: { id: string }[];
  onSelect: (c: Composition) => void;
};

export function Gallery({ items, onSelect }: Props) {
  return (
    <aside
      className="h-full overflow-y-auto"
      style={{
        background: "#fff",
        color: "#000",
        borderLeft: "1px solid rgba(0,0,0,0.08)",
        width: 240,
        flexShrink: 0,
      }}
    >
      <div
        className="px-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", height: 57 }}
      >
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Gallery</span>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.5 }}>
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div
          className="px-5 py-5"
          style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.5 }}
        >
          Empty
        </div>
      ) : (
        <div className="p-5 grid grid-cols-1 gap-3">
          {items.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              title={c.name}
              style={{
                background: "none",
                border: "1px solid #000",
                padding: 0,
                cursor: "pointer",
                display: "block",
              }}
            >
              <svg
                viewBox={`0 0 ${c.width} ${c.height}`}
                style={{ display: "block", width: "100%", background: c.bg }}
                preserveAspectRatio="xMidYMid meet"
                dangerouslySetInnerHTML={{ __html: c.svgBody ?? "" }}
              />
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
