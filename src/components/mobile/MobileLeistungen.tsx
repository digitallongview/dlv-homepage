import { useCallback, useRef, useState, type TouchEvent } from 'react'
import { Dots } from './carousel'
import { useMediaQuery } from '../../hooks/useMediaQuery'

type Service = {
  id: string
  title: string
  body: string
  body2?: string
  body3?: string
  cta: string
  icon: string
  /** Optical balancing — some PNGs carry a lot of empty space (e.g. the watch + chain). */
  scale: number
}

const SERVICES: Service[] = [
  {
    id: 'programmierung',
    title: 'Programmierung & Web',
    body: 'Wir entwickeln digitale Systeme, die nicht für den nächsten Trend gebaut werden, sondern für nachhaltige Nutzung, Weiterentwicklung und kulturelle Relevanz.',
    body2: 'Webseiten, Plattformen und individuelle Software verstehen wir als Systeme, die Kultur ermöglichen: Sie müssen sich verändern können, ohne ihre Identität zu verlieren.',
    body3: 'Von der technischen Architektur bis zur digitalen Erfahrung gestalten wir Lösungen, die heute funktionieren und morgen neugedacht werden.',
    cta: 'Anfrage Coding',
    icon: '/assets/RetroPC.webp',
    scale: 1,
  },
  {
    id: 'immersive',
    title: 'Immersive Medien',
    body: 'Wir nutzen Augmented, Virtual und Mixed Reality, um neue Räume zwischen dem Digitalen und Physischen entstehen zu lassen.',
    body2: 'Dabei geht es nicht darum, Realität zu ersetzen, sondern sie zu erweitern: durch zusätzliche Ebenen, neue Perspektiven und interaktive Möglichkeiten der Begegnung.',
    body3: 'Wir gestalten immersive Erlebnisse, die über klassische Vermittlung hinausgehen und Menschen auf neue Weise mit Kultur, Wissen und Orten verbinden.',
    cta: 'Anfrage zu VR',
    icon: '/assets/XR-Media.webp',
    scale: 1,
  },
  {
    id: 'marketing',
    title: 'Marketing & PR',
    body: 'Wir bringen Kultur, Räume und Ideen in den Dialog mit Menschen.',
    body2: 'Durch Marketing, PR und strategische Kommunikation schaffen wir Zugänge, die Inhalte verständlich machen und Erlebnisse nach außen erweitern.',
    body3: 'Unsere Arbeit verbindet Analyse, Gestaltung und Vermittlung — damit Projekte nicht nur sichtbar werden, sondern Bedeutung entfalten.',
    cta: 'Anfrage Marketing',
    icon: '/assets/Megaphone.webp',
    scale: 0.92,
  },
  {
    id: 'grafik',
    title: 'Grafik & Content',
    body: 'Wir entwickeln visuelle Kommunikation, die nicht nur Aufmerksamkeit erzeugt, sondern Bedeutung schafft.',
    body2: 'Gestaltung verstehen wir als Mittel, Inhalte einzuordnen, verständlich zu machen und in einen kulturellen Kontext zu setzen, unabhängig davon, ob sie digital, gedruckt oder im Raum stattfindet.',
    body3: 'So entstehen Inhalte, die nicht nur gesehen werden, sondern etwas auslösen, einordnen und über den Moment hinaus wirken.',
    cta: 'Anfrage Grafik',
    icon: '/assets/Graphics.webp',
    scale: 1,
  },
  {
    id: 'gamification',
    title: 'Gamification & Storytelling',
    body: 'Videospiele sind kulturelle Systeme, in denen Menschen lernen, handeln und Bedeutung selbst erzeugen.',
    body2: 'Wir übertragen diese Logik auf digitale und physische Kontexte, um Storytelling und Inhalte interaktiv erfahrbar zu machen. Im Mittelpunkt steht dabei nicht der passive Konsum, sondern Partizipation: Menschen werden zu aktiven Teilnehmenden, die Inhalte durch ihre Entscheidungen, Handlungen und Perspektiven mitgestalten.',
    body3: 'Durch Narrative, Entscheidungen und Gamification entstehen neue Formen der kulturellen Vermittlung.',
    cta: 'Anfrage Gaming',
    icon: '/assets/Joystick.webp',
    scale: 1.12,
  },
  {
    id: '3d',
    title: '3D & Visualisierung',
    body: '3D-Visualisierungen, die darauf ausgelegt sind, Kultur, Architektur und Objekte zu bewahren, verständlich zu machen und weiterzudenken, wie die digitale Aufbereitung stehen bei uns im Mittelpunkt.',
    body2: 'Historische Orte, zerstörte oder veränderte Räume und kulturelle Objekte werden digital nachvollziehbar gemacht, um sie für Gegenwart und Zukunft zugänglich zu halten. Dabei verstehen wir Rekonstruktion nicht als reine Abbildung, sondern als interpretativen Prozess zwischen Geschichte, Wissen und Perspektive, inklusive kultureller Betrachtungswinkel.',
    body3: 'So entsteht ein Raum für kulturellen Austausch, in dem unterschiedliche Perspektiven sichtbar werden und neue Zugänge zum gemeinsamen Verständnis von Geschichte und Gegenwart entstehen.',
    cta: 'Anfrage 3D',
    icon: '/assets/Artefact.webp',
    scale: 0.85,
  },
  {
    id: 'langzeit',
    title: 'Langzeit- & Futuring Design',
    body: 'Strategische Perspektiven, die nicht auf kurzfristige Ergebnisse, sondern auf langfristige kulturelle und gesellschaftliche Entwicklung ausgerichtet sind.',
    body2: 'Future Thinking hilft, die Gegenwart in Relation zu setzen und Entscheidungen im Kontext möglicher Zukünfte zu verstehen. Zukunft wird dabei als gestaltbarer Möglichkeitsraum verstanden: Durch bewusstes Langzeitdenken entstehen Systeme, die Orientierung geben, Wandel ermöglichen und positive Entwicklungen fördern.',
    body3: 'So entstehen Ansätze, die Stabilität schaffen, ohne Veränderung zu bremsen und Zukunft als Chance aktiv mitgestalten.',
    cta: 'Anfrage Long View',
    icon: '/assets/clock.webp',
    scale: 1.4,
  },
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
            alt={s.title}
            draggable={false}
            loading="lazy"
            className="relative max-h-full w-auto max-w-[80%] select-none object-contain min-[800px]:max-w-full"
            style={{ transform: `scale(${s.scale})` }}
          />
        </div>

        {/* Copy */}
        <div className="min-[800px]:flex-1">
          <h3 className="mt-[clamp(0.5rem,2vh,1rem)] font-sans text-[clamp(18px,2.1vw,22px)] font-semibold tracking-tight text-ink min-[800px]:mt-0">
            {s.title}
          </h3>
          <p className="mt-[clamp(0.5rem,1.6vh,1rem)] font-serif text-[clamp(13.5px,1.5vw,15px)] leading-[1.66] text-ink/68">
            {s.body}
          </p>
          {s.body2 && (
            s.body3 ? (
              <p className="mt-[clamp(0.4rem,1.2vh,0.85rem)] font-serif text-[clamp(13.5px,1.5vw,15px)] leading-[1.66] text-ink/68">
                {s.body2}
              </p>
            ) : (
              <p className="mt-[clamp(0.4rem,1vh,0.75rem)] font-sans text-[clamp(13.5px,1.5vw,15px)] font-semibold leading-[1.5] text-ink/85">
                {s.body2}
              </p>
            )
          )}
          {s.body3 && (
            <p className="mt-[clamp(0.4rem,1.2vh,0.85rem)] font-serif text-[clamp(13.5px,1.5vw,15px)] leading-[1.66] text-ink/68">
              {s.body3}
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
            {s.cta}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function MobileLeistungen() {
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
          Leistungen &{' '}<br className="min-[520px]:hidden" />Service
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
