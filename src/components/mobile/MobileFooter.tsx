import type { MouseEventHandler } from 'react'
import { useLegalModal } from '../legal/LegalModal'
import type { LegalKey } from '../../lib/legalContent'

const MAGENTA_GRAD = 'linear-gradient(150deg, #e7cfe3 0%, #d7accf 45%, #c79bc6 100%)'

// Social-Media-Icons sind vorerst deaktiviert (Markup bleibt erhalten).
// Auf `true` setzen, um sie wieder anzuzeigen.
const SHOW_SOCIALS = false

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a6 6 0 0 1 2-2z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function LogoTile({ src, alt, href, imgClassName = 'max-h-full w-full' }: { src: string; alt: string; href: string; imgClassName?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" aria-label={alt} className="flex h-16 items-center justify-center transition-opacity hover:opacity-70">
      <img src={src} alt={alt} draggable={false} className={`select-none object-contain object-center ${imgClassName}`} />
    </a>
  )
}

function LowerNavLink({
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
      className="group flex items-center justify-between border-b border-white/45 pb-2 font-sans text-[15px] font-semibold uppercase tracking-[0.12em] text-white/95"
    >
      {label}
      <span aria-hidden className="text-white/70 transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}

export default function MobileFooter() {
  const { open } = useLegalModal()
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const openLegal = (key: LegalKey): MouseEventHandler<HTMLAnchorElement> => (e) => {
    e.preventDefault()
    open(key)
  }

  return (
    <footer id="footer" className="bg-cream">
      {/* ─────────── Upper footer ─────────── */}
      <div id="kontakt" className="relative flex min-h-[100svh] scroll-mt-4 flex-col justify-start px-7 pt-12 pb-32">
        {/* Partner block — capped width + left-aligned so it doesn't stretch
            edge-to-edge on wide portrait tablets (which still get this layout). */}
        <div className="max-w-[340px]">
          <h2 className="font-sans text-[26px] font-bold leading-tight tracking-tight text-ink">Unsere Partner & Freunde</h2>
          <p className="mt-3 font-serif text-[13.5px] leading-[1.6] text-ink/60">
            Wir arbeiten mit Stiftungen, Initiativen und Kunstprojekten zusammen, deren
            Horizont über die nächste Förderperiode hinausreicht. <em>Gemeinsam, mit langem Atem.</em>
          </p>

          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5">
            <LogoTile src="/assets/mglogo.png" alt="Million Generations" href="https://www.milliongenerations.org/index.php?title=Main_Page" imgClassName="max-h-[50px] w-full" />
            <LogoTile src="/assets/ZPlogo.svg" alt="Wemdinger Zeitpyramide" href="https://zeitpyramide.de/" imgClassName="h-[62px] max-h-none w-auto max-w-none" />
            <LogoTile src="/assets/LTAP_Logo.png" alt="LTAP" href="https://www.milliongenerations.org/index.php?title=LTAP" imgClassName="h-[84px] max-h-none w-auto max-w-none grayscale" />
            <LogoTile src="/assets/fusionDev-bw.png" alt="fusionDev" href="https://www.linkedin.com/in/daniel-bucher-3992b1141/" imgClassName="max-h-[44px] w-full opacity-90" />
          </div>
        </div>

        {/* "Teile den Zeitgeist" — centered block, fixed 250px width, text stays left-aligned */}
        <div className="mt-20 w-[250px] self-center text-left">
          <h3 className="font-sans text-[17px] font-semibold text-ink">Teile den Zeitgeist</h3>
          <p className="mt-3 font-serif text-[14px] leading-[1.7] text-ink/65">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc diam nisi, tempus
            pretium sodales quis, bibendum in nibh.
          </p>
          {SHOW_SOCIALS && (
            <div className="mt-6 flex items-center gap-7 text-ink/55">
              <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" aria-label="Instagram" className="transition-colors hover:text-ink"><IconInstagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer noopener" aria-label="Facebook" className="transition-colors hover:text-ink"><IconFacebook /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="transition-colors hover:text-ink"><IconLinkedIn /></a>
            </div>
          )}
        </div>

        <div className="absolute bottom-6 right-7 text-right">
          <h3 className="font-sans text-[17px] font-semibold text-ink">Kontakt</h3>
          <a href="mailto:info@digitallongview.com" className="mt-3 block font-sans text-[15px] text-ink/70 transition-colors hover:text-lavender">info@digitallongview.com</a>
          <a href="tel:+4915141441262" className="mt-1.5 block font-sans text-[15px] text-ink/70 transition-colors hover:text-lavender">+49 151 4144 1262</a>
        </div>
      </div>

      {/* ─────────── Lower footer — keil ─────────── */}
      <div className="relative min-h-[100svh] overflow-hidden bg-cream">
        {/* Magenta keil — vertical mirror of the nav keil: the raised diagonal runs
            to a SINGLE point at the top-left corner; large cream triangle across the
            top holds the KONTAKT pill. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: MAGENTA_GRAD, clipPath: 'polygon(0 0, 100% 26%, 100% 100%, 0 100%)' }}
        />

        {/* KONTAKT pill in the cream corner — pill-shaped, sits clear of the magenta */}
        <a
          href="#kontakt"
          className="group absolute right-5 top-0 z-20 inline-flex h-12 items-center gap-2 rounded-full px-7 font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_-10px_rgba(93,70,132,0.7)]"
          style={{ background: 'linear-gradient(135deg, #8c74aa 0%, #5d4684 100%)' }}
        >
          Kontakt
          <span aria-hidden className="text-white/80 transition-transform group-hover:translate-x-1">→</span>
        </a>

        <div className="relative z-10 flex min-h-[100svh] flex-col px-7 pt-28 pb-12">
          {/* START button */}
          <button onClick={toTop} className="group flex w-fit flex-col items-center gap-2 text-white" aria-label="Zum Seitenanfang">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-white/60 transition-transform group-hover:-translate-y-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
            <span className="font-sans text-[12px] uppercase tracking-[0.25em]">Start</span>
          </button>

          {/* Legal nav — the magenta diagonal meets the right edge at 26% of the
              height, so the nav must start below ~30vh or the first link (and its
              arrow) would bleed into the cream triangle on wide/tall viewports. */}
          <nav className="mt-[max(6rem,calc(32vh_-_12rem))] flex flex-col gap-7" aria-label="Footer-Navigation">
            <LowerNavLink href="#impressum" label="Impressum" onClick={openLegal('impressum')} />
            <LowerNavLink href="#datenschutz" label="Datenschutz" onClick={openLegal('datenschutz')} />
            <LowerNavLink href="#cookies" label="Cookies" />
            <span id="agbs" className="block scroll-mt-4"><LowerNavLink href="#agbs" label="AGBs" /></span>
          </nav>

          {/* Logo */}
          <div className="mt-auto flex justify-center pt-12">
            <img src="/assets/logo-weiss.png" alt="Digital Long View" draggable={false} className="h-14 w-auto select-none opacity-90" />
          </div>
        </div>
      </div>
    </footer>
  )
}
