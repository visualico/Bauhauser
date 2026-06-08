import { useState, useRef, useEffect, useCallback } from "react";
import { Shuffle, Save, Download, Share2, Undo2, Redo2, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Canvas } from "./components/Canvas";
import { Variants } from "./components/Variants";
import { StartPage } from "./components/StartPage";
import { Gallery } from "./components/Gallery";
import { SaveDialog } from "./components/SaveDialog";
import {
  generate,
  shapeToSvg,
  GenParams,
  Composition,
  compositionToSvg,
  DEFAULT_PARAMS,
} from "./lib/generator";
import { loadGallery, saveGallery } from "./lib/storage";
import { readHashParams, writeHashParams } from "./lib/urlState";
import { PALETTES, getPalette } from "./lib/palettes";
import { SHAPES } from "./lib/shapes";
import type { ImportedSvg } from "./lib/svgImport";

function clampZoom(z: number): number {
  return Math.max(0.25, Math.min(3, z));
}

const micro: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
};

const toolBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 8px",
  transition: "border-color 120ms",
};

const zoomBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  padding: 4,
};

type View = "editor" | "start";

function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000);
}

export default function App() {
  const [view, setView] = useState<View>("editor");
  const [params, setParamsRaw] = useState<GenParams>(() => {
    const fromUrl = readHashParams();
    return fromUrl
      ? ({ ...DEFAULT_PARAMS, ...fromUrl } as GenParams)
      : { ...DEFAULT_PARAMS, seed: randomSeed() };
  });
  const [gallery, setGallery] = useState<Composition[]>(() => loadGallery());
  const [locks, setLocks] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [pngScale, setPngScale] = useState(2);
  const [saveOpen, setSaveOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const historyRef = useRef<GenParams[]>([params]);
  const historyIdxRef = useRef(0);
  const suppressHistoryRef = useRef(false);

  const setParams = useCallback((patch: Partial<GenParams>) => {
    setParamsRaw((prev) => {
      const next = { ...prev, ...patch };
      if (!suppressHistoryRef.current) {
        const hist = historyRef.current.slice(0, historyIdxRef.current + 1);
        hist.push(next);
        historyRef.current = hist;
        historyIdxRef.current = hist.length - 1;
      }
      return next;
    });
  }, []);

  const canUndo = historyIdxRef.current > 0;
  const canRedo = historyIdxRef.current < historyRef.current.length - 1;

  function undo() {
    if (!canUndo) return;
    suppressHistoryRef.current = true;
    const idx = historyIdxRef.current - 1;
    historyIdxRef.current = idx;
    setParamsRaw(historyRef.current[idx]);
    suppressHistoryRef.current = false;
  }

  function redo() {
    if (!canRedo) return;
    suppressHistoryRef.current = true;
    const idx = historyIdxRef.current + 1;
    historyIdxRef.current = idx;
    setParamsRaw(historyRef.current[idx]);
    suppressHistoryRef.current = false;
  }

  useEffect(() => {
    writeHashParams(params);
  }, [params]);

  useEffect(() => {
    saveGallery(gallery);
  }, [gallery]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      if (e.key === "r" && !e.metaKey && !e.ctrlKey) { e.preventDefault(); handleRandomize(); }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSaveOpen(true); }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); setZoom((z) => clampZoom(z * 1.25)); }
      if (e.key === "-") { e.preventDefault(); setZoom((z) => clampZoom(z / 1.25)); }
      if (e.key === "0") { e.preventDefault(); setZoom(1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const composition = generate(params);
  const imports = params.imports ?? [];

  function handleRandomize() {
    const next: Partial<GenParams> = {};
    if (!locks.has("seed")) next.seed = randomSeed();
    if (!locks.has("paletteId")) {
      next.paletteId = PALETTES[Math.floor(Math.random() * PALETTES.length)].id;
    }
    if (!locks.has("enabledShapes")) {
      const count = Math.max(1, Math.floor(Math.random() * SHAPES.length));
      const shuffled = [...SHAPES].sort(() => Math.random() - 0.5);
      next.enabledShapes = shuffled.slice(0, count);
    }
    if (!locks.has("density")) next.density = Math.random();
    if (!locks.has("jitter")) next.jitter = Math.random();
    if (!locks.has("rotationChance")) next.rotationChance = Math.random();
    if (!locks.has("mergeChance")) next.mergeChance = Math.random() * 0.5;
    if (!locks.has("colorSpread")) {
      const palId = next.paletteId ?? params.paletteId;
      const pal = getPalette(palId);
      next.colorSpread = Math.max(1, Math.floor(Math.random() * pal.colors.length) + 1);
    }
    setParams(next);
  }

  function handleSave(name: string, author: string) {
    const svgBody = composition.shapes.map((s) => shapeToSvg(s, imports)).join("");
    const comp: Composition = {
      ...composition,
      id: crypto.randomUUID(),
      name,
      author,
      savedAt: Date.now(),
      svgBody,
      params,
    };
    setGallery((g) => [comp, ...g].slice(0, 200));
    setSaveOpen(false);
  }

  function handleDownloadSvg() {
    const svg = compositionToSvg(composition, imports);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bauhauser-${params.seed}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadPng() {
    const svg = compositionToSvg(composition, imports);
    const w = composition.width * pngScale;
    const h = composition.height * pngScale;
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((b) => {
        if (!b) return;
        const pngUrl = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `bauhauser-${params.seed}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }

  function handleToggleLock(key: string) {
    setLocks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleAddImport(im: ImportedSvg) {
    setParams({ imports: [...imports, im] });
  }

  function handleUpdateImport(id: string, patch: Partial<ImportedSvg>) {
    setParams({ imports: imports.map((im) => im.id === id ? { ...im, ...patch } : im) });
  }

  function handleRemoveImport(id: string) {
    setParams({ imports: imports.filter((im) => im.id !== id) });
  }

  function handleSelectVariant(seed: number) {
    setParams({ seed });
  }

  function handleGallerySelect(c: Composition) {
    setParams(c.params);
    setView("editor");
  }

  function handleDeleteGalleryItem(id: string) {
    setGallery((g) => g.filter((c) => c.id !== id));
  }

  function handleDuplicateGalleryItem(c: Composition) {
    setGallery((g) => [{ ...c, id: crypto.randomUUID(), savedAt: Date.now() }, ...g].slice(0, 200));
  }

  if (view === "start") {
    return (
      <StartPage
        items={gallery}
        imports={imports}
        onOpen={(c) => { setParams(c.params); setView("editor"); }}
        onDelete={handleDeleteGalleryItem}
        onDuplicate={handleDuplicateGalleryItem}
        onNew={() => setView("editor")}
      />
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{ height: "100vh", background: "#e8e8e8", color: "#000", overflow: "hidden" }}
    >
      <header
        className="flex items-center justify-end px-4 flex-shrink-0"
        style={{
          height: 44,
          background: "#e8e8e8",
          borderBottom: "1px solid rgba(0,0,0,0.10)",
          zIndex: 10,
          gap: 2,
        }}
      >
        <button onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (⌘Z)"
          style={{ ...toolBtn, opacity: canUndo ? 1 : 0.3 }}>
          <Undo2 size={13} />
        </button>
        <button onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo (⌘⇧Z)"
          style={{ ...toolBtn, opacity: canRedo ? 1 : 0.3 }}>
          <Redo2 size={13} />
        </button>
        <span style={{ width: 1, height: 16, background: "rgba(0,0,0,0.15)", margin: "0 2px", flexShrink: 0 }} />
        <button onClick={handleRandomize} style={toolBtn} aria-label="Randomize" title="Randomize (R)">
          <Shuffle size={13} />
        </button>
        <button onClick={() => setSaveOpen(true)} style={toolBtn} aria-label="Save" title="Save (⌘S)">
          <Save size={13} />
        </button>
        <button onClick={handleDownloadSvg} style={toolBtn} title="Download SVG">
          <Download size={13} />
          <span style={{ ...micro, marginLeft: 4 }}>SVG</span>
        </button>
        <button onClick={handleDownloadPng} style={toolBtn} title="Download PNG">
          <Download size={13} />
          <span style={{ ...micro, marginLeft: 4 }}>PNG</span>
        </button>
        <button onClick={handleShare} style={toolBtn} title="Copy share link">
          <Share2 size={13} />
        </button>
        <button
          onClick={() => setShowGallery((x) => !x)}
          style={{
            ...toolBtn,
            background: showGallery ? "#000" : "transparent",
            color: showGallery ? "#fff" : "#000",
          }}
          title="Toggle gallery"
        >
          <span style={micro}>Gallery ({gallery.length})</span>
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar
          params={params}
          onChange={setParams}
          onHome={() => setView("start")}
          onAddImport={handleAddImport}
          onUpdateImport={handleUpdateImport}
          onRemoveImport={handleRemoveImport}
          locks={locks}
          onToggleLock={handleToggleLock}
        />

        <main className="flex-1 flex flex-col min-w-0" style={{ background: "#e8e8e8", overflow: "hidden" }}>
          <div
            className="flex-1 flex items-center justify-center overflow-auto"
            style={{ padding: 32 }}
          >
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 100ms" }}>
              <Canvas composition={composition} imports={imports} bordered />
            </div>
          </div>

          <Variants params={params} imports={imports} onSelect={handleSelectVariant} />

          <div
            className="flex items-center justify-end gap-2 px-5 flex-shrink-0"
            style={{
              height: 38,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              background: "#fff",
            }}
          >
            <button onClick={() => setZoom((z) => clampZoom(z / 1.25))} style={zoomBtn} title="Zoom out (-)">
              <ZoomOut size={12} />
            </button>
            <span style={{ ...micro, minWidth: 36, textAlign: "center" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom((z) => clampZoom(z * 1.25))} style={zoomBtn} title="Zoom in (+)">
              <ZoomIn size={12} />
            </button>
            <button onClick={() => setZoom(1)} style={zoomBtn} title="Reset zoom (0)">
              <Maximize size={12} />
            </button>
            <span style={{ width: 1, height: 16, background: "rgba(0,0,0,0.1)", margin: "0 4px" }} />
            <span style={{ ...micro, opacity: 0.4 }}>PNG ×</span>
            {([1, 2, 3, 4] as const).map((s) => (
              <button
                key={s}
                onClick={() => setPngScale(s)}
                style={{
                  ...micro,
                  border: pngScale === s ? "1px solid #000" : "1px solid rgba(0,0,0,0.15)",
                  background: pngScale === s ? "#000" : "#fff",
                  color: pngScale === s ? "#fff" : "#000",
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
              >
                {s}×
              </button>
            ))}
          </div>
        </main>

        {showGallery && (
          <Gallery items={gallery} imports={imports} onSelect={handleGallerySelect} />
        )}
      </div>

      {saveOpen && (
        <SaveDialog params={params} onSave={handleSave} onClose={() => setSaveOpen(false)} />
      )}
    </div>
  );
}
