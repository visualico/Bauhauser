import { Composition, shapeToSvg } from "../lib/generator";
import type { ImportedSvg } from "../lib/svgImport";

type Props = {
  composition: Composition;
  imports?: ImportedSvg[];
  className?: string;
  bordered?: boolean;
};

export function Canvas({ composition, imports = [], className, bordered = true }: Props) {
  const { width, height, bg, shapes } = composition;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{
        background: bg,
        border: bordered ? "1px solid #000" : "none",
        display: "block",
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width={width} height={height} fill={bg} />
      <g
        dangerouslySetInnerHTML={{
          __html: shapes.map((s) => shapeToSvg(s, imports)).join(""),
        }}
      />
    </svg>
  );
}
