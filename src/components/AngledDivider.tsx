type Props = {
  /** Höhe der Schrägen in px */
  height?: number
  /** Bezugs-Hintergrundfarbe — der Divider „malt" das Gegenstück */
  from?: string
  to?: string
  /** richtung der Schrägen */
  direction?: 'down-right' | 'down-left'
  className?: string
}

export default function AngledDivider({
  height = 90,
  from = '#f7eced',
  to = 'rgba(140,116,170,0.18)',
  direction = 'down-right',
  className = '',
}: Props) {
  const clip =
    direction === 'down-right'
      ? 'polygon(0 0, 100% 0, 100% 100%, 0 60%)'
      : 'polygon(0 0, 100% 0, 100% 60%, 0 100%)'

  return (
    <div
      aria-hidden
      className={`pointer-events-none relative w-full ${className}`}
      style={{ height, background: from }}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: clip,
          background: `linear-gradient(135deg, ${to}, transparent 70%)`,
        }}
      />
    </div>
  )
}
