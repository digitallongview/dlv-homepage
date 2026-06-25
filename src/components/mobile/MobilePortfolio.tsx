import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Dots, useCarousel } from './carousel'
import { useIsPhone, useMediaQuery } from '../../hooks/useMediaQuery'
import { useHlsVideo } from '../../hooks/useHlsVideo'
import { HLS, type Lang } from '../../lib/hlsSources'
import SectionHeading from '../SectionHeading'
import VrGlasses from '../VrGlasses'
import PcWebsites from '../PcWebsites'

// ─── Data ─────────────────────────────────────────────────────────────────────

type Kind = 'video' | 'phonePopup' | 'videoPopup' | 'glasses' | 'websites' | 'placeholder'

type Project = {
  id: string
  label: string
  title: string
  subtitle: string
  bg: string
  /** object-position for the cover photo. The photos are wide ~2:1 landscapes with
   *  the subject (star, bell, pyramid) on the right; the tall narrow/portrait crop
   *  blows them up, so a hard right bias parks that close-up dead-centre and the
   *  subject reads as huge. We pull left of the subject instead: it sits toward the
   *  right edge while the scene around it (courtyard, building, field) stays in
   *  frame, so it no longer dominates. (Pan only — never scales/zooms the photo.) */
  bgPos?: string
  /** Darker photo → the shared cream wash lets too much through on the right.
   *  Flagged slides get an extra right-side cream boost so their right edge matches
   *  the lighter slides. */
  scrim?: boolean
  kind: Kind
  textA: string
  textB?: string
  textC?: ReactNode
  link?: { href: string; label: string; external?: boolean }
  download?: { href: string; label: string }
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
    bgPos: '78% center',
    kind: 'video',
    textA: 'Das Langzeit-Design-Projekt untersucht, wie gestalterische Entscheidungen über Generationen hinweg Bestand haben. Gemeinsam mit der Herrnhuter Brüdergemeine entstanden Workshops zu handwerklicher und digitaler Langlebigkeit.',
    textB: 'Das Ergebnis: eine lebendige Forschungsgrundlage für Design-Prinzipien, die weit über Trends hinausdenken — verankert in Tradition, offen für Transformation.',
    link: { href: 'https://herrnhuter.digitallongview.com/', label: 'Prototyp Herrnhuter Galaxie', external: true },
    download: { href: '/assets/Was ist Langzeitdesign.pdf', label: 'Download PDF zu LTD' },
    button: 'Vortrag',
    source: 'Quelle: Herrnhuter Brüdergemeine, 2024',
  },
  {
    id: 'sophienkirche',
    label: 'Sophienkirche',
    title: 'Denkraum Sophienkirche',
    subtitle: 'Immersives Prototyping als virtuelles Erinnerungsmedium',
    bg: '/assets/bg-sophienkriche-glocke.jpg',
    // Interior lapidarium: the carved relief slabs sit on the left wall, so we pull
    // left to feature them (unlike the star/pyramid, whose subjects are on the right).
    bgPos: '38% center',
    scrim: true,
    kind: 'phonePopup',
    textA: 'Die Sophienkirche in Berlin steht als Zeugnis eines wechselvollen Jahrhunderts. Mit einem immersiven AR-Prototyp haben wir erkundet, wie digitale Erinnerungsräume historische Schichten zugänglich machen können.',
    textB: 'Der Prototyp lädt ein, Geschichte körperlich zu erfahren — durch Klang, Bild und Raum. Ein Denkraum, kein Ausstellungsstück.',
    link: { href: 'https://www.denkraum-sophienkirche.de/', label: 'Webseite Sophienkirche', external: true },
    button: 'Prototyp',
    source: 'Kooperation mit Förderkreis Sophienkirche e. V.',
  },
  {
    id: 'zeitpyramide',
    label: 'Zeitpyramide',
    title: 'Die Wemdinger Zeitpyramide',
    subtitle: 'Langzeitkunstprojekt & AR-Visualisierung',
    bg: '/assets/bg-zeitpyramide.png',
    bgPos: '55% center',
    kind: 'videoPopup',
    textA: 'Alle zehn Jahre wird ein Betonblock gesetzt — 120 Blöcke, 1.200 Jahre. Wir bauen das digitale Gegenstück: eine AR-Erfahrung, die den Jahrhunderten ein Interface gibt, ohne sie zu beschleunigen.',
    textB: 'Besucher:innen können vor Ort jeden gesetzten Stein scannen, hören, was diese Generation hinterließ — und sehen, was kommt.',
    link: { href: 'https://zeitpyramide.de', label: 'Webseite der Zeitpyramiden Stiftung', external: true },
    button: 'Visualisierung',
    source: 'Quelle: Stadtmuseum Wemding · Suter + Wittwer, 1993',
  },
  {
    id: 'vrlab',
    label: 'VRlab',
    title: 'VRlab',
    subtitle: 'VR-Entwicklung für das Deutsche Museum',
    bg: '/assets/background-vrlab.png',
    // Pan the crop toward the right so Lilienthal's glider (on the right of the
    // scene) stays in frame instead of being cropped out by the portrait/narrow cut.
    bgPos: '72% center',
    scrim: true,
    kind: 'glasses',
    textA: 'Im XR Hub des Deutschen Museums wurde eine bestehende VR Experience weiterentwickelt, um historische Inhalte durch immersive Erlebnisse zugänglicher und interaktiver zu gestalten. Dabei stand die Verbindung von User Experience, Storytelling und historischer Einordnung im Mittelpunkt.',
    textB: 'Aus der virtuellen Betrachtung bedeutender Exponate wie dem Benz Patent-Motorwagen, Otto Lilienthals Flugapparat, der Sulzer Dampfmaschine oder der Apollo-13-Mission entsteht eine Erfahrung, in der Besucher aktiv in vergangene Momente eintauchen können. Ob beim Zusammenbau des Motors gemeinsam mit Bertha Benz vor ihrer ersten längeren Testfahrt oder als Reporter einer Berliner Tageszeitung beim Start zu Otto Lilienthals nächstem Flug – die Besucher werden Teil historischer Ereignisse und erleben technische Meilensteine aus einer neuen Perspektive.',
    textC: <strong className="font-normal italic">Der XR Raum schafft so eine Brücke zwischen Museum, Technologie und interaktivem Lernen – Geschichte wird nicht nur betrachtet, sondern erlebbar gemacht.</strong>,
    link: { href: 'https://www.deutsches-museum.de/museumsinsel/programm/programm-a-z/vrlab', label: 'VRlab am Deutschen Museum', external: true },
    button: 'VR-Experience',
    source: 'Bilder: Deutsches Museum · Forum der Zukunft, 2022',
  },
  {
    id: 'p5',
    label: 'Titel 5',
    title: 'Kommt bald',
    subtitle: 'Nächstes Projekt in Vorbereitung',
    bg: '/assets/pacelayer.jpg',
    scrim: true,
    kind: 'websites',
    textA: 'Dieses Projekt befindet sich derzeit in der Entwicklung. Mehr Informationen folgen in Kürze.',
    button: 'Websites',
  },
]

const PILL_BG = { background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }
// Consistent pill shape for every button in this section
const PILL =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_30px_-10px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 active:scale-[0.97]'
const PILL_SM =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_-8px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 active:scale-[0.97]'
// Compact pill for the on-frame AR/UAV swap buttons of the inline Zeitpyramide phone
const ZP_PILL =
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[9.5px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_4px_14px_-4px_rgba(93,70,132,0.7)] transition-all hover:shadow-[0_6px_18px_-4px_rgba(93,70,132,0.9)] active:scale-[0.97]'

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

function InlineVideo({ align = 'center', active = true }: { align?: 'center' | 'left'; active?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [lang, setLang] = useState<Lang>('de')
  const [isFs, setIsFs] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const src = lang === 'de' ? HLS.langzeitdesignDE : HLS.langzeitdesignEN
  useHlsVideo(ref, src, { preload: false })

  // Pause when this slide is swiped/scrolled out of view. It keeps its play UI, so
  // it stays paused on return — the viewer presses play again.
  useEffect(() => {
    if (active) return
    const v = ref.current
    if (v && !v.paused) v.pause()
    setPlaying(false)
  }, [active])

  // Track fullscreen on this player. Inline we crop to fill the rounded frame
  // (object-cover); fullscreen we letterbox so the whole 16:9 frame shows and is
  // never cropped on any screen (object-contain).
  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

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
      className={[
        'relative w-full cursor-pointer select-none overflow-hidden bg-black',
        isFs ? '' : 'max-w-[440px] rounded-xl',
        align === 'center' && !isFs ? 'mx-auto' : '',
      ].join(' ')}
      // `translateZ(0)` promotes the clip box to its own layer so the rounded corners
      // clip the filtered <video> child cleanly — kills the thin black edge that used
      // to flash on narrow viewports. The inner shadow (vignette below) mirrors the
      // desktop player, just lighter.
      style={
        isFs
          ? { aspectRatio: 'auto' }
          : { aspectRatio: '16/9', transform: 'translateZ(0)', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4), 0 16px 40px -14px rgba(0,0,0,0.5)' }
      }
    >
      <video
        ref={ref}
        onEnded={() => setPlaying(false)}
        preload="metadata"
        playsInline
        className={[
          'h-full w-full transition-all duration-700',
          isFs ? 'object-contain' : 'object-cover',
          playing ? '' : 'grayscale brightness-75',
        ].join(' ')}
      >
        {/* Fallback for the rare browser without HLS (native or MSE) */}
        <source src="/video/LANGZEITDESIGN.mp4" type="video/mp4" />
      </video>

      {/* Inner shadow — desktop look (lighter); its dark edge also hides any residual
          rounded-corner hairline. Hidden in fullscreen so it doesn't dim the frame. */}
      {!isFs && (
        <div className="pointer-events-none absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 0 34px rgba(0,0,0,0.32)' }} />
      )}

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
  // Keep the latest onClose without re-running the lock effect (a re-run would
  // recapture scrollY as 0 while the body is already pinned, breaking restore).
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    document.addEventListener('keydown', onKey)
    // Robust scroll lock for touch devices: `overflow:hidden` alone does NOT stop
    // iOS/touch scrolling behind the overlay. Pin the body in place and restore the
    // exact scroll offset on close, so the page can only scroll once the popup is shut.
    const { body } = document
    const scrollY = window.scrollY
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
    }
  }, [])

  // Portalled to <body> so the overlay escapes the portfolio section's `z-0`
  // stacking context — otherwise later sections (e.g. Leistungen images) paint over
  // it. At the body level its z sits above all page chrome (header z-50, menu z-90/
  // 100), just under the legal modal (z-200).
  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center gap-4 px-4 py-4"
      style={{ background: 'rgba(20,14,30,0.82)', backdropFilter: 'blur(6px)', animation: 'popup-in 0.3s ease-out both' }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="flex min-h-0 max-h-full flex-col items-center">
        {children}
      </div>
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="flex flex-none flex-col items-center gap-1.5 text-white/85 transition-colors hover:text-white"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full border border-white/50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-5 w-5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </span>
        <span className="font-sans text-[11px] uppercase tracking-[0.3em]">Close</span>
      </button>
    </div>,
    document.body,
  )
}

// ─── Sophienkirche portrait→landscape rotation ────────────────────────────────
// Mirrors the desktop player: the phone turns to landscape between 0:51 and 3:36 of
// the looping prototype, then back — synced to the video so it works across loops.

function useSophienRotation(videoRef: RefObject<HTMLVideoElement | null>) {
  const [rotated, setRotated] = useState(false)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => setRotated(v.currentTime >= 51 && v.currentTime < 216)
    v.addEventListener('timeupdate', onTime)
    return () => v.removeEventListener('timeupdate', onTime)
  }, [videoRef])
  return rotated
}

const ROTATE_TRANSITION = 'transform 0.6s ease-in-out'

// ─── Sophienkirche popup — portrait phone with looping video ──────────────────

function SophienPhonePopup({ onClose }: { onClose: () => void }) {
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  useHlsVideo(videoRef, HLS.sophienkirche, { preload: true })
  const rotated = useSophienRotation(videoRef)
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }
  return (
    <Popup onClose={onClose}>
      {/* Width caps so the rotated landscape phone (≈1.96× the portrait width) still
          fits across the viewport, and the portrait height still fits short screens. */}
      <div
        className="relative"
        style={{
          width: 'min(47vw, 200px, 34vh)',
          transform: rotated ? 'rotate(-90deg)' : 'rotate(0deg)',
          transition: ROTATE_TRANSITION,
        }}
      >
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
  const [uavLang, setUavLang] = useState<Lang>('de')
  const arRef = useRef<HTMLVideoElement>(null)
  const uavRef = useRef<HTMLVideoElement>(null)
  // AR auto-plays on mount → preload + autoPlay attr (avoids a play()/attach race).
  // UAV loads lazily once the user swaps to it (that play() runs post-attach).
  // The UAV clip has DE/EN narration; swapping the source re-attaches the stream.
  useHlsVideo(arRef,  HLS.zpAr, { preload: true })
  useHlsVideo(uavRef, uavLang === 'de' ? HLS.zpUav : HLS.zpUavEN, { preload: false })
  useEffect(() => {
    const ar = arRef.current
    const uav = uavRef.current
    if (!ar || !uav) return
    if (vid === 'ar') {
      uav.pause()
      ar.play().catch(() => {})
    } else {
      ar.pause()
      const id = setTimeout(() => uav.play().catch(() => {}), 150)
      return () => clearTimeout(id)
    }
  }, [vid, uavLang])

  const switchUavLang = (e: React.MouseEvent, next: Lang) => {
    e.stopPropagation()
    setUavLang(next)
  }

  return (
    <Popup onClose={onClose}>
      {/* `min(…, 96vh)` caps the 16:9 player by viewport height too (≈54vh tall), so it
          stays fully visible (and never overflows the Close button) on short / landscape
          screens instead of being sized by width alone. */}
      <div className="flex flex-col" style={{ width: 'min(92vw, 460px, 96vh)' }}>
        <button onClick={() => setVid((v) => (v === 'ar' ? 'uav' : 'ar'))} className={`mb-3 self-end ${PILL_SM}`} style={PILL_BG}>
          {vid === 'ar' ? 'UAV-Video' : 'AR-Video'} <span aria-hidden className="text-[8px] opacity-70">▶</span>
        </button>
        <div className="relative overflow-hidden rounded-2xl bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]" style={{ aspectRatio: '16/9' }}>
          {/* AR is the always-opaque base layer; UAV fades in/out on top of it. With a
              fully-opaque frame always behind, the crossfade never dips to black — that
              was the flicker. object-contain keeps both clips uncropped. */}
          <video ref={arRef} autoPlay playsInline controls preload="auto" className="absolute inset-0 h-full w-full bg-black object-contain">
            <source src="/video/ZP-AR.mp4" type="video/mp4" />
          </video>
          <video ref={uavRef} playsInline controls preload="auto" className="absolute inset-0 h-full w-full bg-black object-contain transition-opacity duration-300" style={{ opacity: vid === 'uav' ? 1 : 0, pointerEvents: vid === 'uav' ? 'auto' : 'none' }}>
            <source src="/video/ZP-UAV.mp4" type="video/mp4" />
          </video>

          {/* UAV narration language — only the UAV clip has an English cut */}
          {vid === 'uav' && (
            <div className="absolute top-2 left-2 z-10 flex overflow-hidden rounded-full border border-white/25 bg-black/40 backdrop-blur-sm">
              {(['de', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={(e) => switchUavLang(e, l)}
                  aria-pressed={uavLang === l}
                  className={[
                    'px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] transition-colors',
                    uavLang === l ? 'text-white' : 'text-white/45',
                  ].join(' ')}
                  style={uavLang === l ? { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' } : undefined}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Popup>
  )
}

// ─── Langzeitdesign popup — the 16:9 film, lifted out of the panel ─────────────

function LangzeitVideoPopup({ onClose }: { onClose: () => void }) {
  return (
    <Popup onClose={onClose}>
      <div style={{ width: 'min(92vw, 440px)' }}>
        <InlineVideo active />
      </div>
    </Popup>
  )
}

// ─── VRlab popup — the VR headset with its lens slideshow ─────────────────────

function VrLabPopup({ onClose }: { onClose: () => void }) {
  return (
    <Popup onClose={onClose}>
      <div style={{ width: 'min(82vw, 380px, 64vh)' }}>
        <VrGlasses active />
      </div>
    </Popup>
  )
}

// ─── Websites popup — the desktop mockup with its link buttons ─────────────────

function PcWebsitesPopup({ onClose }: { onClose: () => void }) {
  return (
    <Popup onClose={onClose}>
      <div style={{ width: 'min(92vw, 460px, 150vh)' }}>
        <PcWebsites />
      </div>
    </Popup>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

// Below these track heights the inline media would crowd the scrollable text off
// the panel (the "video spawns over everything" bug on short viewports), so the
// media collapses to a compact pill that opens the same content in a popup. All
// three media stack *under* the text; the Sophienkirche portrait phone (which turns
// to landscape) is the tallest, so it needs the most room before it fits inline.
const INLINE_MIN_H: Partial<Record<Kind, number>> = {
  video: 408,
  videoPopup: 392,
  phonePopup: 470,
  glasses: 440,
  websites: 410,
}

function ProjectPanel({
  p,
  onOpenPopup,
  active,
  availH,
}: {
  p: Project
  onOpenPopup: (id: string) => void
  active: boolean
  availH: number
}) {
  const minH = INLINE_MIN_H[p.kind]
  // Until the track is measured (availH 0) assume the media fits, so tall viewports
  // never flash a button before the first measure. When it doesn't fit → popup pill.
  const inline = minH !== undefined && (availH === 0 || availH >= minH)
  const asButton = minH !== undefined && !inline

  // Shared body copy (text + link), reused by the stacked and side-by-side layouts.
  const body = (
    <>
      <p className="font-serif text-[14px] leading-[1.72] text-ink/72">{p.textA}</p>
      {p.textB && <p className="mt-3 font-serif text-[14px] leading-[1.72] text-ink/72">{p.textB}</p>}
      {p.textC && <p className="mt-3 font-serif text-[14px] leading-[1.72] text-ink/72">{p.textC}</p>}
      {p.link && (
        <a
          href={p.link.href}
          target={p.link.external || p.link.href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer noopener"
          className="group mt-5 flex items-center justify-between gap-3 border-b border-ink/30 pb-1 font-sans text-[12px] font-medium text-ink/60"
        >
          {p.link.label}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">{p.link.external ? '↗' : '→'}</span>
        </a>
      )}
      {p.download && (
        <a
          href={p.download.href}
          download
          className="group mt-3 flex items-center justify-between gap-3 border-b border-ink/30 pb-1 font-sans text-[12px] font-medium text-ink/60"
        >
          {p.download.label}
          <span aria-hidden className="transition-transform group-hover:translate-y-0.5">↓</span>
        </a>
      )}
    </>
  )

  const source = p.source && (
    <p className="mt-5 font-sans text-[10px] tracking-wider text-ink/35">{p.source}</p>
  )

  return (
    <div className="flex h-full w-full flex-none snap-center flex-col items-center px-6 min-[800px]:items-start min-[800px]:px-10">
      {/* Text column stays at a readable measure but left-aligns under the wider
          heading on narrow-desktop, so both share the same left edge */}
      <div className="flex h-full w-full max-w-[560px] flex-col min-[800px]:max-w-[620px]">
        <h3 className="font-sans text-[26px] font-semibold leading-[1.12] tracking-tight text-ink">{p.title}</h3>
        <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-lavender">{p.subtitle}</p>

        {/* Scrollbox grows; the media (or its popup button) is pinned below. The
            Sophienkirche phone is centred so it has room to turn to landscape. */}
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <ScrollBox className="flex-1">
            {body}
            {/* Popup trigger — shown when the viewport is too short for inline media */}
            {asButton && (
              <button onClick={() => onOpenPopup(p.id)} className={`mt-9 w-full ${PILL}`} style={PILL_BG}>
                {p.button}
              </button>
            )}
            {source}
          </ScrollBox>

          {inline && p.kind === 'video' && (
            <div className="mt-4 flex-none pb-1">
              <InlineVideo active={active} />
            </div>
          )}
          {inline && p.kind === 'videoPopup' && (
            <div className="mt-4 flex-none pb-1">
              <div className="mx-auto w-full max-w-[360px]">
                <ZeitPhoneInline active={active} />
              </div>
            </div>
          )}
          {inline && p.kind === 'phonePopup' && (
            <div className="mt-4 flex-none pb-1">
              {/* Width keeps the rotated landscape phone (≈1.96× wide) within the panel. */}
              <div className="mx-auto" style={{ width: 'min(38vw, 150px)' }}>
                <SophienPhoneInline active={active} />
              </div>
            </div>
          )}
          {inline && p.kind === 'glasses' && (
            <div className="mt-4 flex-none pb-1">
              <div className="mx-auto w-full max-w-[330px]">
                <VrGlasses active={active} />
              </div>
            </div>
          )}
          {inline && p.kind === 'websites' && (
            <div className="mt-4 flex-none pb-1">
              <div className="mx-auto w-full max-w-[360px]">
                <PcWebsites />
              </div>
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

// ─── Narrow-desktop inline media (≥550px) ────────────────────────────────────
// On narrow-desktop the popup buttons are replaced by inline media, mirroring the
// rich desktop layout: Sophienkirche keeps its portrait phone, Zeitpyramide its
// landscape phone with the AR/UAV swap.

function SophienPhoneInline({ active = true }: { active?: boolean }) {
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  useHlsVideo(videoRef, HLS.sophienkirche, { preload: true })
  const rotated = useSophienRotation(videoRef)

  // No play/pause UI → follow the carousel: play when this slide is in view, pause
  // when swiped/scrolled away. Pausing preserves currentTime, so the prototype (and
  // a phone-frame rotation synced to it) resumes exactly where it left off.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) v.play().catch(() => {})
    else v.pause()
  }, [active])

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }
  return (
    // `[container-type:inline-size]` lets the screen radius track the phone's
    // rendered width: 9cqw ≈ 18px at the full 200px phone, scaling down as it
    // shrinks so the corners never over-round and flash the background through.
    // Turns to landscape with the prototype (synced to the video, like desktop).
    <div
      className="relative w-full [container-type:inline-size]"
      style={{ transform: rotated ? 'rotate(-90deg)' : 'rotate(0deg)', transition: ROTATE_TRANSITION }}
    >
      <div className="absolute overflow-hidden" style={{ top: '2%', left: '3%', right: '3%', bottom: '2%', borderRadius: '9cqw' }}>
        <video ref={videoRef} muted loop playsInline className="h-full w-full object-cover">
          {/* Fallback for the rare browser without HLS (native or MSE) */}
          <source src="/video/Sophienkirche-Prototyp.mp4" type="video/mp4" />
        </video>
      </div>
      <img src="/assets/phone.png" alt="Smartphone Sophienkirche" draggable={false} className="relative z-10 w-full select-none pointer-events-none" />
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Ton ein' : 'Ton aus'}
        className="absolute bottom-6 right-3 z-20 grid h-7 w-7 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/60"
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.46-1.32L19 21l1.73-1.73L5.73 4.27 4.27 3zM12 4 9.91 6.09 12 8.18z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
        )}
      </button>
    </div>
  )
}

function ZeitPhoneInline({ active = true }: { active?: boolean }) {
  const [vid, setVid] = useState<'ar' | 'uav' | null>(null)
  const [uavLang, setUavLang] = useState<Lang>('de')
  const arRef = useRef<HTMLVideoElement>(null)
  const uavRef = useRef<HTMLVideoElement>(null)
  // Click-to-play → lazy: each stream loads only once its button is hit.
  // The UAV clip has DE/EN narration; swapping the source re-attaches the stream.
  useHlsVideo(arRef, HLS.zpAr, { preload: false })
  useHlsVideo(uavRef, uavLang === 'de' ? HLS.zpUav : HLS.zpUavEN, { preload: false })
  useEffect(() => {
    const ar = arRef.current
    const uav = uavRef.current
    if (!ar || !uav) return
    if (vid === 'ar') {
      uav.pause()
      ar.play().catch(() => {})
    } else if (vid === 'uav') {
      ar.pause()
      const id = setTimeout(() => uav.play().catch(() => {}), 150)
      return () => clearTimeout(id)
    }
  }, [vid, uavLang])

  // Pause both clips when swiped/scrolled out of view. They keep native controls,
  // so the viewer resumes manually on return (no auto-resume).
  useEffect(() => {
    if (active) return
    arRef.current?.pause()
    uavRef.current?.pause()
  }, [active])

  const switchUavLang = (e: React.MouseEvent, next: Lang) => {
    e.stopPropagation()
    setUavLang(next)
  }

  return (
    <div className="relative w-full max-w-[460px]">
      {/* Spacer — defines container height */}
      <img src="/assets/phone-empty.png" aria-hidden draggable={false} className="block w-full select-none opacity-0 pointer-events-none" />

      {/* Screen content — idle fill + both videos, clipped identically */}
      <div className="absolute overflow-hidden pointer-events-none" style={{ top: '2%', left: '0.5%', right: '0.5%', bottom: '2%', borderRadius: 16, zIndex: 2 }}>
        <img
          src="/assets/fil smartphone.png"
          aria-hidden draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover pointer-events-none transition-opacity duration-500"
          style={{ opacity: vid ? 0 : 1 }}
        />
        <video ref={arRef} playsInline controls preload="auto"
               className="absolute inset-0 h-full w-full bg-black transition-opacity duration-300"
               style={{ objectFit: 'fill', opacity: vid === 'ar' ? 1 : 0, pointerEvents: vid === 'ar' ? 'auto' : 'none' }}>
          <source src="/video/ZP-AR.mp4" type="video/mp4" />
        </video>
        <video ref={uavRef} playsInline controls preload="auto"
               className="absolute inset-0 h-full w-full bg-black transition-opacity duration-300"
               style={{ objectFit: 'fill', opacity: vid === 'uav' ? 1 : 0, pointerEvents: vid === 'uav' ? 'auto' : 'none' }}>
          <source src="/video/ZP-UAV.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Frame always on top */}
      <img
        src="/assets/phone-empty.png"
        alt="Zeitpyramide Smartphone"
        draggable={false}
        className="absolute inset-0 h-full w-full pointer-events-none select-none"
        style={{ zIndex: 20 }}
      />

      {/* Initial: two buttons over the preview */}
      {!vid && (
        <div className="absolute inset-0 flex items-center justify-center gap-3" style={{ zIndex: 30 }}>
          <button onClick={() => setVid('ar')} className={ZP_PILL} style={PILL_BG}>
            AR-Video <span aria-hidden className="text-[8px] opacity-70">▶</span>
          </button>
          <button onClick={() => setVid('uav')} className={ZP_PILL} style={PILL_BG}>
            UAV-Video <span aria-hidden className="text-[8px] opacity-70">▶</span>
          </button>
        </div>
      )}

      {/* Active: swap button above the frame */}
      {vid && (
        <button onClick={() => setVid((v) => (v === 'ar' ? 'uav' : 'ar'))} className={`absolute top-2 right-2 ${ZP_PILL}`} style={{ ...PILL_BG, zIndex: 30 }}>
          {vid === 'ar' ? 'UAV-Video' : 'AR-Video'} <span aria-hidden className="text-[8px] opacity-70">▶</span>
        </button>
      )}

      {/* UAV narration language — only the UAV clip has an English cut */}
      {vid === 'uav' && (
        <div
          className="absolute top-2 left-2 flex overflow-hidden rounded-full border border-white/25 bg-black/40 backdrop-blur-sm"
          style={{ zIndex: 30 }}
        >
          {(['de', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={(e) => switchUavLang(e, l)}
              aria-pressed={uavLang === l}
              className={[
                'px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] transition-colors',
                uavLang === l ? 'text-white' : 'text-white/45',
              ].join(' ')}
              style={uavLang === l ? { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' } : undefined}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Narrow-desktop panel (≥800px) ────────────────────────────────────────────
// No nested scroll, no popup buttons: text flows naturally, media spawns inline.

function NarrowText({ p }: { p: Project }) {
  return (
    <>
      {/* Right indent: body copy keeps a readable measure instead of running the
          full frame width. Links/source stay at their natural width. */}
      <p className="max-w-[600px] font-serif text-[14px] leading-[1.72] text-ink/72">{p.textA}</p>
      {p.textB && <p className="mt-3 max-w-[600px] font-serif text-[14px] leading-[1.72] text-ink/72">{p.textB}</p>}
      {p.textC && <p className="mt-3 max-w-[600px] font-serif text-[14px] leading-[1.72] text-ink/72">{p.textC}</p>}
      {p.link && (
        <a
          href={p.link.href}
          target={p.link.external || p.link.href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer noopener"
          className="group mt-5 flex w-fit items-center gap-1.5 border-b border-ink/30 pb-0.5 font-sans text-[12px] font-medium text-ink/60 transition-all hover:border-ink hover:text-ink"
        >
          {p.link.label}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">{p.link.external ? '↗' : '→'}</span>
        </a>
      )}
      {p.download && (
        <a
          href={p.download.href}
          download
          className="group mt-3 flex w-fit items-center gap-1.5 border-b border-ink/30 pb-0.5 font-sans text-[12px] font-medium text-ink/60 transition-all hover:border-ink hover:text-ink"
        >
          {p.download.label}
          <span aria-hidden className="transition-transform group-hover:translate-y-0.5">↓</span>
        </a>
      )}
      {p.source && <p className="mt-5 font-sans text-[10px] tracking-wider text-ink/35">{p.source}</p>}
    </>
  )
}

function NarrowPanel({ p, active }: { p: Project; active: boolean }) {
  return (
    <div className="w-full flex-none snap-center px-6 min-[800px]:px-10">
      <div className="w-full max-w-[760px]">
        <h3 className="font-sans text-[clamp(22px,3.4vw,26px)] font-semibold leading-[1.12] tracking-tight text-ink">{p.title}</h3>
        <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-lavender">{p.subtitle}</p>

        {p.kind === 'phonePopup' ? (
          // Sophienkirche — text first, then the (bigger) portrait phone breaks onto
          // its own row below, centred so it has room to turn to landscape.
          <div className="mt-6">
            <NarrowText p={p} />
            <div className="mx-auto mt-8" style={{ width: 'clamp(180px, 30vw, 260px)' }}>
              <SophienPhoneInline active={active} />
            </div>
          </div>
        ) : (
          // Langzeitdesign / Zeitpyramide — landscape media spawns left-aligned under the text.
          <div className="mt-6">
            <NarrowText p={p} />
            {p.kind === 'video' && (
              <div className="mt-7">
                <InlineVideo align="left" active={active} />
              </div>
            )}
            {p.kind === 'videoPopup' && (
              <div className="mt-7">
                <ZeitPhoneInline active={active} />
              </div>
            )}
            {p.kind === 'glasses' && (
              <div className="mt-7 w-full max-w-[420px]">
                <VrGlasses active={active} />
              </div>
            )}
            {p.kind === 'websites' && (
              <div className="mt-7 w-full max-w-[460px]">
                <PcWebsites />
              </div>
            )}
            {p.kind === 'placeholder' && (
              <div className="mt-7 grid max-w-[460px] place-items-center rounded-xl border-2 border-dashed border-ink/12 py-12">
                <span className="font-sans text-[11px] uppercase tracking-widest text-ink/30">Demnächst</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MobilePortfolio() {
  const { trackRef, active, goTo } = useCarousel()
  const [popup, setPopup] = useState<string | null>(null)
  const isPhone = useIsPhone()
  // Narrow-desktop band (550–1023px): inline media, no nested scroll, no popups —
  // a slimmed-down echo of the rich desktop layout. Below 550px the phone-first
  // mobile layout (carousel + popups) takes over.
  const isNarrow = useMediaQuery('(min-width: 550px)')

  // Pause this section's videos when it scrolls out of view (i.e. the viewer
  // navigated to another section). Combined with the active-slide check below, only
  // the on-screen, in-view slide ever plays.
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Live height of the swipe track (phone layout only). Drives the per-panel
  // decision to render media inline vs. collapse it to a popup button — see
  // INLINE_MIN_H. Measured before paint so there's no inline→button flash.
  const [availH, setAvailH] = useState(0)
  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setAvailH(el.clientHeight)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isNarrow])

  // Left-aligned content frame for the heading and panels on narrow-desktop.
  const frame = isNarrow
    ? 'mx-0 w-full max-w-[760px] px-6 min-[800px]:px-10'
    : 'mx-auto w-full max-w-[560px] px-6'

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className={[
        'relative z-0 bg-cream',
        // Narrow-desktop: normal block flow sized to content. (A flex-col parent
        // would let the overflow-x carousel collapse to 0 height without a forced
        // 100svh; and that forced height left an empty gap + zoomed object-cover
        // hard into the photos, exposing the Zeitpyramide block edges.)
        isNarrow ? 'pt-20 pb-16' : 'flex flex-col h-[100svh] scroll-mt-4 overflow-hidden pt-14 pb-7',
      ].join(' ')}
    >
      {/* Background crossfade — right-biased object-position keeps each photo's
          subject (star, bell, pyramid) in frame under the narrow/portrait crop. */}
      {PROJECTS.map((p, i) => (
        <img
          key={p.id}
          src={p.bg}
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700"
          style={{ opacity: active === i ? 1 : 0, objectPosition: p.bgPos ?? 'center' }}
        />
      ))}
      {isNarrow ? (
        <>
          {/* Cream sweeps in from the left (behind the text) and clears toward the
              right so the photo keeps its colour there — plus top & bottom fades
              that blend the section into the cream page. No flat full-cover wash. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              // Stronger + longer cream than the wide desktop: narrow columns put
              // text closer to the colourful right edge, and the photos here are
              // low-res, so the wash holds near-full opacity well past centre and
              // only fades near the right edge — readability wins. (Adjusting the
              // gradient x-stops only; the background photo is never cropped.)
              background:
                'linear-gradient(to right, rgba(247,236,237,0.97) 0%, rgba(247,236,237,0.94) 50%, rgba(247,236,237,0.7) 78%, rgba(247,236,237,0.42) 100%)',
            }}
          />
          {/* Per-slide cream boost — adds cream toward the right for slides flagged
              `scrim` (darker photos like the Sophienkirche interior), so their right
              edge reads as light as the brighter slides. Crossfades with the
              background (duration-700) as the active slide changes. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: PROJECTS[active]?.scrim ? 1 : 0,
              background:
                'linear-gradient(to right, rgba(247,236,237,0) 0%, rgba(247,236,237,0) 28%, rgba(247,236,237,0.2) 55%, rgba(247,236,237,0.42) 78%, rgba(247,236,237,0.55) 100%)',
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
        </>
      ) : (
        <>
          {/* Phone: stronger cream than the old flat wash, building toward both side
              edges (left strongest) to frame the centred text, easing to a centre
              that still stays well above the old 0.72 so copy keeps its legibility. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(247,236,237,0.96) 0%, rgba(247,236,237,0.84) 30%, rgba(247,236,237,0.8) 50%, rgba(247,236,237,0.84) 70%, rgba(247,236,237,0.9) 100%)',
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cream to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" />
        </>
      )}

      {/* Heading — desktop wording on narrow-desktop, stacked title on mobile */}
      <div className={`relative z-10 ${frame}`}>
        {isNarrow ? (
          <SectionHeading eyebrow="Langzeit-Kultur & Portfolio" title="Für das Langzeitdenken" />
        ) : (
          <>
            <h2 className="font-sans text-[28px] font-bold uppercase leading-[1.1] tracking-[0.02em] text-ink">
              Langzeit-Kultur{' '}<br />& Portfolio
            </h2>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-ink/35 via-ink/12 to-transparent" />
          </>
        )}
      </div>

      {/* Swipe track */}
      <div
        ref={trackRef}
        className={[
          'no-scrollbar relative z-10 flex snap-x snap-mandatory overflow-x-auto',
          isNarrow ? 'mt-8' : 'mt-5 min-h-0 flex-1',
        ].join(' ')}
      >
        {PROJECTS.map((p, i) => {
          const slideActive = inView && active === i
          return isNarrow ? (
            <NarrowPanel key={p.id} p={p} active={slideActive} />
          ) : (
            <ProjectPanel key={p.id} p={p} onOpenPopup={setPopup} active={slideActive} availH={availH} />
          )
        })}
      </div>

      {/* Indicator + active label — centred across the full width */}
      <div className="relative z-10 mt-6">
        <Dots count={PROJECTS.length} active={active} onSelect={goTo} showArrows={!isPhone} />
        <p className="mt-3 text-center font-serif text-[13px] italic text-ink/60">{PROJECTS[active]?.label}</p>
      </div>

      {/* Popups — mobile layout only */}
      {!isNarrow && popup === 'langzeitdesign' && <LangzeitVideoPopup onClose={() => setPopup(null)} />}
      {!isNarrow && popup === 'sophienkirche' && <SophienPhonePopup onClose={() => setPopup(null)} />}
      {!isNarrow && popup === 'zeitpyramide' && <ZeitVideoPopup onClose={() => setPopup(null)} />}
      {!isNarrow && popup === 'vrlab' && <VrLabPopup onClose={() => setPopup(null)} />}
      {!isNarrow && popup === 'p5' && <PcWebsitesPopup onClose={() => setPopup(null)} />}
    </section>
  )
}
