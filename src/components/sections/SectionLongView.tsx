import { useEffect, useRef, useState } from 'react'
import SectionHeading from '../SectionHeading'

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

const FEATURES = [
  {
    title: 'Digitales Erbe bewahren',
    body: 'Wir nutzen immersive Medien (XR) und interaktive Erlebnisse, um Kultur digital, barrierefrei und ethisch für die Zukunft zu sichern.',
  },
  {
    title: 'Für Generationen gestalten',
    body: 'Wir bringen Langzeitdenken in die Praxis, damit Wissen und Kultur generationsgerecht Jahrzehnte überdauern.',
  },
  {
    title: 'Ganzheitliche Co-Creation',
    body: 'Wir gestalten Erlebnisse gemeinsam mit Menschen (Co-Creation) und richten den Blick auf das gesamte lebendige Umfeld (Life-Centred).',
  },
  {
    title: 'Digitale Entschleunigung',
    body: 'Wir nutzen digitale Vielfalt als bewussten Gegenpol zur heutigen Schnelllebigkeit — um an die zukünftigen Generationen anzuknüpfen.',
  },
]

/*
 * Text columns need to align with the max-w-[1200px] content area even though
 * the grid rows are full-viewport-width. Formula:
 *   (100vw - 1200px) / 2 + 40px  ← container margin + inner padding
 * max(24px, ...) clamps to a minimum on narrow viewports.
 */
const textPadX = 'max(24px, calc((100vw - 1200px) / 2 + 40px))'

/*
 * Below 1280px the fixed half-width image column makes the foreground objects
 * (telescope, VR headset) shrink and cluster in the far corner, leaving an
 * awkward gap to the text. `narrowPush` is 0 at ≥1280px — so the original wide
 * composition is left untouched — and grows as the viewport narrows. We feed it
 * into the objects so they stay large and pull inward toward the text; the cones
 * themselves keep their size. The clamp caps hold from ~1024px all the way down
 * to the 500px breakpoint (where the stacked mobile layout takes over), so the
 * objects keep a healthy size-relative-to-column instead of growing unbounded.
 */
const narrowPush = 'max(0px, (1280px - 100vw))'
const telescopeStyle = {
  height: `clamp(88%, calc(88% + ${narrowPush} * 0.22), 102%)`,
  right: `clamp(8%, calc(8% + ${narrowPush} * 0.18), 17%)`,
}
const vrStyle = {
  width: `clamp(58%, calc(58% + ${narrowPush} * 0.28), 72%)`,
  left: `clamp(4%, calc(4% + ${narrowPush} * 0.10), 9%)`,
  bottom: `clamp(24px, calc(24px + ${narrowPush} * 0.055), 9%)`,
}

export default function SectionLongView() {
  const row1 = useInView(0.02)
  const row2 = useInView(0.02)

  return (
    <section
      id="was-ist"
      className="relative scroll-mt-24 overflow-hidden bg-cream pt-24 pb-20 sm:pt-32 sm:pb-28"
    >
      {/* Heading stays inside the max-w container */}
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <SectionHeading eyebrow="Long Term Thinking" title="Was ist Digital Long View ?" />
      </div>

      {/* ── Row 1: text left | cone-right + telescope flush to right edge ── */}
      <div className="mt-14 grid items-center min-[500px]:grid-cols-2">
        {/* Text column */}
        <div
          className="py-10 lg:py-16"
          style={{ paddingLeft: textPadX, paddingRight: 'clamp(24px, 5vw, 64px)' }}
        >
          <p className="font-sans text-[clamp(18px,1.9vw,24px)] font-semibold leading-tight tracking-tight text-ink">
            Die Digitalagentur für Raum, Zeit und Kultur.
          </p>
          <p className="mt-4 max-w-[480px] font-serif text-[16px] leading-[1.65] text-ink/75">
            Wir schaffen <strong className="font-normal italic">Kommunikation</strong> für{' '}
            <strong className="font-normal italic">Kulturschaffende und Erlebende</strong>. Wir
            glauben daran eine Verbesserung lässt sich durch{' '}
            <strong className="font-normal italic">Partizipation und Erleben schaffen</strong>, das
            durch digitale Stützen ermöglicht wird. Somit versprechen wir uns{' '}
            <strong className="font-normal italic">Langzeitdenken zu erwecken</strong>.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3">
            <a
              href="#wer-sind-wir"
              className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/60 transition-all duration-200 hover:border-ink/60 hover:text-ink"
            >
              Erfahre mehr über unseren Long View
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#wer-sind-wir"
              className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/60 transition-all duration-200 hover:border-ink/60 hover:text-ink"
            >
              Wieso Langzeitdenken?
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Outer: layout anchor for observer — inner: slides in from right */}
        <div ref={row1.ref} className="relative aspect-[4/3] w-full overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-out"
            style={{ transform: row1.inView ? 'translateX(0)' : 'translateX(72vw)' }}
          >
            <img
              src="/assets/cone-right.webp"
              alt="" aria-hidden
              className="absolute right-0 top-0 h-full w-auto max-w-none select-none object-contain"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 select-none"
              style={{ background: 'linear-gradient(to right, #F7ECED 0%, #F7ECED 14%, rgba(247,236,237,0.5) 58%, transparent 100%)' }}
            />
            <img
              src="/assets/telescope.webp"
              alt="Teleskop auf Stativ"
              className="absolute bottom-0 z-10 w-auto select-none object-contain drop-shadow-2xl"
              style={telescopeStyle}
            />
          </div>
        </div>
      </div>

      {/* ── Row 2: cone-left + VR flush to left edge | feature text right ── */}
      <div className="grid items-center min-[500px]:grid-cols-2">
        {/* Outer: layout anchor for observer — inner: slides in from left */}
        <div ref={row2.ref} className="relative aspect-[4/3] w-full overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-out"
            style={{ transform: row2.inView ? 'translateX(0)' : 'translateX(-72vw)' }}
          >
            <img
              src="/assets/cone-left.webp"
              alt="" aria-hidden
              className="absolute bottom-0 left-0 h-full w-auto max-w-none select-none object-contain"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 select-none"
              style={{ background: 'linear-gradient(to left, #F7ECED 0%, #F7ECED 14%, rgba(247,236,237,0.5) 58%, transparent 100%)' }}
            />
            <img
              src="/assets/vr-headset.webp"
              alt="VR-Headset"
              className="absolute z-10 select-none object-contain drop-shadow-2xl"
              style={vrStyle}
            />
          </div>
        </div>

        {/* Feature text column */}
        <div
          className="py-10 lg:py-16"
          style={{ paddingRight: textPadX, paddingLeft: 'clamp(24px, 5vw, 64px)' }}
        >
          <p className="font-sans text-[clamp(18px,1.9vw,24px)] font-semibold leading-tight tracking-tight text-ink">
            Um das Langzeitdenken zu fördern.
          </p>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-1.5 inline-block h-3 w-3 flex-none rounded-full"
                  style={{ background: 'radial-gradient(circle at 30% 30%, #b29bd0, #5d4684)' }}
                />
                <div>
                  <h3 className="font-sans text-[16px] font-semibold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1 font-serif text-[14px] leading-[1.6] text-ink/70">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
