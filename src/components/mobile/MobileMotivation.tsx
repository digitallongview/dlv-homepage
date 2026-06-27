import { useEffect, useRef, useState, type ReactNode } from 'react'
import { DiagonalDots, Dots, SWIPE_TILT, useCarousel } from './carousel'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import SectionHeading from '../SectionHeading'

type Member = {
  id: string
  name: string
  /** Polaroid portrait (baked frame + tilt) used in the narrow-desktop layout. */
  img: string
  /** Straight portrait used only in the phone layout — tilted via CSS to match the swipe line. */
  imgPhone: string
  role: string
  intro: string
  body: string
  bodyExtended: string
}

const TEAM: Member[] = [
  {
    id: 'lukas',
    name: 'Lukas',
    img: '/assets/Lukas.webp',
    imgPhone: '/assets/lukas-bild.webp',
    role: '… und mir geht es um ZEIT!',
    intro: 'Hi! Ich bin Lukas …',
    body: 'Creative Director, Visionär und Langzeitdenker. Als Stiftungsmitglied der Wemdinger Zeitpyramide denke ich in Jahrhunderten, nicht in Quartalen.',
    bodyExtended: 'Zeit ist mein Gestaltungsraum. Ich entwickle Zukunftsbilder und Future-Design-Prozesse, die sich an der Vergangenheit orientieren – an dem, was sich bewährt hat und Bestand hatte. Daraus schöpfe ich Zuversicht: Langzeitdenken ist für mich kein abstraktes Konzept, sondern ein Akt der Hoffnung – für kommende Generationen und lange Zukünfte, im Einklang mit dem Hier und Jetzt.',
  },
  {
    id: 'johan',
    name: 'Johann',
    img: '/assets/Johan.webp',
    imgPhone: '/assets/johann-bild.webp',
    role: '… und mir geht es um RAUM!',
    intro: 'Hi! Ich bin Johann …',
    body: 'XR Developer & Designer. Ich verbinde visionäres Denken mit pragmatischem Handeln – Programmierung und Design, konsequent nutzerzentriert.',
    bodyExtended: 'Raum ist für mich die Schnittstelle von Mensch, Technologie und Interaktion. XR erweitert ihn um neue Dimensionen und verbindet Vergangenheit, Gegenwart und Zukunft. Mich fasziniert, durch immersive Räume neue Formen von Wahrnehmung und Präsenz zu schaffen – Ideen nicht nur sichtbar, sondern erlebbar zu machen.',
  },
  {
    id: 'domi',
    name: 'Dominik',
    img: '/assets/Domi.webp',
    imgPhone: '/assets/domi-bild.webp',
    role: '… und mir geht es um KULTUR!',
    intro: 'Hi! Ich bin Dominik …',
    body: 'Web Developer & Digital Strategist. Ich verbinde Technologie mit Struktur – von der Entwicklung digitaler Lösungen über Automatisierung bis hin zu nachhaltigen Geschäftsprozessen.',
    bodyExtended: 'Kultur ist für mich das, was Menschen verbindet, Identität schafft und Ideen über Generationen hinweg weiterträgt. Sie prägt, wie wir denken, handeln und miteinander leben. Mich fasziniert, wie digitale Technologien dazu beitragen können, kulturelle Werte sichtbar, zugänglich und erlebbar zu machen – und wie Innovation entsteht, wenn Tradition auf Zukunft trifft.',
  },
]

const CTA_GRAD = 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)'

/** "Lass uns reden" eyebrow (sitting high, with breathing room) + Kontakt pill that
    shoots in on scroll — used in the narrow-desktop 3rd column. */
function ContactCta() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.3) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: [0, 0.3, 0.6] },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center">
      <p
        className="font-sans text-[12px] font-semibold uppercase tracking-[0.3em] text-lavender"
        style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.5s ease 0.1s' }}
      >
        Lass uns reden
      </p>
      <a
        href="#kontakt"
        className="group mt-9 inline-flex h-[54px] items-center gap-2 rounded-full px-9 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_14px_36px_-12px_rgba(93,70,132,0.75)] active:scale-[0.97]"
        style={{
          background: CTA_GRAD,
          animation: shown ? 'cta-shoot-in 0.7s cubic-bezier(0.2,0.8,0.2,1) both' : 'none',
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(50px)',
          transition: shown ? undefined : 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        Kontakt
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </div>
  )
}

/** Narrow-desktop panel: [photo+switcher | Hi-text/copy | CTA] row (like Leistungen).
    The switcher sits directly under the photo; the copy column is kept narrow so the
    CTA column has room to breathe. */
function MemberPanelDesktop({ m, dots }: { m: Member; dots: ReactNode }) {
  return (
    <div className="w-full flex-none snap-center px-6 min-[600px]:px-10">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-6 min-[760px]:gap-8">
        {/* COL 1: photo + switcher underneath */}
        <div className="flex flex-none flex-col items-center gap-5">
          <img
            src={m.img}
            alt={`Portrait von ${m.name}`}
            draggable={false}
            loading="lazy"
            className="w-[160px] select-none object-contain min-[760px]:w-[190px]"
          />
          <div>{dots}</div>
        </div>

        {/* COL 2: copy — fills the space when cramped, kept to a narrow measure once
            there's room so the CTA column can breathe */}
        <div className="min-w-0 flex-1 pt-1 min-[760px]:max-w-[380px]">
          <p className="font-sans text-[15px] font-semibold tracking-tight text-ink">{m.intro}</p>
          <p className="mt-2 font-serif text-[13.5px] leading-[1.66] text-ink/70">{m.body}</p>
          <h3 className="mt-6 font-sans text-[19px] font-bold tracking-tight text-ink">{m.role}</h3>
          <p className="mt-3 font-serif text-[14.5px] leading-[1.72] text-ink/72">{m.bodyExtended}</p>
        </div>

        {/* COL 3: contact call-to-action — room to breathe */}
        <div className="flex flex-none justify-center min-[760px]:px-4">
          <ContactCta />
        </div>
      </div>
    </div>
  )
}

/** Phone panel: straight portrait tilted to the swipe line, stacked copy, diagonal switcher. */
function MemberPanelPhone({ m, dots }: { m: Member; dots: ReactNode }) {
  return (
    <div className="w-full flex-none snap-center px-6">
      {/* pt gives the tilted portrait headroom so its raised top-right corner
          isn't clipped by the track's overflow */}
      <div className="mx-auto w-full max-w-[620px] pt-4">
        {/* Photo + intro row — the straight PNG is tilted via CSS to match the swipe line */}
        <div className="flex items-start gap-5">
          <img
            src={m.imgPhone}
            alt={`Portrait von ${m.name}`}
            draggable={false}
            loading="lazy"
            className="w-[150px] flex-none select-none object-contain"
            style={{ transform: `rotate(${SWIPE_TILT}deg)` }}
          />
          {/* small indent from the right so the intro doesn't reach the edge */}
          <div className="min-w-0 flex-1 pt-2 pr-6">
            <p className="font-sans text-[15px] font-semibold tracking-tight text-ink">{m.intro}</p>
            <p className="mt-2 font-serif text-[13px] leading-[1.6] text-ink/70">{m.body}</p>
          </div>
        </div>

        {/* Switcher + brief swipe prompt — tighter gap to the row above */}
        <div className="mt-6">{dots}</div>

        {/* Role + extended body — right-aligned to play off the indented intro above */}
        <h3 className="mt-16 text-right font-sans text-[19px] font-bold tracking-tight text-ink">{m.role}</h3>
        <p className="mt-4 text-right font-serif text-[14.5px] leading-[1.72] text-ink/72">
          {m.bodyExtended}
        </p>
      </div>
    </div>
  )
}

/** Kontakt button that shoots in when scrolled into the empty spacing, hides on scroll-up. */
function ShootInCta() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setShown(e.isIntersecting && e.intersectionRatio > 0.4),
      { threshold: [0, 0.4, 0.8] },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex min-h-[26vh] flex-col items-center justify-center px-6 pt-10 pb-28 text-center">
      <p
        className="font-sans text-[12px] font-semibold uppercase tracking-[0.3em] text-lavender"
        style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.5s ease 0.1s' }}
      >
        Lass uns reden
      </p>
      <a
        href="#kontakt"
        className="group mt-5 inline-flex h-[56px] items-center gap-2 rounded-full px-10 font-sans text-[12px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_16px_40px_-12px_rgba(93,70,132,0.75)] active:scale-[0.97]"
        style={{
          background: CTA_GRAD,
          animation: shown ? 'cta-shoot-in 0.7s cubic-bezier(0.2,0.8,0.2,1) both' : 'none',
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(60px)',
          transition: shown ? undefined : 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        Kontakt
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </div>
  )
}

export default function MobileMotivation() {
  const { trackRef, active, goTo } = useCarousel()
  // Below 600px the module uses its phone form (diagonal dots + swipe prompt);
  // from 600px up it switches to the narrow-desktop form (arrow dots).
  const isNarrow = useMediaQuery('(min-width: 600px)')
  // `hintShown` fades the prompt; `hintGone` then collapses the space it held so
  // the dots slide up once the prompt is dismissed.
  const [hintShown, setHintShown] = useState(false)
  const [hintGone, setHintGone] = useState(false)

  // Phone only: flash the swipe prompt in once the track scrolls into view, then
  // fade it back out after a few seconds and collapse its gap.
  useEffect(() => {
    if (isNarrow) return
    const el = trackRef.current
    if (!el) return
    let timer: number | undefined
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.25) {
          setHintShown(true)
          timer = window.setTimeout(() => {
            setHintShown(false)
            setHintGone(true)
          }, 3500)
          obs.disconnect()
        }
      },
      { threshold: [0, 0.25, 0.5] },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [isNarrow, trackRef])

  const SWIPE_LABEL = 'Swipe zwischen uns, um mehr zu erfahren!'
  const indicator = isNarrow ? (
    <Dots count={TEAM.length} active={active} onSelect={goTo} showArrows />
  ) : (
    <DiagonalDots
      count={TEAM.length}
      active={active}
      onSelect={goTo}
      label={SWIPE_LABEL}
      hintVisible={hintShown}
      hintCollapsed={hintGone}
    />
  )

  return (
    <section id="wer-sind-wir" className="scroll-mt-4 bg-cream pt-16 min-[600px]:pb-32">
      {/* Heading — narrow-desktop mirrors the full-desktop SectionHeading (eyebrow +
          title-case); phone uses the big uppercase style of Leistungen & Service */}
      <div className="mx-auto w-full max-w-[620px] px-6 min-[600px]:mx-0 min-[600px]:max-w-[900px] min-[600px]:px-10">
        {isNarrow ? (
          <SectionHeading eyebrow="Wer sind wir" title="Motivation & Vorstellung" />
        ) : (
          <>
            <h2 className="font-sans text-[clamp(30px,4.5vw,40px)] font-bold uppercase leading-[1.1] tracking-[0.02em] text-ink">
              Motivation &{' '}<br />Vorstellung
            </h2>
            <div className="mt-5 h-px w-full bg-gradient-to-r from-ink/35 via-ink/12 to-transparent" />
          </>
        )}
      </div>

      {/* Swipe track — each panel carries an identical indicator so it reads as static */}
      <div ref={trackRef} className="no-scrollbar mt-8 flex snap-x snap-mandatory overflow-x-auto">
        {TEAM.map((m) =>
          isNarrow ? (
            <MemberPanelDesktop key={m.id} m={m} dots={indicator} />
          ) : (
            <MemberPanelPhone key={m.id} m={m} dots={indicator} />
          ),
        )}
      </div>

      {/* Empty spacing with shoot-in CTA — phone only; narrow-desktop carries the CTA in-panel */}
      {!isNarrow && <ShootInCta />}
    </section>
  )
}
