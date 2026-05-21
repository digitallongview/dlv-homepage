import SectionHeading from '../SectionHeading'

export default function SectionPortfolio() {
  return (
    <section
      id="portfolio"
      className="relative scroll-mt-24 bg-cream px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Langzeit-Kultur & Portfolio"
          title="Für das Langzeitdenken."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative">
            {/* TODO: echte Foto-Komposition der Wemdinger Zeitpyramide */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(24,24,38,0.4)]">
              <div
                className="h-full w-full"
                style={{
                  background:
                    'linear-gradient(160deg, #d8c6e2 0%, #8c74aa 55%, #2d1f4d 100%)',
                }}
              />
            </div>
            <span className="absolute -bottom-4 left-6 rounded-full bg-white/85 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-lavender shadow-sm backdrop-blur">
              Wemding · Bayern
            </span>
          </div>

          <div>
            <h3 className="font-sans text-[clamp(26px,3.5vw,36px)] font-bold leading-tight tracking-tight text-ink">
              Die Wemdinger Zeitpyramide
            </h3>
            <p className="mt-2 font-sans text-[16px] font-medium uppercase tracking-[0.2em] text-lavender">
              Langzeit­kunstprojekt &amp; AR-Visualisierung
            </p>

            <p className="mt-6 font-serif text-[16px] leading-[1.65] text-ink/75">
              Alle zehn Jahre wird ein Betonblock gesetzt — 120 Blöcke, 1.200
              Jahre. Wir bauen das digitale Gegenstück: eine AR-Erfahrung, die
              den Jahrhunderten ein Interface gibt, ohne sie zu beschleunigen.
            </p>
            <p className="mt-4 font-serif text-[16px] leading-[1.65] text-ink/75">
              Besucher:innen können vor Ort jeden gesetzten Stein scannen,
              hören, was diese Generation hinterließ — und sehen, was kommt.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_28px_-10px_rgba(93,70,132,0.7)] transition-all hover:shadow-[0_14px_34px_-10px_rgba(93,70,132,0.9)]"
                style={{
                  background:
                    'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)',
                }}
              >
                Web-AR öffnen
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="https://zeitpyramide.de"
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-all hover:border-lavender hover:text-lavender"
              >
                Webseite Stiftung
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
