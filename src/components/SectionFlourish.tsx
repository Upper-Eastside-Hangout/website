import clsx from 'clsx'

type Props = {
  className?: string
  tone?: 'forest' | 'cream' | 'auto'
  /** Width preset — short for under-heading dividers, long for full separators. */
  width?: 'short' | 'long'
}

/**
 * Small vintage flourish — two thin rules flanking a diamond + leaflet, in the
 * style of a Victorian title page. Used under section headings to separate
 * heading and body, and between footer columns.
 */
export default function SectionFlourish({
  className,
  tone = 'auto',
  width = 'short',
}: Props) {
  const colorClass =
    tone === 'forest'
      ? 'text-forest/55'
      : tone === 'cream'
        ? 'text-cream/60'
        : '' // inherits from parent (auto)
  const widthClass = width === 'long' ? 'w-40 md:w-56' : 'w-24 md:w-32'

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={clsx('mx-auto flex items-center justify-center', widthClass, colorClass, className)}
    >
      <svg viewBox="0 0 200 16" className="h-3 w-full" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Left rule with terminal swoop */}
        <path d="M 6 8 L 78 8" />
        <path d="M 78 8 q 4 -3 8 -1" />
        {/* Left leaflet */}
        <path d="M 86 7 q 6 -3 10 1 q -3 4 -8 3 q -3 -1 -2 -4 z" fill="currentColor" opacity="0.7" />
        {/* Center diamond */}
        <path d="M 100 4 L 104 8 L 100 12 L 96 8 Z" fill="currentColor" />
        {/* Right leaflet */}
        <path d="M 114 7 q -6 -3 -10 1 q 3 4 8 3 q 3 -1 2 -4 z" fill="currentColor" opacity="0.7" />
        {/* Right rule */}
        <path d="M 114 8 q 4 -2 8 1" />
        <path d="M 122 8 L 194 8" />
        {/* Small dots either end */}
        <circle cx="6" cy="8" r="1" fill="currentColor" />
        <circle cx="194" cy="8" r="1" fill="currentColor" />
      </svg>
    </div>
  )
}
