import SectionHeading from '../SectionHeading'

const PARTNERS = [
  { label: 'LTAP', sub: 'Long-Term Art Project' },
  { label: 'Wemdinger Zeitpyramide', sub: 'Stiftung' },
  { label: 'Million Generations', sub: 'Initiative' },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com', symbol: 'IG' },
  { label: 'Facebook', href: 'https://facebook.com', symbol: 'FB' },
  { label: 'Twitter / X', href: 'https://twitter.com', symbol: 'X' },
  { label: 'LinkedIn', href: 'https://linkedin.com', symbol: 'in' },
]

export default function SectionPartnerKontakt() {
  return (
    <section
      id="partner"
      className="relative scroll-mt-24 overflow-hidden bg-cream px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Partner & Freunde"
          title="Unsere Partner & Freunde"
        />

        <p className="mt-6 max-w-2xl font-serif text-[16px] leading-[1.65] text-ink/70">
          Wir arbeiten mit Stiftungen, Initiativen und Kunst­projekten zusammen,
          deren Horizont über die nächste Förderperiode hinausreicht.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {PARTNERS.map((p) => (
            <li
              key={p.label}
              className="group flex flex-col items-start gap-1 rounded-2xl border border-ink/10 bg-white/70 px-5 py-4 backdrop-blur transition-colors hover:border-lavender/40 hover:bg-white"
            >
              <span className="font-sans text-[15px] font-semibold tracking-tight text-ink">
                {p.label}
              </span>
              <span className="font-serif text-[12px] italic text-ink/55">
                {p.sub}
              </span>
            </li>
          ))}
        </ul>

        <div
          id="kontakt"
          className="mt-24 grid scroll-mt-24 gap-12 rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-[0_30px_70px_-30px_rgba(24,24,38,0.35)] backdrop-blur-md sm:p-12 lg:grid-cols-[1.2fr_1fr]"
        >
          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.42em] text-lavender">
              Teile den Zeitgeist
            </p>
            <h3 className="mt-2 font-sans text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight text-ink">
              Bleib mit uns in Kontakt.
            </h3>
            <p className="mt-4 max-w-md font-serif text-[15px] leading-[1.6] text-ink/70">
              Wenn dich Räume, Zeit oder Kultur interessieren — oder du selbst
              ein Projekt mit langem Atem planst — schreib uns.
            </p>

            <ul className="mt-6 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white font-sans text-[12px] font-semibold uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:border-lavender hover:bg-lavender hover:text-white"
                  >
                    {s.symbol}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-ink/55">
                Kontakt
              </p>
              <a
                href="mailto:info@dlv.ngo"
                className="mt-2 inline-block font-sans text-[clamp(20px,2.4vw,26px)] font-semibold tracking-tight text-ink hover:text-lavender"
              >
                info@dlv.ngo
              </a>
              <a
                href="tel:+4915141441262"
                className="mt-1 block font-serif text-[18px] text-ink/75 hover:text-lavender"
              >
                +49 151 4144 1262
              </a>
            </div>

            <a
              href="mailto:info@dlv.ngo"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 font-sans text-[14px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_34px_-14px_rgba(93,70,132,0.7)] transition-all hover:shadow-[0_18px_42px_-14px_rgba(93,70,132,0.9)]"
              style={{
                background:
                  'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)',
              }}
            >
              Jetzt schreiben
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
