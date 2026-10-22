type Shape = "star" | "circle" | "blob" | "square";
type Expression = "happy" | "calm" | "neutral" | "sad";

const SHAPE_FILL: Record<Shape, string> = {
  star: "var(--color-mood-yellow)",
  circle: "var(--color-mood-gold)",
  blob: "var(--color-mood-green)",
  square: "var(--color-mood-blue)",
};

// Vertical nudge so the face sits in the visual centre of each shape.
const FACE_OFFSET: Record<Shape, number> = {
  star: 4,
  circle: 0,
  blob: 0,
  square: 0,
};

const STAR_POINTS =
  "32,4 40.2,22.7 60.5,24.7 45.3,38.3 49.6,58.3 32,48 14.4,58.3 18.7,38.3 3.5,24.7 23.8,22.7";

const FACES: Record<Expression, string[]> = {
  happy: ["M21 30q4.5-5 9 0", "M34 30q4.5-5 9 0", "M24 39q8 8 16 0"],
  calm: ["M21 28q4.5 4.5 9 0", "M34 28q4.5 4.5 9 0", "M26 39q6 5 12 0"],
  neutral: ["M21 28h9", "M34 28h9", "M25 40h14"],
  sad: ["M21 28q4.5 4 9 0", "M34 28q4.5 4 9 0", "M25 44q7-6 14 0"],
};

/** Decorative mood face. Always pair it with a visible text label. */
export function MoodFace({
  shape,
  expression,
  className,
}: {
  shape: Shape;
  expression: Expression;
  className?: string;
}) {
  const fill = SHAPE_FILL[shape];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {shape === "star" && (
        <polygon
          points={STAR_POINTS}
          fill={fill}
          stroke={fill}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      )}
      {shape === "circle" && <circle cx="32" cy="32" r="29" fill={fill} />}
      {shape === "blob" && <ellipse cx="32" cy="32" rx="24" ry="30" fill={fill} />}
      {shape === "square" && (
        <rect x="3" y="3" width="58" height="58" rx="6" fill={fill} />
      )}
      <g
        transform={`translate(0 ${FACE_OFFSET[shape]})`}
        fill="none"
        stroke="#1b1813"
        strokeWidth="2.6"
        strokeLinecap="round"
      >
        {FACES[expression].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
