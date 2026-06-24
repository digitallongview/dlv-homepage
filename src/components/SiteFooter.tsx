import type { MouseEventHandler } from 'react'
import { useLegalModal } from './legal/LegalModal'
import type { LegalKey } from '../lib/legalContent'

// Social-Media-Icons sind vorerst deaktiviert (Markup bleibt erhalten).
// Auf `true` setzen, um sie wieder anzuzeigen.
const SHOW_SOCIALS = false

type FooterLink = { href: string; label: string; legal?: LegalKey }

const FOOTER_NAV_LEFT: FooterLink[] = [
  { href: '#agbs',        label: 'AGBs'    },
  { href: '#cookies',     label: 'Cookies' },
]

const FOOTER_NAV_RIGHT: FooterLink[] = [
  { href: '#',            label: 'Header'                              },
  { href: '#impressum',   label: 'Impressum',   legal: 'impressum'    },
  { href: '#datenschutz', label: 'Datenschutz', legal: 'datenschutz'  },
]

// Diagonal gradient: light lavender-pink at the cut edge → #D7ACCF → slightly deeper
const MAGENTA_GRAD =
  'linear-gradient(138deg, #f0dded 0%, #D7ACCF 48%, #c898c4 100%)'

// ─── Sub-components ───────────────────────────────────────────────────────────

// 4 partner logos rendered as a 2×2 grid. Each logo carries its own
// `imgClassName` so the very different source artworks (a photographic tile, a
// padded wordmark, a tight SVG) can be balanced to roughly equal optical
// presence. Oversized logos overflow into the grid gaps — harmless, since their
// extra margin is transparent.
const LOGO_BASE = 'select-none object-contain object-center'

const PARTNERS = [
  {
    src: '/assets/mglogo.png',
    alt: 'Million Generations',
    href: 'https://www.milliongenerations.org/index.php?title=Main_Page',
    imgClassName: 'max-h-[54px] w-full',
  },
  {
    // SVG carries padding around the mark — enlarge it so it reads as big as the
    // LTAP / fusionDev wordmarks rather than a tiny icon.
    src: '/assets/ZPlogo.svg',
    alt: 'Wemdinger Zeitpyramide',
    href: 'https://zeitpyramide.de/',
    imgClassName: 'h-[80px] max-h-none w-auto max-w-none',
  },
  {
    // Wordmark ships with generous transparent padding — render it larger so its
    // glyphs match the others; grayscale drops the green to a neutral B/W tone.
    src: '/assets/LTAP_Logo.png',
    alt: 'LTAP',
    href: 'https://www.milliongenerations.org/index.php?title=LTAP',
    imgClassName: 'h-[90px] max-h-none w-auto max-w-none grayscale',
  },
  {
    // Slightly smaller + a touch of transparency to soften its hard outline.
    src: '/assets/fusionDev-bw.png',
    alt: 'fusionDev',
    href: 'https://www.linkedin.com/in/daniel-bucher-3992b1141/',
    imgClassName: 'max-h-[47px] w-full opacity-90',
  },
]

function LogoCard({
  src,
  alt,
  href,
  imgClassName = 'max-h-full w-full',
}: {
  src: string
  alt: string
  href: string
  imgClassName?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={alt}
      className="flex h-[68px] items-center justify-center transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-lavender/40"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`${LOGO_BASE} ${imgClassName}`}
      />
    </a>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className="h-[21px] w-[21px]" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[21px] w-[21px]" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className="h-[21px] w-[21px]" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a6 6 0 0 1 2-2z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FooterNavLink({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group flex items-center gap-2 border-b border-ink/25 pb-1.5
                 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/65
                 transition-all duration-200 hover:border-ink/55 hover:text-ink"
    >
      {label}
      <span aria-hidden className="flex-none transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function SiteFooter() {
  const { open } = useLegalModal()

  const linkHandler = (link: FooterLink): MouseEventHandler<HTMLAnchorElement> | undefined =>
    link.legal
      ? (e) => {
          e.preventDefault()
          open(link.legal!)
        }
      : undefined

  return (
    <footer id="partner" className="bg-cream">

      {/* ══ TOP: Partner · Zeitgeist · Kontakt · CTA ══ */}
      <div className="relative z-10 mx-auto max-w-[1320px] px-6 pb-0 pt-12 sm:px-10 -mb-20">
        <div className="grid grid-cols-12 items-start gap-5 lg:gap-8">

          {/* ── Partner & Freunde — 5 cols, content capped a bit narrower ── */}
          <div className="col-span-5 max-w-[430px]">
            <h2 className="font-sans text-[clamp(20px,2vw,26px)] font-bold leading-tight tracking-tight text-ink">
              Unsere Partner & Freunde
            </h2>
            <p className="mt-2.5 font-serif text-[13.5px] leading-[1.65] text-ink/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
              <em>Consectetur adipiscing elit.</em>
            </p>

            {/* 4 partner logos — 2×2, transparent PNGs, no frame */}
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
              {PARTNERS.map((p) => (
                <LogoCard key={p.alt} {...p} />
              ))}
            </div>
          </div>

          {/* ── Teile den Zeitgeist — 3 cols ──
              pt pushes the block down to sit just above the partner-logo grid
              (roughly on the logo line, nudged up a touch). */}
          <div className="col-span-3 pt-[70px]">
            <h3 className="font-sans text-[15px] font-semibold text-ink">
              Teile den Zeitgeist
            </h3>
            <p className="mt-3 font-serif text-[13.5px] leading-[1.65] text-ink/60">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc diam
              nisi, tempus pretium sodales quis, bibendum in nibh.
            </p>
            {SHOW_SOCIALS && (
              <div className="mt-6 flex items-center gap-5 text-ink/50">
                <a href="https://instagram.com" target="_blank" rel="noreferrer noopener"
                  aria-label="Instagram" className="transition-colors hover:text-ink">
                  <IconInstagram />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer noopener"
                  aria-label="Facebook" className="transition-colors hover:text-ink">
                  <IconFacebook />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer noopener"
                  aria-label="LinkedIn" className="transition-colors hover:text-ink">
                  <IconLinkedIn />
                </a>
              </div>
            )}
          </div>

          {/* ── Kontakt info — 2 cols ── */}
          <div id="kontakt" className="col-span-2 scroll-mt-24 pt-[70px]">
            <h3 className="font-sans text-[15px] font-semibold text-ink">Kontakt</h3>
            <a href="mailto:info@digitallongview.com"
              className="mt-3 block font-sans text-[13px] text-ink/65 transition-colors hover:text-lavender">
              info@digitallongview.com
            </a>
            <a href="tel:+4915141441262"
              className="mt-1.5 block font-sans text-[13px] text-ink/65 transition-colors hover:text-lavender">
              +49 151 4144 1262
            </a>
          </div>

          {/* ── KONTAKT CTA — 2 cols ── */}
          <div className="col-span-2 pt-[70px] flex items-start">
            <a
              href="mailto:info@digitallongview.com"
              className="group inline-flex h-[52px] w-fit items-center gap-2
                         rounded-full px-8 font-sans text-[11px] font-semibold uppercase
                         tracking-[0.25em] text-white transition-all duration-200
                         hover:brightness-110 hover:shadow-[0_8px_24px_-8px_rgba(93,70,132,0.6)]
                         focus:outline-none focus:ring-4 focus:ring-lavender/40 active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
            >
              Kontakt
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

        </div>
      </div>

      {/* ══ BOTTOM STRIP ══
        *
        *  Exact same technique as ExpandedTriangleHeader in SiteHeader:
        *  clip-path + gradient background, fixed height.
        *
        *  Header:  polygon(0% 0%, 100% 0%, 100% 38%, 0% 100%)
        *    → full on LEFT,  shorter on RIGHT,  diagonal lower-left → upper-right
        *
        *  Footer (horizontal mirror):
        *           polygon(0% 0%, 100% 0%, 100% 100%, 0% 38%)
        *    → shorter on LEFT, full on RIGHT,   diagonal upper-left → lower-right
        *    → cream triangle at LOWER-LEFT  → DLV logo sits here
        *    → magenta covers upper-right    → nav links sit here
        */}
      <div
        className="relative bg-cream"
        style={{ height: 260 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: MAGENTA_GRAD,
            clipPath: 'polygon(0% 72%, 100% 0%, 100% 100%, 0% 100%)',
            boxShadow: '0 -20px 60px -30px rgba(180,100,160,0.25)',
          }}
        />

        <div className="relative mx-auto h-full max-w-[1320px] px-6 sm:px-10">

          {/* DLV logo — bottom-left */}
          <a
            href="#"
            aria-label="Digital Long View"
            className="absolute bottom-5 left-6 sm:left-10 transition-opacity
                       hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-lavender/40"
          >
            <img
              src="/assets/logo.png"
              alt="Digital Long View"
              draggable={false}
              className="h-11 w-auto select-none"
            />
          </a>

          {/* Nav links — right side, pinned to bottom of the magenta band */}
          <nav
            className="absolute right-6 sm:right-10 bottom-10"
            aria-label="Footer-Navigation"
          >
            <div className="flex gap-x-10">
              <div className="flex flex-col gap-y-3.5 justify-end">
                {FOOTER_NAV_LEFT.map(link => (
                  <FooterNavLink key={link.label} href={link.href} label={link.label} onClick={linkHandler(link)} />
                ))}
              </div>
              <div className="flex flex-col gap-y-3.5">
                {FOOTER_NAV_RIGHT.map(link => (
                  <FooterNavLink key={link.label} href={link.href} label={link.label} onClick={linkHandler(link)} />
                ))}
              </div>
            </div>
          </nav>

        </div>
      </div>

    </footer>
  )
}
