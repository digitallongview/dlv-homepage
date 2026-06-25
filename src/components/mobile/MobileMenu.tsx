import { useEffect, useRef, useState, type RefObject } from 'react'

const LILA_GRADIENT = 'linear-gradient(125deg, #a991c7 0%, #8c74aa 55%, #6a4f8e 100%)'
// Clean keil: full at top, the raised diagonal runs to a SINGLE point at the
// bottom-left corner (no truncated tip); larger cream triangle bottom-right.
// KEIL_RIGHT = height (as a fraction) where the diagonal meets the right edge.
const KEIL_RIGHT = 0.58
const CLIP = `polygon(0 0, 100% 0, 100% ${KEIL_RIGHT * 100}%, 0 100%)`

const smoothstep = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

// Live measurements that keep the keil correct at every viewport:
//  • deg  — the diagonal drops (1 − KEIL_RIGHT)·H over the width W, so its angle is
//    atan((1 − KEIL_RIGHT)·H / W). A fixed angle drifts as the aspect ratio changes;
//    measuring keeps the logo exactly parallel to the cut.
//  • reqH — the diagonal meets the RIGHT edge at KEIL_RIGHT·H, so an anchor only
//    stays inside the violet if its bottom is above that line. Sizing the keil to
//    (navBottom + buffer) / KEIL_RIGHT guarantees no anchor is ever clipped into the
//    cream triangle — short on tall phones, taller on short/wide desktops.
function useKeilMetrics(
  rootRef: RefObject<HTMLElement | null>,
  navRef: RefObject<HTMLElement | null>,
) {
  const [deg, setDeg] = useState(40)
  const [reqH, setReqH] = useState(0)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => {
      const w = root.clientWidth
      const h = root.clientHeight
      if (w > 0 && h > 0) setDeg((Math.atan(((1 - KEIL_RIGHT) * h) / w) * 180) / Math.PI)
      const nav = navRef.current
      if (nav) {
        const navBottom = nav.getBoundingClientRect().bottom - root.getBoundingClientRect().top
        setReqH(Math.ceil((navBottom + 32) / KEIL_RIGHT))
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    if (navRef.current) ro.observe(navRef.current)
    return () => ro.disconnect()
  }, [rootRef, navRef])
  return { deg, reqH }
}

const NAV = [
  { label: 'Kontakt', href: '#kontakt' },
  { label: 'Footer', href: '#footer' },
  { label: 'Wer sind wir?', href: '#wer-sind-wir' },
  { label: 'Was ist Long View?', href: '#was-ist' },
]

function NavRow({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group flex items-center justify-between border-b border-white/40 pb-3 font-sans text-[22px] font-bold uppercase tracking-[0.05em] text-white"
    >
      {label}
      <span aria-hidden className="text-[18px] text-white/80 transition-transform group-hover:translate-x-1.5">→</span>
    </a>
  )
}

/** The violet keil panel: wedge + nav links + logo (+ close button when `onClose` is
 *  given, e.g. the overlay). `fill` makes it cover at least the viewport (for the
 *  overlay); the in-flow screen is left content-sized so it stays compact on tall
 *  phones. The close button lives INSIDE the panel so it tracks the panel geometry
 *  (always in the violet, clear of the anchors) even when the panel is taller than
 *  the viewport. */
function MenuPanel({ wedgeShown, onNavClick, onClose, fill = false }: { wedgeShown: boolean; onNavClick?: () => void; onClose?: () => void; fill?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const { deg, reqH } = useKeilMetrics(rootRef, navRef)
  const minHeight = reqH
    ? fill ? `max(100svh, ${reqH}px)` : `${reqH}px`
    : fill ? '100svh' : undefined
  return (
    <div ref={rootRef} className="relative w-full overflow-hidden bg-cream" style={{ minHeight }}>
      {/* Violet keil — slides down from the top when shown */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: LILA_GRADIENT,
          clipPath: CLIP,
          boxShadow: '0 30px 60px -30px rgba(45,31,77,0.6)',
          transform: wedgeShown ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />

      {/* Nav links — fade/rise in only AFTER the violet keil has slid in */}
      <div
        className="relative z-10 flex flex-col px-7 pt-16"
        style={{
          opacity: wedgeShown ? 1 : 0,
          transform: wedgeShown ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s',
        }}
      >
        <nav ref={navRef} className="flex flex-col gap-8" aria-label="Hauptnavigation">
          {NAV.map((item) => (
            <NavRow key={item.href} label={item.label} href={item.href} onClick={onNavClick} />
          ))}
        </nav>
      </div>

      {/* DLV logo — centred on the cream triangle's centroid (≈2/3 W, ≈0.86 H) and
          rotated to run exactly parallel to the diagonal, computed from the live
          panel size so it never looks arbitrary as the width changes. */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: '66.7%',
          top: '86%',
          transform: `translate(-50%, -50%) rotate(${-deg}deg)`,
          opacity: wedgeShown ? 1 : 0,
          transition: 'opacity 0.5s ease 0.6s',
        }}
      >
        <img
          src="/assets/logo.png"
          alt="Digital Long View"
          draggable={false}
          className="w-auto max-w-none select-none"
          style={{ height: 'clamp(52px, 15vw, 84px)' }}
        />
      </div>

      {/* Close button — parked in the wide part of the violet wedge (clear of the
          diagonal and the anchors at every size) so neither circle nor label clips */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Menü zu"
          className="absolute bottom-[22%] left-7 z-20 flex flex-col items-center gap-1.5 text-white/90 transition-colors hover:text-white"
          style={{ opacity: wedgeShown ? 1 : 0, transition: 'opacity 0.5s ease 0.6s' }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/55">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
          <span className="font-sans text-[11px] uppercase tracking-[0.25em]">Menü zu</span>
        </button>
      )}
    </div>
  )
}

function HamburgerIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`h-6 w-6 ${className}`}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export default function MobileMenu() {
  const sectionRef = useRef<HTMLElement>(null)
  const [wedgeIn, setWedgeIn] = useState(false)

  const [overlayOpen, setOverlayOpen] = useState(false)
  // Migrating trigger: prog 0 = just spawned up inside the violet keil (left, cream),
  // 1 = parked top-right (violet). It travels up-right between the two.
  const [prog, setProg] = useState(0)
  const [leftPx, setLeftPx] = useState(20)
  const [topPx, setTopPx] = useState(0)
  const [triggerOn, setTriggerOn] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setWedgeIn(true) },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Trigger spawns up inside the violet keil and rides it up to the top-right corner.
  useEffect(() => {
    const BTN = 48
    const INSET = 20
    const PIN = 0.62       // doc anchor as a fraction of the keil height — just below
                           // the links, so the button always stays clear of them
    const SPAWN_AT = 0.72  // fade in once it has risen to this fraction of the viewport
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const vh = window.innerHeight
      const vw = window.innerWidth
      // Pin to a point just below the anchors so the button rides UP together with the
      // keil — never crossing the links — and parks top-right as the keil scrolls away.
      const docAnchorY = el.offsetTop + el.offsetHeight * PIN
      const viewportY = docAnchorY - window.scrollY
      const spawnY = vh * SPAWN_AT
      const e = clamp01((spawnY - viewportY) / (spawnY - INSET))
      const nearBottom = window.scrollY + vh > document.body.scrollHeight - vh * 1.6
      const on = viewportY < spawnY && !nearBottom && !overlayOpen
      setTriggerOn(on)
      const ee = smoothstep(e)
      setProg(ee)
      // Vertical rides 1:1 with the keil (stays glued below the links); horizontal
      // eases left → right as it rises, parking in the top-right corner.
      setLeftPx(INSET + ee * (vw - 2 * INSET - BTN))
      setTopPx(Math.max(INSET, viewportY))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [overlayOpen])

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [overlayOpen])

  return (
    <>
      {/* In-flow nav screen, right after the hero — no close button */}
      <section ref={sectionRef} aria-label="Navigation">
        <MenuPanel wedgeShown={wedgeIn} />
      </section>

      {/* Migrating trigger — cream→violet as it shoots up the diagonal, parks top-right */}
      <button
        onClick={() => setOverlayOpen(true)}
        aria-label="Menü öffnen"
        className="fixed z-[90] grid h-12 w-12 place-items-center rounded-full shadow-[0_10px_26px_-8px_rgba(45,31,77,0.6)] transition-opacity duration-200"
        style={{
          left: leftPx,
          top: topPx,
          opacity: triggerOn ? 1 : 0,
          pointerEvents: triggerOn ? 'auto' : 'none',
        }}
      >
        {/* cream layer (fades out toward the edge) */}
        <span
          className="absolute inset-0 grid place-items-center rounded-full border border-lavender/30 bg-cream text-lavender-dark"
          style={{ opacity: 1 - prog }}
        >
          <HamburgerIcon />
        </span>
        {/* violet layer (fades in toward the edge) */}
        <span
          className="absolute inset-0 grid place-items-center rounded-full text-white"
          style={{ opacity: prog, background: LILA_GRADIENT }}
        >
          <HamburgerIcon />
        </span>
        {/* "Menü" label — shown while the trigger first spawns inside the keil,
            fades out as it migrates up-right to its parked corner */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white"
          style={{ opacity: Math.max(0, 1 - prog * 1.5) }}
        >
          Menü
        </span>
      </button>

      {/* Overlay — slides from the top; scrolls if the keil is taller than the
          viewport (short/wide windows) so the whole menu stays reachable */}
      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{
          transform: overlayOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          pointerEvents: overlayOpen ? 'auto' : 'none',
          visibility: overlayOpen ? 'visible' : 'hidden',
        }}
        aria-hidden={!overlayOpen}
      >
        <MenuPanel
          wedgeShown
          fill
          onNavClick={() => setOverlayOpen(false)}
          onClose={() => setOverlayOpen(false)}
        />
      </div>
    </>
  )
}
