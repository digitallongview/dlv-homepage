import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import SectionHeading from '../SectionHeading'
import { useStrings, useTeamText, type MemberId } from '../../i18n/content'

// Layout only — the localised name/role/intro/body live in the i18n catalogue,
// keyed by id, so both desktop & mobile share one source of truth.
type Member = { id: MemberId; img: string }

const TEAM: Member[] = [
  { id: 'lukas', img: '/assets/Lukas.webp' },
  { id: 'johan', img: '/assets/Johan.webp' },
  { id: 'domi',  img: '/assets/Domi.webp'  },
]


export default function SectionMotivation() {
  const s = useStrings()
  const tt = useTeamText()
  const [selected, setSelected] = useState<Member>(TEAM[0])
  const [hovered,  setHovered]  = useState<MemberId | null>(null)
  const [textKey,  setTextKey]  = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedRef  = useRef<Member>(TEAM[0])
  const fitRef       = useRef<HTMLDivElement>(null)
  const textColRef   = useRef<HTMLDivElement>(null)
  const probeRef     = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, topY: 0 })

  function handleSelect(m: Member) {
    if (m.id === selected.id) return
    setSelected(m)
    setTextKey((k) => k + 1)
  }

  // Keep ref in sync for scroll handler
  useEffect(() => { selectedRef.current = selected }, [selected])

  // Fit-to-height: uniformly scale the panel so it always fits the viewport,
  // clear of the fixed triangle header. Without this the content (designed for
  // ~800px tall viewports) clips on short or display-scaled screens.
  //
  // The scale is derived from the TALLEST member (measured via the hidden probe),
  // not the current one, so all three views render at exactly the same size and
  // nothing resizes while scrolling between Lukas / Johann / Dominik.
  const recomputeFit = useCallback(() => {
    const el = fitRef.current
    const tx = textColRef.current
    const pr = probeRef.current
    if (!el || !tx || !pr) return

    const HEADER_CLEAR = 88   // keep clear of the fixed site header
    const BOTTOM_CLEAR = 24
    const avail = window.innerHeight - HEADER_CLEAR - BOTTOM_CLEAR

    // Constant chrome height around the text column (heading, grid margin, …).
    const frameH = el.offsetHeight - tx.offsetHeight
    // Tallest text column across all members → uniform scale for every view.
    let maxTextH = tx.offsetHeight
    for (const row of Array.from(pr.children)) {
      maxTextH = Math.max(maxTextH, (row as HTMLElement).offsetHeight)
    }

    const natural = frameH + maxTextH
    if (natural <= 0) return
    const scale = Math.min(1, avail / natural)
    // Anchor every member's top at the same Y (tallest member centred in the band)
    // so the heading stays put — only the uniform scale matters for size.
    const topY = HEADER_CLEAR + (avail - natural * scale) / 2
    setFit({ scale, topY })
  }, [])

  // Re-measure synchronously on member switch (content height changes) so the
  // new panel never paints a frame at the previous member's scale.
  useLayoutEffect(recomputeFit, [recomputeFit, selected])

  useEffect(() => {
    // ResizeObserver catches content reflow (e.g. font load); resize catches viewport changes.
    const el = fitRef.current
    const pr = probeRef.current
    if (!el || !pr) return
    const ro = new ResizeObserver(recomputeFit)
    ro.observe(el)
    ro.observe(pr)
    window.addEventListener('resize', recomputeFit, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recomputeFit)
    }
  }, [recomputeFit])

  // Scroll-through: advance members as the sticky container scrolls.
  // getBoundingClientRect / offsetHeight nur bei Resize lesen, nie im scroll handler.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let containerTop = 0
    let scrollable   = 0

    const updateMetrics = () => {
      containerTop = container.getBoundingClientRect().top + window.scrollY
      scrollable   = container.offsetHeight - window.innerHeight
    }
    updateMetrics()

    const onScroll = () => {
      if (scrollable <= 0) return
      const progress = Math.max(0, Math.min(1, (window.scrollY - containerTop) / scrollable))
      const index    = Math.min(TEAM.length - 1, Math.floor(progress * TEAM.length))
      const target   = TEAM[index]
      if (target.id !== selectedRef.current.id) {
        selectedRef.current = target
        setSelected(target)
        setTextKey((k) => k + 1)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateMetrics, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateMetrics)
    }
  }, [])

  // Text block for a member — shared by the live panel and the hidden probe so
  // both measure to identical heights.
  const memberText = (m: Member) => {
    const txt = tt[m.id]
    return (
      <>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-lavender">
          {txt.intro}
        </p>
        <p className="mt-4 font-serif text-[16px] leading-[1.65] text-ink/70">
          {txt.body}
        </p>
        <h3 className="mt-6 font-sans text-[clamp(20px,2.2vw,28px)] font-bold leading-snug tracking-tight text-ink">
          {txt.role}
        </h3>
        <p className="mt-4 font-serif text-[16px] leading-[1.65] text-ink/70">
          {txt.bodyExtended}
        </p>
      </>
    )
  }

  const contactButton = (
    <a
      href="#kontakt"
      className="group mt-8 inline-flex h-[52px] w-fit items-center gap-2
                 rounded-full px-8 font-sans text-[11px] font-semibold uppercase
                 tracking-[0.25em] text-white
                 shadow-[0_10px_30px_-10px_rgba(93,70,132,0.65)]
                 transition-all duration-200
                 hover:brightness-105 hover:shadow-[0_14px_36px_-10px_rgba(93,70,132,0.85)]
                 focus:outline-none focus:ring-4 focus:ring-lavender/40 active:scale-[0.97]"
      style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
    >
      {s.motivation.contact}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  )

  return (
    // Outer container reserves 3× viewport height so scrolling has room to advance
    <div
      id="wer-sind-wir"
      ref={containerRef}
      className="scroll-mt-24"
      style={{ height: `${TEAM.length * 100}vh` }}
    >
      {/* Sticky panel — stays in view while user scrolls through the container */}
      <section
        className="sticky top-0 overflow-hidden bg-cream"
        style={{ height: '100vh' }}
      >
<div
          ref={fitRef}
          className="absolute left-1/2 w-full max-w-[1280px] px-6 sm:px-10"
          style={{
            top: `${fit.topY}px`,
            transform: `translateX(-50%) scale(${fit.scale})`,
            transformOrigin: 'top center',
          }}
        >
          <SectionHeading eyebrow={s.sections.motivationEyebrow} title={s.sections.motivationTitle} />

          {/* ── Two-column layout — portraits aligned toward the top of the text ── */}
          <div className="mt-10 grid items-start gap-x-16 lg:grid-cols-[6fr_5fr]">

            {/* LEFT: text — cross-fades on member change */}
            <div ref={textColRef} className="flex flex-col">
              <div key={textKey} style={{ animation: 'fade-up 0.4s ease-out both' }}>
                {memberText(selected)}
              </div>
              {contactButton}
            </div>

            {/* RIGHT: portrait selector + scroll indicator centred beneath the trio.
                Lifted up into the space beside the heading so it doesn't feel cramped. */}
            <div className="flex flex-col items-center gap-10 -translate-y-0.5">
              <div className="flex w-full items-end justify-around gap-4 sm:gap-6">
                {TEAM.map((m) => {
                  const active   = m.id === selected.id
                  const colorful = active || m.id === hovered

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelect(m)}
                      onMouseEnter={() => { if (!active) setHovered(m.id) }}
                      onMouseLeave={() => setHovered(null)}
                      aria-pressed={active}
                      aria-label={tt[m.id].name}
                      className={[
                        'group flex flex-col items-center gap-3 cursor-pointer select-none',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender/60 focus-visible:rounded',
                        'transition-[transform] duration-500 ease-out',
                        active ? '-translate-y-4' : 'hover:-translate-y-1.5',
                      ].join(' ')}
                      style={{ willChange: 'transform' }}
                    >
                      <img
                        src={m.img}
                        alt={tt[m.id].name}
                        draggable={false}
                        loading="lazy"
                        className={[
                          'block transition-[width,filter] duration-500 ease-out',
                          // PNG already carries its baked drop shadow — no CSS shadow
                          active
                            ? 'w-[168px] sm:w-[200px]'
                            : 'w-[104px] sm:w-[126px]',
                        ].join(' ')}
                        style={{
                          filter: colorful
                            ? 'grayscale(0) saturate(1.05)'
                            : 'grayscale(1) saturate(0)',
                        }}
                      />
                      <span
                        className={[
                          'font-sans text-[11px] font-semibold uppercase tracking-[0.25em]',
                          'transition-colors duration-300',
                          active ? 'text-lavender' : 'text-ink/30 group-hover:text-ink/55',
                        ].join(' ')}
                      >
                        {tt[m.id].name}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Scroll progress dots — centred under the three portraits */}
              <div className="flex justify-center gap-2" aria-hidden>
                {TEAM.map((m) => (
                  <span
                    key={m.id}
                    className="block h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width:      m.id === selected.id ? 24 : 6,
                      background: m.id === selected.id
                        ? 'linear-gradient(90deg, #b29bd0, #5d4684)'
                        : 'rgba(93,70,132,0.2)',
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Hidden probe — measures every member's text-column height so the panel
            scales uniformly to the tallest one (no size jump between members). */}
        <div
          ref={probeRef}
          aria-hidden
          className="invisible pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[1280px] px-6 sm:px-10"
        >
          {TEAM.map((m) => (
            <div key={m.id} className="grid gap-x-16 lg:grid-cols-[6fr_5fr]">
              <div className="flex flex-col">
                <div>{memberText(m)}</div>
                {contactButton}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
