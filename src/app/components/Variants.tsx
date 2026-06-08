import { useMemo } from "react";
import { generate, type GenParams } from "../lib/generator";
import { Canvas } from "./Canvas";
import type { ImportedSvg } from "../lib/svgImport";

type Props = {
  params: GenParams;
  imports?: ImportedSvg[];
  onSelect: (seed: number) => void;
};

export function Variants({ params, imports = [], onSelect }: Props) {
  const seeds = useMemo(
    () =>
      [0, 1, 2, 3].map(
        (i) => (params.seed + (i + 1) * 9173) % 1_000_000,
      ),
    [params.seed],
  );
  return (
    <div
      className="flex items-center gap-2 px-8 py-3"
      style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: 0.5,
          marginRight: 8,
        }}
      >
        Variants
      </span>
      {seeds.map((s) => {
        const c = generate({ ...params, seed: s });
        return (
          <button
            key={s}
            onClick={() => onSelect(s)}
            title={`Seed ${s}`}
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#fff",
              padding: 0,
              cursor: "pointer",
              width: 60,
              height: 60,
              display: "flex",
            }}
          >
            <Canvas composition={c} imports={imports} bordered={false} />
          </button>
        );
      })}
    </div>
  );
}
