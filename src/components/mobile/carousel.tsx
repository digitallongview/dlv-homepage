import { useCallback, useEffect, useId, useRef, useState } from 'react'

/** Shared tilt (deg) for the diagonal indicator, its swipe prompt and the phone portraits. */
export const SWIPE_TILT = -8

/**
 * Horizontal scroll-snap carousel driven by native touch scrolling.
 * `trackRef` goes on the flex track; each child panel must be `w-full flex-none snap-center`.
 * `active` reflects the snapped panel; `goTo` scrolls to one (dots / arrows).
 */
export function useCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!el.clientWidth) return
        setActive(Math.round(el.scrollLeft / el.clientWidth))
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, i)
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }, [])

  return { trackRef, active, goTo }
}

const GRAD = 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)'

function Dot({ on, onClick, i }: { on: boolean; onClick: () => void; i: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Zu Ansicht ${i + 1}`}
      aria-current={on ? 'true' : undefined}
      className="grid h-[18px] w-[18px] flex-none place-items-center rounded-full border-[1.5px] transition-all duration-300"
      style={{
        borderColor: on ? '#5d4684' : 'rgba(93,70,132,0.4)',
        // Inactive dots are filled with the page cream (not transparent) so the
        // diagonal wedge never flashes through the empty rings.
        background: on ? 'radial-gradient(circle at 35% 30%, #8c74aa, #5d4684)' : '#f7eced',
        boxShadow: on ? '0 2px 8px -2px rgba(93,70,132,0.6)' : 'none',
      }}
    />
  )
}

/** Round gradient arrow button (← / →), matching the CTA pills. Disabled at the ends. */
function Arrow({ dir, onClick, disabled }: { dir: 'left' | 'right'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Vorherige Ansicht' : 'Nächste Ansicht'}
      className="grid h-9 w-9 flex-none place-items-center rounded-full text-white shadow-[0_6px_16px_-6px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:shadow-none"
      style={{ background: GRAD }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        {dir === 'left' ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  )
}

/** Hollow ring → filled dots, optionally flanked by clickable ← / → arrows. */
export function Dots({
  count,
  active,
  onSelect,
  label,
  showArrows = false,
  align = 'center',
  className = '',
}: {
  count: number
  active: number
  onSelect: (i: number) => void
  label?: string
  showArrows?: boolean
  align?: 'center' | 'start'
  className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <p
          className="mb-3 select-none text-center font-serif text-[12.5px] italic text-lavender-dark/80"
          style={{ transform: 'rotate(-3deg)' }}
        >
          {label}
        </p>
      )}
      <div className={`flex items-center gap-3.5 ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
        {showArrows && <Arrow dir="left" onClick={() => onSelect(active - 1)} disabled={active <= 0} />}
        {Array.from({ length: count }).map((_, i) => (
          <Dot key={i} i={i} on={i === active} onClick={() => onSelect(i)} />
        ))}
        {showArrows && <Arrow dir="right" onClick={() => onSelect(active + 1)} disabled={active >= count - 1} />}
      </div>
    </div>
  )
}

/**
 * Phone-only indicator: dots arranged along a slight up-right diagonal (parallel
 * to the "Swipe …" prompt) with a violet wedge running behind the indicator line.
 * The swipe prompt sits tilted above the dots and only flashes in briefly
 * (`hintVisible`) so it nudges the first swipe without lingering.
 */
export function DiagonalDots({
  count,
  active,
  onSelect,
  label,
  hintVisible = true,
  hintCollapsed = false,
  className = '',
}: {
  count: number
  active: number
  onSelect: (i: number) => void
  label?: string
  hintVisible?: boolean
  /** Once the prompt is dismissed, collapse the space it held so the dots move up. */
  hintCollapsed?: boolean
  className?: string
}) {
  const gradId = useId()
  return (
    <div className={`mx-auto ${className}`} style={{ width: 'min(84%, 300px)' }}>
      {label && (
        <div
          style={{
            maxHeight: hintCollapsed ? 0 : 54,
            marginBottom: hintCollapsed ? 0 : 16,
            // visible while shown so the tilted prompt isn't clipped at its raised
            // top-right corner; the fade-out masks the overflow during the collapse
            overflow: 'visible',
            transition: 'max-height 0.5s ease, margin-bottom 0.5s ease',
          }}
        >
          <p
            className="mx-auto max-w-[150px] select-none text-center font-serif text-[12.5px] italic leading-snug text-lavender-dark/85"
            style={{
              transform: `rotate(${SWIPE_TILT}deg)`,
              opacity: hintVisible ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            {label}
          </p>
        </div>
      )}
      <div className="relative" style={{ transform: `rotate(${SWIPE_TILT}deg)` }}>
        {/* Violet wedge running the full width behind all three dots; its right tip
            is rounded so it never pokes out past the end dot as a sharp point. */}
        <svg
          aria-hidden
          preserveAspectRatio="none"
          viewBox="0 0 100 12"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-3 w-full -translate-y-1/2"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(140,116,170,0.22)" />
              <stop offset="50%" stopColor="rgba(140,116,170,0.46)" />
              <stop offset="100%" stopColor="rgba(93,70,132,0.62)" />
            </linearGradient>
          </defs>
          <path d="M0 3 L94 0.5 Q100 0.5 100 4.5 L100 7.5 Q100 11.5 94 11.5 L0 9 Z" fill={`url(#${gradId})`} />
        </svg>
        <div className="relative flex items-center justify-between">
          {Array.from({ length: count }).map((_, i) => (
            <Dot key={i} i={i} on={i === active} onClick={() => onSelect(i)} />
          ))}
        </div>
      </div>
    </div>
  )
}
