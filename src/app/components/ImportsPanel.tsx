import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import type { ImportedSvg } from "../lib/svgImport";
import { parseSvgFile } from "../lib/svgImport";

type Props = {
  imports: ImportedSvg[];
  onAdd: (im: ImportedSvg) => void;
  onUpdate: (id: string, patch: Partial<ImportedSvg>) => void;
  onRemove: (id: string) => void;
};

export function ImportsPanel({ imports, onAdd, onUpdate, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (!f.name.toLowerCase().endsWith(".svg")) continue;
      const im = await parseSvgFile(f);
      if (im) onAdd(im);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".svg,image/svg+xml"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className="w-full flex items-center justify-center gap-2 py-3"
        style={{
          border: drag ? "1px solid #000" : "1px dashed #000",
          background: drag ? "#000" : "#fff",
          color: drag ? "#fff" : "#000",
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        <Upload size={11} />
        <span>Drop SVG</span>
      </button>

      {imports.length > 0 && (
        <div className="mt-3" style={{ border: "1px solid #000" }}>
          {imports.map((im, idx) => (
            <div
              key={im.id}
              className="flex items-center gap-2 px-2 py-2"
              style={{ borderTop: idx === 0 ? "none" : "1px solid #000" }}
            >
              <button
                onClick={() => onUpdate(im.id, { enabled: !im.enabled })}
                style={{
                  width: 12,
                  height: 12,
                  border: "1px solid #000",
                  background: im.enabled ? "#000" : "#fff",
                  flexShrink: 0,
                  padding: 0,
                  cursor: "pointer",
                }}
                aria-label="toggle"
              />
              <svg
                viewBox={im.viewBox}
                style={{ width: 20, height: 20, color: "#000", flexShrink: 0 }}
                dangerouslySetInnerHTML={{ __html: im.body }}
              />
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={im.name}
                >
                  {im.name}
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(im.weight * 100)}
                  onChange={(e) =>
                    onUpdate(im.id, { weight: parseInt(e.target.value, 10) / 100 })
                  }
                  style={{ width: "100%", accentColor: "#000" }}
                />
              </div>
              <button
                onClick={() => onRemove(im.id)}
                aria-label="remove"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
