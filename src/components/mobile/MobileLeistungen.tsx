import { useCallback, useRef, useState, type TouchEvent } from 'react'
import { Dots } from './carousel'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useStrings, useServiceText, type ServiceId } from '../../i18n/content'

// Layout only — copy lives in the i18n catalogue, keyed by id.
type Service = {
  id: ServiceId
  icon: string
  /** Optical balancing — some PNGs carry a lot of empty space (e.g. the watch + chain). */
  scale: number
}

const SERVICES: Service[] = [
  { id: 'programmierung', icon: '/assets/RetroPC.webp',   scale: 1    },
  { id: 'immersive',      icon: '/assets/XR-Media.webp',  scale: 1    },
  { id: 'marketing',      icon: '/assets/Megaphone.webp', scale: 0.92 },
  { id: 'grafik',         icon: '/assets/Graphics.webp',  scale: 1    },
  { id: 'gamification',   icon: '/assets/Joystick.webp',  scale: 1.12 },
  { id: '3d',             icon: '/assets/Artefact.webp',  scale: 0.85 },
  { id: 'langzeit',       icon: '/assets/clock.webp',     scale: 1.4  },
]

type Tone = 'violet' | 'magenta'

/**
 * Vertical "spotlight" cone behind each panel. Same shape & position on every
 * card so the wedges read as a uniform set; colour alternates violet ↔ magenta
 * just like the desktop PolyViolet / PolyMagenta bands. Narrow apex sits behind
 * the icon and fans down past the CTA, fading out at the bottom and the edges.
 */
const CONE: Record<Tone, string> = {
  violet:
    'linear-gradient(180deg, rgba(140,116,170,0.42) 0%, rgba(178,155,208,0.24) 36%, rgba(178,155,208,0.08) 74%, rgba(178,155,208,0) 100%)',
  magenta:
    'linear-gradient(180deg, rgba(199,116,170,0.40) 0%, rgba(214,150,193,0.22) 36%, rgba(214,150,193,0.08) 74%, rgba(214,150,193,0) 100%)',
}

function ServicePanel({ s, tone }: { s: Service; tone: Tone }) {
  const txt = useServiceText()[s.id]
  return (
    <div className="relative flex w-full flex-none flex-col items-center px-7 min-[800px]:px-10">
      {/* Phone spotlight cone — vertical layout only; hidden once the slide goes horizontal */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[8%] bottom-[2%] -translate-x-1/2 blur-[3px] min-[800px]:hidden"
        style={{
          width: 'min(440px, 88%)',
          clipPath: 'polygon(50% 0, 100% 100%, 0% 100%)',
          background: CONE[tone],
        }}
      />

      {/* ≥800px: image | copy | CTA in a row, vertically centred at image height.
          Below 800px: stacked & centred (phone carousel). */}
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center text-center min-[520px]:max-w-[560px] min-[800px]:max-w-[960px] min-[800px]:flex-row min-[800px]:items-center min-[800px]:gap-8 min-[800px]:text-left">
        {/* Spotlight wedge behind the icon — horizontal layout only (the vertical
            cone above is hidden ≥800). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] blur-[4px] min-[800px]:block"
          style={{ clipPath: 'polygon(50% 0, 100% 100%, 0% 100%)', background: CONE[tone] }}
        />

        {/* Icon */}
        <div className="relative flex h-[clamp(150px,26vh,240px)] w-full items-center justify-center min-[800px]:h-[clamp(220px,40vh,360px)] min-[800px]:w-[40%] min-[800px]:flex-none min-[800px]:justify-center">
          <img
            src={s.icon}
            alt={txt.title}
            draggable={false}
            loading="lazy"
            className="relative max-h-full w-auto max-w-[80%] select-none object-contain min-[800px]:max-w-full"
            style={{ transform: `scale(${s.scale})` }}
          />
        </div>

        {/* Copy */}
        <div className="min-[800px]:flex-1">
          <h3 className="mt-[clamp(0.5rem,2vh,1rem)] font-sans text-[clamp(18px,2.1vw,22px)] font-semibold tracking-tight text-ink min-[800px]:mt-0">
            {txt.title}
          </h3>
          <p className="mt-[clamp(0.5rem,1.6vh,1rem)] font-serif text-[clamp(13.5px,1.5vw,15px)] leading-[1.66] text-ink/68">
            {txt.body}
          </p>
          {txt.body2 && (
            txt.body3 ? (
              <p className="mt-[clamp(0.4rem,1.2vh,0.85rem)] font-serif text-[clamp(13.5px,1.5vw,15px)] leading-[1.66] text-ink/68">
                {txt.body2}
              </p>
            ) : (
              <p className="mt-[clamp(0.4rem,1vh,0.75rem)] font-sans text-[clamp(13.5px,1.5vw,15px)] font-semibold leading-[1.5] text-ink/85">
                {txt.body2}
              </p>
            )
          )}
          {txt.body3 && (
            <p className="mt-[clamp(0.4rem,1.2vh,0.85rem)] font-serif text-[clamp(13.5px,1.5vw,15px)] leading-[1.66] text-ink/68">
              {txt.body3}
            </p>
          )}
        </div>

        {/* CTA — full-width pill stacked below on phones, edge-aligned auto-width pill in the row */}
        <div className="w-full min-[800px]:w-auto min-[800px]:flex-none">
          <a
            href="#kontakt"
            className="group mt-[clamp(1rem,3vh,1.75rem)] inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_34px_-12px_rgba(93,70,132,0.7)] active:scale-[0.98] min-[800px]:mt-0 min-[800px]:h-[52px] min-[800px]:w-auto min-[800px]:whitespace-nowrap min-[800px]:px-8 min-[800px]:text-[11px]"
            style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
          >
            {txt.cta}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function MobileLeistungen() {
  const s = useStrings()
  const count = SERVICES.length
  const [active, setActive] = useState(0)
  const goTo = useCallback(
    (i: number) => setActive(Math.max(0, Math.min(count - 1, i))),
    [count],
  )
  // <520px: dots only. ≥520px: arrows too.
  const stacked = useMediaQuery('(max-width: 519px)')

  // Touch-swipe gesture — NOT a scroll container, so the carousel has no nested
  // scroll. Slides move purely via transform; arrows/dots drive `active` too.
  const startX = useRef<number | null>(null)
  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    const x0 = startX.current
    startX.current = null
    if (x0 == null) return
    const dx = e.changedTouches[0].clientX - x0
    if (Math.abs(dx) > 45) goTo(active + (dx < 0 ? 1 : -1))
  }

  return (
    // justify-center: the whole heading→carousel→indicator block is centred as one
    // compact unit, so spare height lands above/below it instead of inflating gaps.
    <section id="leistungen" className="flex min-h-[100svh] scroll-mt-4 flex-col justify-center bg-cream pt-[clamp(2.5rem,5vh,4rem)] pb-[clamp(0.5rem,1.5vh,1rem)]">
      {/* Heading — two centred lines on phones, single line from 520px, left-aligned from 800px */}
      <div className="mx-auto w-full max-w-[440px] px-7 min-[520px]:max-w-[560px] min-[800px]:max-w-[960px] min-[800px]:px-10">
        <h2 className="text-center font-sans text-[clamp(30px,4.5vw,40px)] font-bold uppercase leading-[1.1] tracking-[0.02em] text-ink min-[800px]:text-left">
          {s.sections.leistungenTitle}
        </h2>
        <div className="mt-[clamp(0.75rem,2vh,1.25rem)] h-px w-full bg-gradient-to-r from-transparent via-ink/25 to-transparent min-[800px]:from-ink/35 min-[800px]:via-ink/12" />
      </div>

      {/* Transform carousel — overflow-x:clip gives a clean horizontal viewport with
          NO scroll container (no nested scroll). overflow-y stays visible, so the CTA
          shadow / graphics are never clipped into hard edges. Slides move via transform;
          navigation is arrows/dots plus a touch-swipe gesture. */}
      <div className="mt-[clamp(0.75rem,2.5vh,2rem)] overflow-x-clip pb-[clamp(1.5rem,3vh,2.5rem)]">
        <div
          className="flex items-center"
          style={{
            transform: `translateX(-${active * 100}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {SERVICES.map((s, i) => (
            <ServicePanel key={s.id} s={s} tone={i % 2 === 0 ? 'violet' : 'magenta'} />
          ))}
        </div>
      </div>

      {/* Indicator — dots stay visible on phones; arrows added from 520px up */}
      <Dots count={count} active={active} onSelect={goTo} showArrows={!stacked} className="mt-[clamp(0.75rem,2vh,1.5rem)]" />
    </section>
  )
}
