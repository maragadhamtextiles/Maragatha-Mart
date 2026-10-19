import { useId } from "react";
import type { SareePalette } from "../data/products";

/**
 * A folded silk saree, drawn rather than photographed: the way sarees sit on
 * a shop shelf, with the body, a contrast border down one side and the pallu
 * across the foot. Every collection tile and hero slide uses it with its own
 * palette, so the silk pages look finished before a single product photo has
 * been uploaded, and never show a stock image of somebody else's saree.
 */
export function SareeArt({
  palette,
  className = "",
  title,
}: {
  palette: SareePalette;
  className?: string;
  title?: string;
}) {
  // Gradient and pattern ids must be unique per instance or every tile on the
  // page would paint with the first tile's colours.
  const uid = useId().replace(/:/g, "");
  const sheen = `sheen-${uid}`;
  const buttas = `buttas-${uid}`;
  const temple = `temple-${uid}`;

  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
        <pattern id={buttas} width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M11 6 L14 11 L11 16 L8 11 Z" fill={palette.butta} opacity="0.75" />
        </pattern>
        <pattern id={temple} width="12" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 10 L6 2 L12 10 Z" fill={palette.zari} />
        </pattern>
      </defs>

      {/* A second saree peeking out underneath, for depth. */}
      <rect x="28" y="30" width="156" height="196" rx="6" fill={palette.bodyShade} />
      <rect x="28" y="214" width="156" height="12" rx="3" fill={palette.zari} opacity="0.6" />

      {/* The folded saree. */}
      <rect x="16" y="14" width="156" height="196" rx="6" fill={palette.body} />
      <rect x="16" y="14" width="156" height="150" rx="6" fill={`url(#${buttas})`} />

      {/* Contrast border down the left, with its temple (gopuram) motif. */}
      <rect x="16" y="14" width="34" height="196" fill={palette.border} />
      <rect x="44" y="14" width="6" height="196" fill={palette.zari} />
      <rect x="20" y="14" width="2" height="196" fill={palette.zari} opacity="0.8" />
      <g transform="translate(50 14) rotate(90)">
        <rect x="0" y="0" width="196" height="10" fill={`url(#${temple})`} />
      </g>

      {/* The pallu: bands of zari across the foot. */}
      <rect x="16" y="164" width="156" height="46" fill={palette.bodyShade} />
      <rect x="16" y="166" width="156" height="5" fill={palette.zari} />
      <rect x="16" y="176" width="156" height="2" fill={palette.zari} opacity="0.85" />
      <rect x="16" y="184" width="156" height="12" fill={palette.zari} opacity="0.95" />
      <rect x="16" y="200" width="156" height="2" fill={palette.zari} opacity="0.85" />
      <g opacity="0.9">
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={58 + i * 10} cy={190} r="2" fill={palette.bodyShade} />
        ))}
      </g>

      {/* Silk sheen over everything, then a crisp fold edge. */}
      <rect x="16" y="14" width="156" height="196" rx="6" fill={`url(#${sheen})`} />
      <rect x="16" y="14" width="156" height="196" rx="6" fill="none" stroke="#000" strokeOpacity="0.15" />
    </svg>
  );
}
