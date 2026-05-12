import clsx from 'clsx'

type Corner = 'tl' | 'tr' | 'bl' | 'br'
type Variant = 'tall' | 'sprig'

type Props = {
  corner: Corner
  /** "tall" = vertical botanical arrangement (top corners). "sprig" = horizontal flowering branch (bottom corners). */
  variant?: Variant
  tone?: 'forest' | 'cream' | 'forestSoft'
  className?: string
  /** Animation phase offset 0–3 so the corners don't sync. */
  phase?: 0 | 1 | 2 | 3
}

const cornerPositions: Record<Corner, string> = {
  tl: 'top-0 left-0 origin-top-left',
  tr: 'top-0 right-0 origin-top-right scale-x-[-1]',
  bl: 'bottom-0 left-0 origin-bottom-left scale-y-[-1]',
  br: 'bottom-0 right-0 origin-bottom-right scale-[-1]',
}

/**
 * Vintage botanical corner ornament. Two variants:
 *   - "tall"  → long winding stem with several leaf clusters, a fern frond, and
 *               a flower cluster near the top. For top-left/top-right of a section.
 *   - "sprig" → low horizontal flowering branch with leaves and buds. For bottom corners.
 * Both are mirrored / flipped via the corner transform so a single source SVG
 * works in all four positions.
 */
export default function FloralOrnament({
  corner,
  variant = 'tall',
  tone = 'forest',
  className,
  phase = 0,
}: Props) {
  const colorClass =
    tone === 'forest'
      ? 'text-forest/70'
      : tone === 'forestSoft'
        ? 'text-forest/45'
        : 'text-cream/85'

  const sizeClass =
    variant === 'tall'
      ? 'h-44 w-44 md:h-64 md:w-64 lg:h-72 lg:w-72'
      : 'h-28 w-44 md:h-32 md:w-56'

  return (
    <div
      className={clsx(
        'pointer-events-none absolute animate-sway-slow',
        sizeClass,
        cornerPositions[corner],
        colorClass,
        className,
      )}
      style={{ animationDelay: `${phase * -2}s` }}
      aria-hidden="true"
    >
      {variant === 'tall' ? <TallBotanical /> : <HorizontalSprig />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* TallBotanical — vertical arrangement for top corners. ViewBox 200x260. */
/* ------------------------------------------------------------------ */
function TallBotanical() {
  return (
    <svg
      viewBox="0 0 200 260"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* === Main central stem, curving outward from corner === */}
      <path d="M 12 8 C 30 28, 48 60, 60 100 S 78 180, 92 240" />

      {/* === Secondary branches off the main stem === */}
      <path d="M 30 30 C 50 38, 70 50, 88 70" />
      <path d="M 50 80 C 75 88, 95 100, 112 122" />
      <path d="M 65 130 C 90 138, 110 150, 128 172" />
      <path d="M 80 185 C 100 192, 118 202, 134 220" />
      <path d="M 20 50 C 36 70, 46 95, 52 120" />
      <path d="M 42 110 C 55 135, 60 158, 64 180" />

      {/* === Tendril curls === */}
      <path d="M 88 70 q 8 -16 20 -10 q 8 6 0 16 q -10 4 -16 -4" />
      <path d="M 112 122 q 12 -8 22 0 q 4 12 -8 16 q -10 -2 -12 -12" />
      <path d="M 128 172 q -2 -16 12 -18 q 12 4 8 16 q -8 8 -18 4" />
      <path d="M 52 120 q -14 -2 -14 -14 q 4 -10 14 -6 q 8 6 4 16" />

      {/* === Long elongated leaves with central vein === */}
      {/* Leaf 1 — near top */}
      <g>
        <path d="M 22 18 q 12 -8 20 0 q -4 10 -14 10 q -8 -2 -6 -10 z" />
        <path d="M 24 23 L 38 22" strokeWidth="0.6" opacity="0.7" />
      </g>
      {/* Leaf 2 */}
      <g>
        <path d="M 38 45 q 14 -7 22 2 q -4 11 -16 10 q -8 -3 -6 -12 z" />
        <path d="M 40 50 L 56 50" strokeWidth="0.6" opacity="0.7" />
      </g>
      {/* Leaf 3 */}
      <g>
        <path d="M 56 85 q 16 -6 24 4 q -5 12 -18 10 q -9 -3 -6 -14 z" />
        <path d="M 58 92 L 76 91" strokeWidth="0.6" opacity="0.7" />
      </g>
      {/* Leaf 4 */}
      <g>
        <path d="M 74 130 q 17 -5 25 6 q -5 12 -19 10 q -9 -4 -6 -16 z" />
        <path d="M 76 138 L 95 137" strokeWidth="0.6" opacity="0.7" />
      </g>
      {/* Leaf 5 */}
      <g>
        <path d="M 86 180 q 17 -4 25 8 q -6 12 -20 9 q -9 -5 -5 -17 z" />
        <path d="M 88 188 L 107 187" strokeWidth="0.6" opacity="0.7" />
      </g>
      {/* Leaf 6 — lower */}
      <g>
        <path d="M 98 225 q 16 -3 24 10 q -7 12 -20 8 q -8 -6 -4 -18 z" />
        <path d="M 100 234 L 118 234" strokeWidth="0.6" opacity="0.7" />
      </g>

      {/* === Side-branch leaves (smaller) === */}
      <path d="M 30 32 q 8 -3 12 4 q -3 6 -10 5 q -4 -2 -2 -9 z" />
      <path d="M 60 92 q 9 -3 13 5 q -3 7 -11 5 q -5 -3 -2 -10 z" />
      <path d="M 88 144 q 10 -2 14 7 q -3 7 -12 5 q -5 -3 -2 -12 z" />
      <path d="M 110 195 q 10 -1 14 9 q -4 7 -13 4 q -5 -4 -1 -13 z" />

      {/* === Fern frond near top === */}
      <g opacity="0.85">
        <path d="M 70 22 q 14 -10 28 -2 q -2 14 -16 14 q -10 -2 -12 -12" />
        <path d="M 76 18 l 4 8" strokeWidth="0.5" />
        <path d="M 82 16 l 4 10" strokeWidth="0.5" />
        <path d="M 88 16 l 4 10" strokeWidth="0.5" />
        <path d="M 94 18 l 4 8" strokeWidth="0.5" />
      </g>

      {/* === Flower cluster — small filled blossoms === */}
      <g>
        <circle cx="42" cy="14" r="2.6" fill="currentColor" />
        <circle cx="48" cy="22" r="2" fill="currentColor" />
        <circle cx="36" cy="22" r="2" fill="currentColor" />
        <circle cx="42" cy="28" r="2.2" fill="currentColor" />
        <circle cx="42" cy="20" r="0.9" fill="currentColor" opacity="0.4" />
        {/* Petal hairlines */}
        <path d="M 42 11 q 3 0 6 3" strokeWidth="0.6" opacity="0.7" />
        <path d="M 42 11 q -3 0 -6 3" strokeWidth="0.6" opacity="0.7" />
      </g>

      {/* === Small berry cluster mid-branch === */}
      <g>
        <circle cx="115" cy="115" r="1.6" fill="currentColor" />
        <circle cx="120" cy="120" r="1.4" fill="currentColor" />
        <circle cx="112" cy="121" r="1.4" fill="currentColor" />
        <circle cx="118" cy="126" r="1.2" fill="currentColor" />
      </g>

      {/* === Stippling specks throughout for ink-illustration texture === */}
      <circle cx="20" cy="40" r="0.7" fill="currentColor" opacity="0.55" />
      <circle cx="45" cy="70" r="0.6" fill="currentColor" opacity="0.55" />
      <circle cx="70" cy="105" r="0.6" fill="currentColor" opacity="0.55" />
      <circle cx="55" cy="150" r="0.5" fill="currentColor" opacity="0.55" />
      <circle cx="92" cy="160" r="0.6" fill="currentColor" opacity="0.55" />
      <circle cx="75" cy="200" r="0.5" fill="currentColor" opacity="0.55" />
      <circle cx="105" cy="210" r="0.6" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* HorizontalSprig — low horizontal flowering branch. ViewBox 200x140. */
/* ------------------------------------------------------------------ */
function HorizontalSprig() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Primary stem along the bottom */}
      <path d="M 6 130 Q 50 110, 100 100 T 195 78" />
      {/* Secondary stem */}
      <path d="M 18 132 Q 55 122, 90 116 T 175 100" />

      {/* Leaves — pairs along the stem */}
      <g>
        <path d="M 22 124 q 8 -10 18 -6 q -2 11 -12 11 q -8 -1 -6 -5 z" />
        <path d="M 28 122 L 36 119" strokeWidth="0.5" opacity="0.7" />
      </g>
      <g>
        <path d="M 50 115 q 9 -11 20 -6 q -2 12 -14 12 q -8 -1 -6 -6 z" />
        <path d="M 56 112 L 65 110" strokeWidth="0.5" opacity="0.7" />
      </g>
      <g>
        <path d="M 80 107 q 10 -12 22 -5 q -3 12 -15 12 q -9 -2 -7 -7 z" />
        <path d="M 88 104 L 98 101" strokeWidth="0.5" opacity="0.7" />
      </g>
      <g>
        <path d="M 115 100 q 11 -12 22 -4 q -2 13 -15 12 q -9 -2 -7 -8 z" />
        <path d="M 122 96 L 132 94" strokeWidth="0.5" opacity="0.7" />
      </g>
      <g>
        <path d="M 150 90 q 11 -12 22 -3 q -2 13 -15 12 q -9 -3 -7 -9 z" />
        <path d="M 156 86 L 166 84" strokeWidth="0.5" opacity="0.7" />
      </g>

      {/* Lower-row leaves (pairs) */}
      <path d="M 35 132 q 6 4 4 12 q -7 1 -10 -4 q 0 -6 6 -8 z" opacity="0.85" />
      <path d="M 70 124 q 7 3 5 13 q -7 1 -11 -4 q 0 -7 6 -9 z" opacity="0.85" />
      <path d="M 110 117 q 7 3 6 14 q -8 1 -12 -4 q 0 -8 6 -10 z" opacity="0.85" />
      <path d="M 148 108 q 8 3 6 14 q -8 1 -12 -4 q 0 -8 6 -10 z" opacity="0.85" />

      {/* Tendril curl */}
      <path d="M 100 92 q -2 -12 10 -14 q 12 2 8 14 q -8 5 -14 -2" />

      {/* Flower clusters — small blossoms at endpoints */}
      <g>
        <circle cx="178" cy="74" r="2.2" fill="currentColor" />
        <circle cx="184" cy="78" r="1.8" fill="currentColor" />
        <circle cx="172" cy="80" r="1.6" fill="currentColor" />
        <circle cx="180" cy="84" r="1.4" fill="currentColor" />
      </g>

      {/* Mid-branch berry */}
      <g>
        <circle cx="105" cy="106" r="1.4" fill="currentColor" />
        <circle cx="110" cy="111" r="1.2" fill="currentColor" />
        <circle cx="100" cy="111" r="1.2" fill="currentColor" />
      </g>

      {/* Stippling */}
      <circle cx="40" cy="135" r="0.5" fill="currentColor" opacity="0.55" />
      <circle cx="75" cy="130" r="0.5" fill="currentColor" opacity="0.55" />
      <circle cx="120" cy="120" r="0.5" fill="currentColor" opacity="0.55" />
      <circle cx="160" cy="105" r="0.5" fill="currentColor" opacity="0.55" />
    </svg>
  )
}
