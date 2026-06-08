import { Composition, shapeToSvg } from "../lib/generator";
import type { ImportedSvg } from "../lib/svgImport";

const MAX_DISPLAY = 640;

type Props = {
  composition: Composition;
  imports?: ImportedSvg[];
  bordered?: boolean;
  displaySize?: number;
};

export function Canvas({ composition, imports = [], bordered = true, displaySize = MAX_DISPLAY }: Props) {
  const { width, height, bg, shapes } = composition;
  const aspect = width / height;
  const displayW = aspect >= 1 ? displaySize : displaySize * aspect;
  const displayH = aspect >= 1 ? displaySize / aspect : displaySize;

  return (
    <svg
      width={displayW}
      height={displayH}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        display: "block",
        border: bordered ? "1px solid #000" : "none",
        flexShrink: 0,
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width={width} height={height} fill={bg} />
      <g dangerouslySetInnerHTML={{ __html: shapes.map((s) => shapeToSvg(s, imports)).join("") }} />
    </svg>
  );
}
