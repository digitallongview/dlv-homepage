import { useState, useRef, useEffect } from 'react'
import SectionHeading from '../SectionHeading'

type MemberId = 'lukas' | 'johan' | 'domi'

type Member = {
  id:           MemberId
  name:         string
  img:          string
  role:         string
  intro:        string
  body:         string
  bodyExtended: string
}

const TEAM: Member[] = [
  {
    id:           'lukas',
    name:         'Lukas',
    img:          '/assets/Lukas.png',
    role:         '… und mir geht es um ZEIT.',
    intro:        'Hi! Ich bin Lukas …',
    body:         'Mich interessiert, wie wir digitale Räume so bauen, dass sie nicht nach drei Jahren wieder abgerissen werden.',
    bodyExtended: 'Langlebige Software, langlebige Geschichten, langlebige Kultur – das ist mein Antrieb bei Digital Long View.',
  },
  {
    id:           'johan',
    name:         'Johann',
    img:          '/assets/Johan.png',
    role:         '… und mir geht es um RAUM.',
    intro:        'Hi! Ich bin Johann …',
    body:         'Ich denke vom Ort aus: wie Architektur, Landschaft und Digitalität ineinandergreifen.',
    bodyExtended: 'Mein Lieblingswerkzeug ist die Konzeptzeichnung – direkt am Stein, direkt in der Wirklichkeit.',
  },
  {
    id:           'domi',
    name:         'Domi',
    img:          '/assets/Domi.png',
    role:         '… und mir geht es um KULTUR.',
    intro:        'Hi! Ich bin Domi …',
    body:         'Kultur ist kein Produkt, sondern eine Praxis.',
    bodyExtended: 'Ich kuratiere Programme und Formate, die Menschen einladen, langsamer zu schauen, zu hören und mitzudenken.',
  },
]


export default function SectionMotivation() {
  const [selected, setSelected] = useState<Member>(TEAM[0])
  const [hovered,  setHovered]  = useState<MemberId | null>(null)
  const [textKey,  setTextKey]  = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedRef  = useRef<Member>(TEAM[0])

  function handleSelect(m: Member) {
    if (m.id === selected.id) return
    setSelected(m)
    setTextKey((k) => k + 1)
  }

  // Keep ref in sync for scroll handler
  useEffect(() => { selectedRef.current = selected }, [selected])

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
<div className="mx-auto flex h-full max-w-[1200px] flex-col justify-center px-6 sm:px-10 py-16">
          <SectionHeading eyebrow="Wer sind wir" title="Motivation & Vorstellung" />

          {/* ── Two-column layout ── */}
          <div className="mt-12 grid items-end gap-x-16 lg:grid-cols-[5fr_7fr]">

            {/* LEFT: text — cross-fades on member change */}
            <div className="flex flex-col justify-end pb-4">
              <div key={textKey} style={{ animation: 'fade-up 0.4s ease-out both' }}>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-lavender">
                  {selected.intro}
                </p>
                <h3 className="mt-4 font-sans text-[clamp(20px,2.2vw,28px)] font-bold leading-snug tracking-tight text-ink">
                  {selected.role}
                </h3>
                <p className="mt-5 font-serif text-[15px] leading-[1.72] text-ink/70">
                  {selected.body}
                </p>
                <p className="mt-3 font-serif text-[15px] leading-[1.72] text-ink/70">
                  {selected.bodyExtended}
                </p>
              </div>

              <a
                href="#kontakt"
                className="group mt-10 inline-flex h-[52px] w-fit items-center gap-2
                           rounded-full px-8 font-sans text-[11px] font-semibold uppercase
                           tracking-[0.25em] text-white
                           shadow-[0_10px_30px_-10px_rgba(93,70,132,0.65)]
                           transition-all duration-200
                           hover:brightness-105 hover:shadow-[0_14px_36px_-10px_rgba(93,70,132,0.85)]
                           focus:outline-none focus:ring-4 focus:ring-lavender/40 active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
              >
                Kontakt
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* RIGHT: portrait selector */}
            <div className="flex items-end justify-around gap-4 sm:gap-6">
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
                    aria-label={`Profil ${m.name} anzeigen`}
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
                      alt={`Portrait von ${m.name}`}
                      draggable={false}
                      loading="lazy"
                      className={[
                        'block transition-[width,filter] duration-500 ease-out',
                        'drop-shadow-[0_12px_32px_rgba(24,24,38,0.22)]',
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
                      {m.name}
                    </span>
                  </button>
                )
              })}
            </div>

          </div>

          {/* Scroll progress dots */}
          <div className="mt-10 flex justify-center gap-2" aria-hidden>
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
      </section>
    </div>
  )
}
