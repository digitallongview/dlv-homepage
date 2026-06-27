import { useEffect, useRef, useState } from 'react'
import SectionHeading from '../SectionHeading'
import { useStrings, useServiceText, type ServiceId } from '../../i18n/content'

// ─── Data (layout only — copy lives in the i18n catalogue, keyed by id) ────────

type Side = 'left' | 'right'

type Service = {
  id:   ServiceId
  icon: string
  side: Side
}

const SERVICES: Service[] = [
  { id: 'programmierung', icon: '/assets/RetroPC.webp',   side: 'left'  },
  { id: 'immersive',      icon: '/assets/XR-Media.webp',  side: 'right' },
  { id: 'marketing',      icon: '/assets/Megaphone.webp', side: 'left'  },
  { id: 'grafik',         icon: '/assets/Graphics.webp',  side: 'right' },
  { id: 'gamification',   icon: '/assets/Joystick.webp',  side: 'left'  },
  { id: '3d',             icon: '/assets/Artefact.webp',  side: 'right' },
  { id: 'langzeit',       icon: '/assets/clock.webp',     side: 'left'  },
]

// ─── Scroll-trigger hook ──────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function CtaButton({ label }: { label: string }) {
  return (
    <a
      href="#kontakt"
      className="group inline-flex h-[44px] w-fit items-center gap-2 rounded-full px-6
                 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white
                 transition-all duration-200
                 hover:brightness-110 hover:shadow-[0_8px_24px_-8px_rgba(93,70,132,0.6)]
                 focus:outline-none focus:ring-4 focus:ring-lavender/40 active:scale-[0.97]"
      style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
    >
      {label}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, isLast = false }: { service: Service; isLast?: boolean }) {
  const { ref, inView } = useInView()
  const txt = useServiceText()[service.id]
  const isLeft = service.side === 'left'
  const imgW    = service.id === 'marketing'    ? '82%'
               : service.id === '3d'           ? '62%'
               : service.id === 'langzeit'     ? '170%'  // Taschenuhr: wächst über die Spalte in den Schutzraum
               : service.id === 'gamification' ? '125%'  // Controller: etwas größer
               : '100%'
  const imgMaxH = service.id === 'langzeit'  ? 'min(84vh, 720px)' : 'min(62vh, 520px)'

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-cream"
      style={{ minHeight: isLast ? '60vh' : '88vh' }}
    >
      {/* ── Polygon band — tip-first entry, overshoots so tip is clipped ─── */}
      {/*  Wrapper is 110 % wide and offset so it extends 10 % past the       */}
      {/*  boundary the polygon shoots INTO.  overflow-hidden on the card      */}
      {/*  clips the leading tip, creating the truncated-triangle look.        */}
      {/*                                                                       */}
      {/*  Violet  → shoots RIGHT→LEFT, tip leads into LEFT  boundary          */}
      {/*  Magenta → shoots LEFT→RIGHT, tip leads into RIGHT boundary          */}
      {isLeft ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-[10%] w-[110%] transition-transform duration-[800ms] ease-out"
          style={{ transform: inView ? 'translateX(0)' : 'translateX(110vw)' }}
        >
          <img
            src="/assets/PolyViolet.webp"
            draggable={false}
            className="h-full w-full select-none object-fill"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[110%] transition-transform duration-[800ms] ease-out"
          style={{ transform: inView ? 'translateX(0)' : 'translateX(-110vw)' }}
        >
          <img
            src="/assets/PolyMagenta.webp"
            draggable={false}
            className="h-full w-full select-none object-fill"
          />
        </div>
      )}

      {/* ── Content — fades in 300 ms after polygon starts sliding ──────── */}
      <div
        className="relative z-10 flex h-full items-center"
        style={{
          minHeight: 'inherit',
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.5s ease-out 0.3s',
        }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16 sm:px-10">
          <div className="grid grid-cols-12 items-center gap-4 lg:gap-6">

            {isLeft ? (
              <>
                {/* ── Button (3 cols) — at the narrow tip side ── */}
                <div className="col-span-3 flex items-center justify-start">
                  <CtaButton label={txt.cta} />
                </div>

                {/* ── Icon (4 cols) — centered in the middle ── */}
                <div className="col-span-4 flex items-center justify-center">
                  <img
                    src={service.icon}
                    alt={txt.title}
                    draggable={false}
                    className="select-none object-contain"
                    style={{ width: imgW, maxHeight: imgMaxH }}
                  />
                </div>

                {/* ── Text (5 cols) — at the wide base of the wedge ── */}
                <div className="col-span-5 pl-4">
                  <h3 className="font-sans text-[clamp(17px,1.7vw,21px)] font-semibold leading-tight tracking-tight text-ink">
                    {txt.title}
                  </h3>
                  <p className="mt-4 font-serif text-[13px] leading-[1.6] text-ink/72">
                    {txt.body}
                  </p>
                  {txt.body2 && (
                    <p className="mt-3 font-serif text-[13px] leading-[1.6] text-ink/72">
                      {txt.body2}
                    </p>
                  )}
                  {txt.body3 && (
                    <p className="mt-3 font-serif text-[13px] leading-[1.6] text-ink/72">
                      {txt.body3}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* ── Text (5 cols) — at the wide base of the wedge ── */}
                <div className="col-span-5 pr-4">
                  <h3 className="font-sans text-[clamp(17px,1.7vw,21px)] font-semibold leading-tight tracking-tight text-ink">
                    {txt.title}
                  </h3>
                  <p className="mt-4 font-serif text-[13px] leading-[1.6] text-ink/72">
                    {txt.body}
                  </p>
                  {txt.body2 && (
                    <p className="mt-3 font-serif text-[13px] leading-[1.6] text-ink/72">
                      {txt.body2}
                    </p>
                  )}
                  {txt.body3 && (
                    <p className="mt-3 font-serif text-[13px] leading-[1.6] text-ink/72">
                      {txt.body3}
                    </p>
                  )}
                </div>

                {/* ── Icon (4 cols) — centered in the middle ── */}
                <div className="col-span-4 flex items-center justify-center">
                  <img
                    src={service.icon}
                    alt={txt.title}
                    draggable={false}
                    className="select-none object-contain"
                    style={{ width: imgW, maxHeight: imgMaxH }}
                  />
                </div>

                {/* ── Button (3 cols) — at the narrow tip side ── */}
                <div className="col-span-3 flex items-center justify-end">
                  <CtaButton label={txt.cta} />
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SectionLeistungen() {
  const s = useStrings()
  return (
    <section id="leistungen" className="scroll-mt-24 bg-cream">

      {/* Section heading above the cards */}
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-20 sm:px-10 sm:pt-24">
        <SectionHeading eyebrow={s.sections.leistungenEyebrow} title={s.sections.leistungenTitle} />
      </div>

      {/* 7 service cards, alternating violet-left / magenta-right */}
      {SERVICES.map((service, i) => (
        <ServiceCard key={service.id} service={service} isLast={i === SERVICES.length - 1} />
      ))}

    </section>
  )
}
