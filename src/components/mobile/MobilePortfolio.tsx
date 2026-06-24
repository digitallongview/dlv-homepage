import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { Dots, useCarousel } from './carousel'
import { useIsPhone } from '../../hooks/useMediaQuery'
import { useHlsVideo } from '../../hooks/useHlsVideo'
import { HLS, type Lang } from '../../lib/hlsSources'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Kind = 'video' | 'phonePopup' | 'videoPopup' | 'placeholder'

type Project = {
  id: string
  label: string
  title: string
  subtitle: string
  bg: string
  kind: Kind
  textA: string
  textB?: string
  link?: { href: string; label: string }
  button?: string
  source?: string
}

const PROJECTS: Project[] = [
  {
    id: 'langzeitdesign',
    label: 'Langzeitdesign',
    title: 'Langzeit-Design: Herrnhuter Galaxie',
    subtitle: 'Forschung · Workshops & Umsetzung',
    bg: '/assets/bg-langzeitdesign.png',
    kind: 'video',
    textA: 'Das Langzeit-Design-Projekt untersucht, wie gestalterische Entscheidungen über Generationen hinweg Bestand haben. Gemeinsam mit der Herrnhuter Brüdergemeine entstanden Workshops zu handwerklicher und digitaler Langlebigkeit.',
    textB: 'Das Ergebnis: eine lebendige Forschungsgrundlage für Design-Prinzipien, die weit über Trends hinausdenken — verankert in Tradition, offen für Transformation.',
    link: { href: '#', label: 'Prototyp Herrnhuter Galaxie' },
    source: 'Quelle: Herrnhuter Brüdergemeine, 2024',
  },
  {
    id: 'sophienkirche',
    label: 'Sophienkirche',
    title: 'Denkraum Sophienkirche',
    subtitle: 'Immersives Prototyping als virtuelles Erinnerungsmedium',
    bg: '/assets/bg-sophienkirche.png',
    kind: 'phonePopup',
    textA: 'Die Sophienkirche in Berlin steht als Zeugnis eines wechselvollen Jahrhunderts. Mit einem immersiven AR-Prototyp haben wir erkundet, wie digitale Erinnerungsräume historische Schichten zugänglich machen können.',
    textB: 'Der Prototyp lädt ein, Geschichte körperlich zu erfahren — durch Klang, Bild und Raum. Ein Denkraum, kein Ausstellungsstück.',
    link: { href: '#', label: 'Webseite Sophienkirche' },
    button: 'Prototyp',
    source: 'Kooperation mit Förderkreis Sophienkirche e. V.',
  },
  {
    id: 'zeitpyramide',
    label: 'Zeitpyramide',
    title: 'Die Wemdinger Zeitpyramide',
    subtitle: 'Langzeitkunstprojekt & AR-Visualisierung',
    bg: '/assets/bg-zeitpyramide.png',
    kind: 'videoPopup',
    textA: 'Alle zehn Jahre wird ein Betonblock gesetzt — 120 Blöcke, 1.200 Jahre. Wir bauen das digitale Gegenstück: eine AR-Erfahrung, die den Jahrhunderten ein Interface gibt, ohne sie zu beschleunigen.',
    textB: 'Besucher:innen können vor Ort jeden gesetzten Stein scannen, hören, was diese Generation hinterließ — und sehen, was kommt.',
    link: { href: 'https://zeitpyramide.de', label: 'Webseite der Zeitpyramiden Stiftung' },
    button: 'Web-View',
    source: 'Quelle: Stadtmuseum Wemding · Suter + Wittwer, 1993',
  },
  {
    id: 'p4',
    label: 'Titel 4',
    title: 'Kommt bald',
    subtitle: 'Nächstes Projekt in Vorbereitung',
    bg: '/assets/bg-zeitpyramide.png',
    kind: 'placeholder',
    textA: 'Dieses Projekt befindet sich derzeit in der Entwicklung. Mehr Informationen folgen in Kürze.',
  },
  {
    id: 'p5',
    label: 'Titel 5',
    title: 'Kommt bald',
    subtitle: 'Nächstes Projekt in Vorbereitung',
    bg: '/assets/bg-zeitpyramide.png',
    kind: 'placeholder',
    textA: 'Dieses Projekt befindet sich derzeit in der Entwicklung. Mehr Informationen folgen in Kürze.',
  },
]

const PILL_BG = { background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }
// Consistent pill shape for every button in this section
const PILL =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_30px_-10px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 active:scale-[0.97]'
const PILL_SM =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_-8px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 active:scale-[0.97]'

// ─── Clipped scroll box with fade edge + scroll indicator ─────────────────────

function ScrollBox({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [scrollable, setScrollable] = useState(false)

  const recompute = () => {
    const el = ref.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setScrollable(max > 8)
    setProgress(max > 0 ? el.scrollTop / max : 1)
  }
  useEffect(() => {
    recompute()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(recompute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const atBottom = progress > 0.98
  const fadeTop = scrollable && progress > 0.02
  const fadeBottom = scrollable && !atBottom
  // Alpha mask instead of a cream colour fade — the content itself dissolves at the
  // scroll edges so the photo background shows through (no opaque colour band).
  const maskImage = `linear-gradient(to bottom, ${
    fadeTop ? 'transparent 0%, #000 7%' : '#000 0%'
  }, ${fadeBottom ? '#000 85%, transparent 100%' : '#000 100%'})`

  return (
    <div className={`relative min-h-0 ${className}`}>
      <div
        ref={ref}
        onScroll={recompute}
        className="no-scrollbar h-full overflow-y-auto pr-5"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        {children}
      </div>

      {/* Scroll indicator track on the right — slim, inset, fades when not scrollable */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[2px] top-2 bottom-2 w-[2px] overflow-hidden rounded-full bg-ink/8 transition-opacity duration-300"
        style={{ opacity: scrollable ? 1 : 0 }}
      >
        <div
          className="w-full rounded-full"
          style={{
            height: '32%',
            background: 'linear-gradient(180deg, #b29bd0, #5d4684)',
            transform: `translateY(${progress * 212}%)`,
            transition: 'transform 0.08s linear',
          }}
        />
      </div>

      {/* Down chevron hint — sits in the faded zone, bounces softly while there's more below */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-lavender-dark/80 transition-opacity duration-300"
        style={{ opacity: fadeBottom ? 1 : 0, animation: fadeBottom ? 'nudge-down 1.6s ease-in-out infinite' : 'none' }}
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}

// ─── Inline video (Langzeitdesign) — pause + fullscreen ───────────────────────

function InlineVideo() {
  const [playing, setPlaying] = useState(false)
  const [lang, setLang] = useState<Lang>('de')
  const ref = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const src = lang === 'de' ? HLS.langzeitdesignDE : HLS.langzeitdesignEN
  useHlsVideo(ref, src, { preload: false })

  const switchLang = (e: MouseEvent, next: Lang) => {
    e.stopPropagation()
    if (next === lang) return
    setLang(next)
    setPlaying(false)
  }

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (playing) v.pause()
    else v.play().catch(() => {})
    setPlaying((p) => !p)
  }
  const fullscreen = (e: MouseEvent) => {
    e.stopPropagation()
    const el = wrapRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.()
  }

  return (
    <div
      ref={wrapRef}
      onClick={toggle}
      className="relative mx-auto w-full max-w-[440px] cursor-pointer select-none overflow-hidden rounded-xl bg-black"
      style={{ aspectRatio: '16/9', boxShadow: '0 16px 40px -14px rgba(0,0,0,0.5)' }}
    >
      <video
        ref={ref}
        onEnded={() => setPlaying(false)}
        preload="metadata"
        playsInline
        className={['h-full w-full object-cover transition-all duration-700', playing ? '' : 'grayscale brightness-75'].join(' ')}
      >
        {/* Fallback for the rare browser without HLS (native or MSE) */}
        <source src="/video/LANGZEITDESIGN.mp4" type="video/mp4" />
      </video>

      {/* Language toggle — DE / EN narration */}
      <div
        className="absolute top-2 left-2 z-10 flex overflow-hidden rounded-full border border-white/25 bg-black/40 backdrop-blur-sm"
        onClick={e => e.stopPropagation()}
      >
        {(['de', 'en'] as Lang[]).map(l => (
          <button
            key={l}
            onClick={e => switchLang(e, l)}
            aria-pressed={lang === l}
            className={[
              'px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] transition-colors',
              lang === l ? 'text-white' : 'text-white/45',
            ].join(' ')}
            style={lang === l ? { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' } : undefined}
          >
            {l}
          </button>
        ))}
      </div>

      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35">
          <p className="mb-1 font-sans text-[7px] font-medium uppercase tracking-[0.5em]" style={{ color: '#b29bd0' }}>
            Digital Long View
          </p>
          <p className="font-sans text-[20px] font-bold uppercase tracking-[0.2em] text-white leading-none">Long Term</p>
          <p className="mb-4 font-sans text-[20px] font-bold uppercase tracking-[0.2em] text-white leading-none">Design</p>
          <span className="grid h-12 w-12 place-items-center rounded-full shadow-lg" style={PILL_BG}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5 text-white"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </div>
      )}

      <button
        onClick={fullscreen}
        aria-label="Vollbild"
        className="absolute bottom-2 right-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  )
}

// ─── Popup shell ──────────────────────────────────────────────────────────────

function Popup({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center px-4 py-6"
      style={{ background: 'rgba(20,14,30,0.82)', backdropFilter: 'blur(6px)', animation: 'popup-in 0.3s ease-out both' }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-full flex-col items-center">
        {children}
      </div>
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="mt-7 flex flex-none flex-col items-center gap-1.5 text-white/85 transition-colors hover:text-white"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full border border-white/50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-5 w-5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </span>
        <span className="font-sans text-[11px] uppercase tracking-[0.3em]">Close</span>
      </button>
    </div>
  )
}

// ─── Sophienkirche popup — portrait phone with looping video ──────────────────

function SophienPhonePopup({ onClose }: { onClose: () => void }) {
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  useHlsVideo(videoRef, HLS.sophienkirche, { preload: true })
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }
  return (
    <Popup onClose={onClose}>
      <div className="relative" style={{ width: 'min(62vw, 230px)' }}>
        <div className="absolute overflow-hidden" style={{ top: '2%', left: '3%', right: '3%', bottom: '2%', borderRadius: 22 }}>
          <video ref={videoRef} autoPlay muted loop playsInline className="h-full w-full object-cover">
            {/* Fallback for the rare browser without HLS (native or MSE) */}
            <source src="/video/Sophienkirche-Prototyp.mp4" type="video/mp4" />
          </video>
        </div>
        <img src="/assets/phone.png" alt="Smartphone Sophienkirche" draggable={false} className="relative z-10 w-full select-none" />
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Ton ein' : 'Ton aus'}
          className="absolute bottom-7 right-4 z-20 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.46-1.32L19 21l1.73-1.73L5.73 4.27 4.27 3zM12 4 9.91 6.09 12 8.18z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
          )}
        </button>
      </div>
    </Popup>
  )
}

// ─── Zeitpyramide popup — landscape video player with AR/UAV swap ──────────────

function ZeitVideoPopup({ onClose }: { onClose: () => void }) {
  const [vid, setVid] = useState<'ar' | 'uav'>('ar')
  const arRef = useRef<HTMLVideoElement>(null)
  const uavRef = useRef<HTMLVideoElement>(null)
  // AR auto-plays on mount → preload + autoPlay attr (avoids a play()/attach race).
  // UAV loads lazily once the user swaps to it (that play() runs post-attach).
  useHlsVideo(arRef,  HLS.zpAr,  { preload: true })
  useHlsVideo(uavRef, HLS.zpUav, { preload: false })
  useEffect(() => {
    const ar = arRef.current
    const uav = uavRef.current
    if (!ar || !uav) return
    if (vid === 'ar') {
      uav.pause()
      ar.play().catch(() => {})
    } else {
      ar.pause()
      uav.play().catch(() => {})
    }
  }, [vid])

  return (
    <Popup onClose={onClose}>
      <div className="flex flex-col" style={{ width: 'min(92vw, 460px)' }}>
        <button onClick={() => setVid((v) => (v === 'ar' ? 'uav' : 'ar'))} className={`mb-3 self-end ${PILL_SM}`} style={PILL_BG}>
          {vid === 'ar' ? 'UAV-Video' : 'AR-Video'} <span aria-hidden className="text-[8px] opacity-70">▶</span>
        </button>
        <div className="relative overflow-hidden rounded-2xl bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]" style={{ aspectRatio: '16/9' }}>
          <video ref={arRef} autoPlay playsInline controls preload="auto" className="absolute inset-0 h-full w-full transition-opacity duration-300" style={{ opacity: vid === 'ar' ? 1 : 0, pointerEvents: vid === 'ar' ? 'auto' : 'none' }}>
            <source src="/video/ZP-AR.mp4" type="video/mp4" />
          </video>
          <video ref={uavRef} playsInline controls preload="auto" className="absolute inset-0 h-full w-full transition-opacity duration-300" style={{ opacity: vid === 'uav' ? 1 : 0, pointerEvents: vid === 'uav' ? 'auto' : 'none' }}>
            <source src="/video/ZP-UAV.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </Popup>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

function ProjectPanel({ p, onOpenPopup }: { p: Project; onOpenPopup: (id: string) => void }) {
  return (
    <div className="flex h-full w-full flex-none snap-center flex-col items-center px-6 min-[800px]:items-start min-[800px]:px-10">
      {/* Text column stays at a readable measure but left-aligns under the wider
          heading on narrow-desktop, so both share the same left edge */}
      <div className="flex h-full w-full max-w-[560px] flex-col min-[800px]:max-w-[620px]">
        <h3 className="font-sans text-[26px] font-semibold leading-[1.12] tracking-tight text-ink">{p.title}</h3>
        <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-lavender">{p.subtitle}</p>

        {/* Content area — scrollbox grows, media pinned below */}
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <ScrollBox className="flex-1">
            <p className="font-serif text-[14px] leading-[1.72] text-ink/72">{p.textA}</p>
            {p.textB && <p className="mt-3 font-serif text-[14px] leading-[1.72] text-ink/72">{p.textB}</p>}

            {p.link && (
              <a
                href={p.link.href}
                target={p.link.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer noopener"
                className="group mt-5 flex items-center justify-between gap-3 border-b border-ink/30 pb-1 font-sans text-[12px] font-medium text-ink/60"
              >
                {p.link.label}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            )}

            {/* Popup trigger — extra breathing room after the link */}
            {(p.kind === 'phonePopup' || p.kind === 'videoPopup') && (
              <button onClick={() => onOpenPopup(p.id)} className={`mt-9 w-full ${PILL}`} style={PILL_BG}>
                {p.button}
              </button>
            )}

            {p.source && <p className="mt-5 font-sans text-[10px] tracking-wider text-ink/35">{p.source}</p>}
          </ScrollBox>

          {/* Inline video for langzeitdesign */}
          {p.kind === 'video' && (
            <div className="mt-4 flex-none pb-1">
              <InlineVideo />
            </div>
          )}
          {p.kind === 'placeholder' && (
            <div className="mt-4 grid flex-none place-items-center rounded-xl border-2 border-dashed border-ink/12 py-10">
              <span className="font-sans text-[11px] uppercase tracking-widest text-ink/30">Demnächst</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MobilePortfolio() {
  const { trackRef, active, goTo } = useCarousel()
  const [popup, setPopup] = useState<string | null>(null)
  const isPhone = useIsPhone()

  return (
    <section id="portfolio" className="relative flex h-[100svh] scroll-mt-4 flex-col overflow-hidden bg-cream pt-14 pb-7">
      {/* Background crossfade */}
      {PROJECTS.map((p, i) => (
        <img
          key={p.id}
          src={p.bg}
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700"
          style={{ opacity: active === i ? 1 : 0 }}
        />
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-cream/72" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cream to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" />

      {/* Static heading — left-aligned & widened on narrow-desktop (≥800px) so it
          reads linksbündig instead of an indented centred column */}
      <div className="relative z-10 mx-auto w-full max-w-[560px] px-6 min-[800px]:mx-0 min-[800px]:max-w-[760px] min-[800px]:px-10">
        <h2 className="font-sans text-[28px] font-bold uppercase leading-[1.1] tracking-[0.02em] text-ink min-[800px]:text-[40px]">
          Langzeit-Kultur{' '}<br className="min-[800px]:hidden" />& Portfolio
        </h2>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-ink/35 via-ink/12 to-transparent" />
      </div>

      {/* Swipe track */}
      <div ref={trackRef} className="no-scrollbar relative z-10 mt-5 flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto">
        {PROJECTS.map((p) => (
          <ProjectPanel key={p.id} p={p} onOpenPopup={setPopup} />
        ))}
      </div>

      {/* Indicator + active label */}
      <div className="relative z-10 mt-4">
        <Dots count={PROJECTS.length} active={active} onSelect={goTo} showArrows={!isPhone} />
        <p className="mt-3 text-center font-serif text-[13px] italic text-ink/60">{PROJECTS[active]?.label}</p>
      </div>

      {/* Popups */}
      {popup === 'sophienkirche' && <SophienPhonePopup onClose={() => setPopup(null)} />}
      {popup === 'zeitpyramide' && <ZeitVideoPopup onClose={() => setPopup(null)} />}
    </section>
  )
}
