const FOOTER_LINKS = [
  { label: 'Impressum', href: '#impressum' },
  { label: 'Datenschutz', href: '#datenschutz' },
  { label: 'Cookie-Einstellungen', href: '#cookies' },
  { label: 'AGBs', href: '#agbs' },
]

export default function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden px-6 pb-12 text-cream sm:px-10"
      style={{
        background:
          'linear-gradient(160deg, #2d1f4d 0%, #5d4684 50%, #8c74aa 100%)',
        clipPath: 'polygon(0 90px, 100% 0, 100% 100%, 0 100%)',
        paddingTop: 160,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-25"
        style={{
          background:
            'radial-gradient(50% 40% at 80% 20%, rgba(247,236,237,0.55), transparent), radial-gradient(40% 50% at 10% 90%, rgba(247,236,237,0.45), transparent)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="#" className="inline-flex items-center">
            <img
              src="/assets/logo.png"
              alt="Digital Longview"
              className="h-12 w-auto select-none brightness-0 invert"
              draggable={false}
            />
          </a>
          <p className="mt-6 max-w-md font-serif text-[14px] leading-[1.65] text-cream/80">
            Digital Longview — Die Digitalagentur für Raum, Zeit und Kultur.
            Wir bauen digitale Erfahrungen, die länger halten als ein
            Produkt-Lifecycle.
          </p>
        </div>

        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-cream/55">
            Inhalt
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="#was-ist" className="font-sans text-[14px] text-cream/85 hover:text-white">
                Long View
              </a>
            </li>
            <li>
              <a href="#wer-sind-wir" className="font-sans text-[14px] text-cream/85 hover:text-white">
                Über uns
              </a>
            </li>
            <li>
              <a href="#portfolio" className="font-sans text-[14px] text-cream/85 hover:text-white">
                Portfolio
              </a>
            </li>
            <li>
              <a href="#leistungen" className="font-sans text-[14px] text-cream/85 hover:text-white">
                Leistungen
              </a>
            </li>
            <li>
              <a href="#partner" className="font-sans text-[14px] text-cream/85 hover:text-white">
                Partner
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-cream/55">
            Rechtliches
          </p>
          <ul className="mt-4 space-y-2">
            {FOOTER_LINKS.map((f) => (
              <li key={f.href}>
                <a
                  href={f.href}
                  className="font-sans text-[14px] text-cream/85 hover:text-white"
                >
                  {f.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-16 flex max-w-[1320px] flex-col items-start justify-between gap-3 border-t border-cream/15 pt-6 sm:flex-row sm:items-center">
        <p className="font-sans text-[12px] text-cream/55">
          © {new Date().getFullYear()} Digital Longview · gemeinnützig.
        </p>
        <p className="font-serif text-[12px] italic text-cream/55">
          Made for the long now.
        </p>
      </div>
    </footer>
  )
}
