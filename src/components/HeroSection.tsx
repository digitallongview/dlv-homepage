import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import HeroOverlay from './HeroOverlay'
import ErrorBoundary from './ErrorBoundary'
import { useIsPortrait } from '../hooks/useMediaQuery'
import { canRender3D } from '../lib/canRender3D'

// Der 3D-Chunk (three/r3f/drei) wird NUR dynamisch importiert, wenn das Gerät 3D
// bekommt — der Import feuert erst beim Mount von <PyramidScene>, nicht auf Modulebene.
// So lädt ein gegatetes (fragiles) Gerät weder den 3D-Code noch das GLB.
const PyramidScene = lazy(() => import('./PyramidScene'))

type Phase = 0 | 1 | 2 | 3

export default function HeroSection() {
  // Einmal-Entscheidung: schweres WebGL-3D oder statisches Poster (fragile Geräte)?
  const [use3D] = useState(canRender3D)
  // Ohne 3D direkt in den Endzustand (Phase 3) → Logo/Headline/Formular sofort sichtbar.
  const [phase, setPhase] = useState<Phase>(use3D ? 0 : 3)
  const [heroVisible, setHeroVisible] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const isPortrait = useIsPortrait()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Phase 0 → 1: wenn die ersten Steine zu fallen beginnen (GLB geladen + DROP_DELAY abgelaufen)
  const handleDropStart = useCallback(() => {
    setPhase((p) => (p < 1 ? 1 : p) as Phase)
  }, [])

  // Phase 2 wenn Drop-Animation fertig, Phase 3 nach 1.5s
  const handleDropComplete = useCallback(() => {
    setPhase(2)
    setTimeout(() => setPhase(3), 800)
  }, [])

  // Lädt die 3D-Szene nicht (z. B. GLB-Fehler), feuert onDropStart nie. Dann
  // direkt auf Phase 3 springen, damit Logo, Headline und Formular trotzdem
  // erscheinen statt einer leeren Seite.
  const handleSceneError = useCallback(() => {
    setPhase((p) => (p < 3 ? 3 : p) as Phase)
  }, [])

  const fadeIn = (active: boolean, duration = 800, delay = 0): React.CSSProperties => ({
    opacity: active ? 1 : 0,
    transition: `opacity ${duration}ms ease ${delay}ms`,
  })

  return (
    <section
      ref={sectionRef}
      data-hero
      className="relative w-full overflow-hidden bg-cream"
      style={{ height: '100dvh', minHeight: 580 }}
    >
      {/* 3D-Pyramide (leistungsfähige Geräte) — im Hochformat etwas nach oben
          geschoben, damit sie höher sitzt und der Landing-Content darunter passt. */}
      {use3D ? (
        <div
          className="absolute inset-0"
          style={{ transform: isPortrait ? 'translateY(clamp(-220px, -20vh, -100px))' : undefined }}
        >
          <ErrorBoundary
            fallback={<div className="absolute inset-0 bg-cream" />}
            onError={handleSceneError}
          >
            <Suspense fallback={<div className="absolute inset-0 bg-cream" />}>
              <PyramidScene
                visible={heroVisible}
                portrait={isPortrait}
                onDropStart={handleDropStart}
                onDropComplete={handleDropComplete}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      ) : (
        /* Statisches Poster für fragile Geräte (reduced-motion / Save-Data / wenig
           RAM / kein WebGL) — gerendertes Pyramiden-Frame auf Cream, ~16 KB. */
        <div className="absolute inset-0 bg-cream">
          <img
            src="/assets/zeitpyramide-poster.webp"
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            className="absolute inset-0 h-full w-full select-none object-contain"
            style={{ objectPosition: isPortrait ? 'center 30%' : 'center 42%' }}
          />
        </div>
      )}

      {/* Lade-Greeting — nur sichtbar solange GLB noch lädt (Phase 0) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-6"
        style={fadeIn(phase < 1, 500)}
      >
        <p className="max-w-full text-center font-sans text-[13px] font-semibold uppercase tracking-[0.28em] sm:text-[18px] sm:tracking-[0.45em]" style={{ color: '#D7ACCF' }}>
          Für die zukünftigen Generationen
        </p>
      </div>

      {/* Oberer Radial-Fade — Phase 1 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40%]"
        style={{
          background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(247,236,237,0.85) 0%, rgba(247,236,237,0.4) 55%, rgba(247,236,237,0) 100%)',
          ...fadeIn(phase >= 1, 1000),
        }}
      />

      {/* Logo + Tagline — Phase 1 */}
      <div
        className="pointer-events-none absolute inset-x-0 z-30 flex flex-col items-center px-5"
        style={{ top: 'clamp(5vh, 8vh, 12vh)', ...fadeIn(phase >= 1, 1000, 100) }}
      >
        <img
          src="/assets/logo.webp"
          alt="Digital Longview"
          className="h-auto select-none drop-shadow-[0_8px_22px_rgba(24,24,38,0.28)]"
          style={{ width: 'clamp(210px, 30vw, 320px)' }}
          draggable={false}
        />
        <p className="mt-2 text-center font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/60 sm:tracking-[0.38em] sm:text-[11px]">
          Die Digitalagentur für Raum, Zeit und Kultur
        </p>
      </div>

      {/* Unterer Cream-Fade — Phase 2. Im Hochformat länger gezogen, damit der
          Übergang auf Handys sanfter ist. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: isPortrait ? '76%' : '65%',
          background: 'linear-gradient(180deg, rgba(247,236,237,0) 0%, rgba(247,236,237,0.75) 28%, rgba(247,236,237,0.96) 58%, var(--color-cream) 100%)',
          ...fadeIn(phase >= 2, 700),
        }}
      />

      {/* Headline + Form — Phase 2/3 via HeroOverlay */}
      <div
        className="absolute inset-x-0 z-20 flex justify-center px-4 sm:px-6"
        style={{ bottom: isPortrait ? 'clamp(90px, 15vh, 160px)' : 'clamp(60px, 10vh, 120px)' }}
      >
        <HeroOverlay phase={phase} />
      </div>
    </section>
  )
}
