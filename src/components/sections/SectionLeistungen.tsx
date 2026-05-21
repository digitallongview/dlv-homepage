import SectionHeading from '../SectionHeading'

type Service = {
  title: string
  body: string
  cta: string
  badge: string
  hue: string
}

const SERVICES: Service[] = [
  {
    title: 'Programmierung & Web',
    badge: 'Code',
    body: 'Maßgeschneiderte Webseiten, APIs und Backend-Architekturen — gebaut, um nicht in zwei Jahren weggeworfen zu werden.',
    cta: 'Anfrage Coding',
    hue: 'linear-gradient(160deg, #d6c6ea 0%, #8c74aa 100%)',
  },
  {
    title: 'Immersive Medien',
    badge: 'XR · VR · AR',
    body: 'Räumliche Geschichten für Headsets, Smartphones und Installationen — von der ersten Skizze bis zum Stage-Deploy.',
    cta: 'Anfrage zu VR',
    hue: 'linear-gradient(160deg, #c8b1e6 0%, #5d4684 100%)',
  },
  {
    title: 'Grafik & Content',
    badge: 'Design',
    body: 'Visuelle Identität, Print, Editorial, Foto- und Bewegtbild — alles, was eurer Sache eine Form gibt.',
    cta: 'Anfrage Grafik',
    hue: 'linear-gradient(160deg, #efdcc5 0%, #b29bd0 100%)',
  },
]

export default function SectionLeistungen() {
  return (
    <section
      id="leistungen"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
    >
      {/* Schräges Polygon-Band (Figma „Polygon 45/46/47" → schräge Service-Bänder) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%]"
        style={{
          background:
            'linear-gradient(135deg, rgba(140,116,170,0.16) 0%, rgba(178,155,208,0.05) 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
        }}
      />

      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Services"
          title="Unsere Leistungen & Service"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_20px_50px_-30px_rgba(24,24,38,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(24,24,38,0.45)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" style={{ background: s.hue }} />
                <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 font-sans text-[10.5px] font-medium uppercase tracking-[0.28em] text-lavender backdrop-blur">
                  {s.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-sans text-[clamp(20px,2.2vw,24px)] font-bold leading-tight tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 font-serif text-[15px] leading-[1.6] text-ink/70">
                  {s.body}
                </p>

                <a
                  href="#kontakt"
                  className="group/cta mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 font-sans text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_24px_-10px_rgba(93,70,132,0.6)] transition-all hover:shadow-[0_14px_30px_-10px_rgba(93,70,132,0.85)]"
                  style={{
                    background:
                      'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)',
                  }}
                >
                  {s.cta}
                  <span aria-hidden className="transition-transform group-hover/cta:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
