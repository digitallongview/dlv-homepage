import { useEffect, useRef, useState } from 'react'
import SectionHeading from '../SectionHeading'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Side = 'left' | 'right'

type Service = {
  id:    string
  title: string
  body:  string
  body2?: string
  cta:   string
  icon:  string
  side:  Side
}

const SERVICES: Service[] = [
  {
    id:    'programmierung',
    title: 'Programmierung & Web',
    body:  'Maßgeschneiderte Webseiten, APIs und Backend-Architekturen — gebaut, um nicht in zwei Jahren weggeworfen zu werden.',
    body2: 'Von der Konzeption bis zum Launch begleiten wir komplexe Projekte ganzheitlich und nachhaltig.',
    cta:   'Anfrage Coding',
    icon:  '/assets/RetroPC.png',
    side:  'left',
  },
  {
    id:    'immersive',
    title: 'Immersive Medien',
    body:  'Augmented Reality, Virtual Reality und Mixed Reality für Kultur, Bildung und Erlebnis — von der ersten Skizze bis zum Stage-Deploy.',
    body2: 'Von der ersten Idee bis zum begehbaren Erlebnis, technisch präzise und emotional packend.',
    cta:   'Anfrage zu VR',
    icon:  '/assets/XR-Media.png',
    side:  'right',
  },
  {
    id:    'marketing',
    title: 'Marketing & PR',
    body:  'Digitale Kommunikationsstrategien für Kulturinstitutionen, NGOs und visionäre Unternehmen. Wir erzählen Geschichten, die haften bleiben.',
    body2: 'Von Social Media bis Pressearbeit — zielgerichtet und nachhaltig.',
    cta:   'Anfrage Marketing',
    icon:  '/assets/Megaphone.png',
    side:  'left',
  },
  {
    id:    'grafik',
    title: 'Grafik & Content',
    body:  'Visuelle Identität, Print, Editorial, Foto- und Bewegtbild — alles, was eurer Sache eine unverwechselbare Form gibt.',
    body2: 'Vom Konzept bis zum fertigen Design, konsistent über alle Kanäle hinweg.',
    cta:   'Anfrage Grafik',
    icon:  '/assets/Graphics.png',
    side:  'right',
  },
  {
    id:    'gamification',
    title: 'Gamification & Storytelling',
    body:  'Spielmechaniken und narrative Formate für Lern-, Kultur- und Markenprojekte. Wir machen Komplexes erfahrbar und schaffen nachhaltiges Engagement.',
    body2: 'Interaktive Formate, die zum Mitmachen und Weiterdenken einladen.',
    cta:   'Anfrage Gaming',
    icon:  '/assets/Joystick.png',
    side:  'left',
  },
  {
    id:    '3d',
    title: '3D & Visualisierung',
    body:  '3D-Modellierung, Architekturvisualisierung und Produktrenderings in Museumsqualität. Wir machen das Unsichtbare sichtbar und greifbar.',
    body2: 'Von der ersten Skizze bis zum finalen Render, detailgetreu und beeindruckend.',
    cta:   'Anfrage 3D',
    icon:  '/assets/Artefact.png',
    side:  'right',
  },
  {
    id:    'langzeit',
    title: 'Langzeit- & Futuring Design',
    body:  'Strategisches Design für die Zukunft — Szenarien, Konzepte und Prozesse, die weit über den nächsten Quartalsbericht hinausdenken.',
    body2: 'Wir begleiten Organisationen dabei, langfristig zu denken und nachhaltig zu handeln.',
    cta:   'Anfrage Long View',
    icon:  '/assets/clock.png',
    side:  'left',
  },
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
      className="group inline-flex h-[52px] w-fit items-center gap-2 rounded-full px-8
                 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-white
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
  const isLeft = service.side === 'left'
  const imgW    = service.id === 'marketing' ? '62%'
               : service.id === '3d'        ? '62%'
               : '100%'
  const imgMaxH = service.id === 'langzeit'  ? 'min(82vh, 680px)' : 'min(62vh, 520px)'

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
            src="/assets/PolyViolet.png"
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
            src="/assets/PolyMagenta.png"
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
                {/* ── Icon (5 cols) ── */}
                <div className="col-span-5 flex items-center justify-start">
                  <img
                    src={service.icon}
                    alt={service.title}
                    draggable={false}
                    className="select-none object-contain"
                    style={{ width: imgW, maxHeight: imgMaxH }}
                  />
                </div>

                {/* ── Text (4 cols) ── */}
                <div className="col-span-4 pl-4">
                  <h3 className="font-sans text-[clamp(17px,1.7vw,21px)] font-semibold leading-tight tracking-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-4 font-serif text-[14.5px] leading-[1.68] text-ink/72">
                    {service.body}
                  </p>
                  {service.body2 && (
                    <p className="mt-3 font-serif text-[14.5px] leading-[1.68] text-ink/72">
                      {service.body2}
                    </p>
                  )}
                </div>

                {/* ── Button (3 cols) ── */}
                <div className="col-span-3 flex items-center justify-center">
                  <CtaButton label={service.cta} />
                </div>
              </>
            ) : (
              <>
                {/* ── Button (3 cols) ── */}
                <div className="col-span-3 flex items-center justify-center">
                  <CtaButton label={service.cta} />
                </div>

                {/* ── Text (4 cols) ── */}
                <div className="col-span-4 pr-4">
                  <h3 className="font-sans text-[clamp(17px,1.7vw,21px)] font-semibold leading-tight tracking-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-4 font-serif text-[14.5px] leading-[1.68] text-ink/72">
                    {service.body}
                  </p>
                  {service.body2 && (
                    <p className="mt-3 font-serif text-[14.5px] leading-[1.68] text-ink/72">
                      {service.body2}
                    </p>
                  )}
                </div>

                {/* ── Icon (5 cols) ── */}
                <div className="col-span-5 flex items-center justify-end">
                  <img
                    src={service.icon}
                    alt={service.title}
                    draggable={false}
                    className="select-none object-contain"
                    style={{ width: imgW, maxHeight: imgMaxH }}
                  />
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
  return (
    <section id="leistungen" className="scroll-mt-24 bg-cream">

      {/* Section heading above the cards */}
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-20 sm:px-10 sm:pt-24">
        <SectionHeading eyebrow="Services" title="Unsere Leistungen & Service" />
      </div>

      {/* 7 service cards, alternating violet-left / magenta-right */}
      {SERVICES.map((service, i) => (
        <ServiceCard key={service.id} service={service} isLast={i === SERVICES.length - 1} />
      ))}

    </section>
  )
}
