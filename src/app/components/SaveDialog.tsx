import { useState } from "react";
import { X, Shuffle } from "lucide-react";
import type { GenParams } from "../lib/generator";
import { suggestNames } from "../lib/naming";
import { generate } from "../lib/generator";

type Props = {
  params: GenParams;
  onSave: (name: string, author: string) => void;
  onClose: () => void;
};

const micro: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
};

export function SaveDialog({ params, onSave, onClose }: Props) {
  const comp = generate(params);
  const names = suggestNames(comp, 10);
  const [nameIdx, setNameIdx] = useState(0);
  const [title, setTitle] = useState(names[0] ?? "Untitled");
  const [author, setAuthor] = useState("");

  function shuffleTitle() {
    const next = (nameIdx + 1) % names.length;
    setNameIdx(next);
    setTitle(names[next]);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", border: "1px solid #000", width: 380, maxWidth: "90%" }}
      >
        <header
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid #000" }}
        >
          <span style={micro}>Save to Gallery</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }} aria-label="Close">
            <X size={12} />
          </button>
        </header>

        <div className="px-4 py-4">
          <label style={{ ...micro, display: "block", marginBottom: 6 }}>Title</label>
          <div className="flex items-stretch" style={{ border: "1px solid #000" }}>
            <input
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "8px 10px", fontSize: 12 }}
            />
            <button
              onClick={shuffleTitle}
              aria-label="Suggest another title"
              title="Suggest another title"
              style={{ borderLeft: "1px solid #000", background: "#fff", padding: "0 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Shuffle size={12} />
            </button>
          </div>
          <div style={{ ...micro, opacity: 0.5, marginTop: 4 }}>Generated from palette & shapes</div>
        </div>

        <div className="px-4 pb-4">
          <label style={{ ...micro, display: "block", marginBottom: 6 }}>Author</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSave(title.trim() || "Untitled", author.trim()); }}
            placeholder="Anonymous"
            style={{ width: "100%", border: "1px solid #000", background: "#fff", outline: "none", padding: "8px 10px", fontSize: 12 }}
          />
        </div>

        <footer className="flex" style={{ borderTop: "1px solid #000" }}>
          <button
            onClick={onClose}
            className="flex-1 py-3"
            style={{ background: "#fff", color: "#000", border: "none", borderRight: "1px solid #000", cursor: "pointer", ...micro }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title.trim() || "Untitled", author.trim())}
            className="flex-1 py-3"
            style={{ background: "#000", color: "#fff", border: "none", cursor: "pointer", ...micro }}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
