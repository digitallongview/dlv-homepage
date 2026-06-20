import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import HeroOverlay from './HeroOverlay'

// Import sofort starten (beim Laden des Moduls), nicht erst beim ersten Render
const pyramidSceneImport = import('./PyramidScene')
const PyramidScene = lazy(() => pyramidSceneImport)

type Phase = 0 | 1 | 2 | 3

export default function HeroSection() {
  const [phase, setPhase] = useState<Phase>(0)
  const [heroVisible, setHeroVisible] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

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
      {/* 3D-Pyramide */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-cream" />}>
          <PyramidScene
            visible={heroVisible}
            onDropStart={handleDropStart}
            onDropComplete={handleDropComplete}
          />
        </Suspense>
      </div>

      {/* Lade-Greeting — nur sichtbar solange GLB noch lädt (Phase 0) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
        style={fadeIn(phase < 1, 500)}
      >
        <p className="font-sans text-[18px] font-semibold uppercase tracking-[0.45em]" style={{ color: '#D7ACCF' }}>
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
        className="pointer-events-none absolute inset-x-0 z-30 flex flex-col items-center"
        style={{ top: 'clamp(5vh, 8vh, 12vh)', ...fadeIn(phase >= 1, 1000, 100) }}
      >
        <img
          src="/assets/logo.png"
          alt="Digital Longview"
          className="h-auto select-none drop-shadow-[0_8px_22px_rgba(24,24,38,0.28)]"
          style={{ width: 'clamp(180px, 30vw, 320px)' }}
          draggable={false}
        />
        <p className="mt-2 font-sans text-[10px] font-medium uppercase tracking-[0.38em] text-ink/60 sm:text-[11px]">
          Die Digitalagentur für Raum, Zeit und Kultur
        </p>
      </div>

      {/* Unterer Cream-Fade — Phase 2 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[65%]"
        style={{
          background: 'linear-gradient(180deg, rgba(247,236,237,0) 0%, rgba(247,236,237,0.75) 28%, rgba(247,236,237,0.96) 58%, var(--color-cream) 100%)',
          ...fadeIn(phase >= 2, 700),
        }}
      />

      {/* Headline + Form — Phase 2/3 via HeroOverlay */}
      <div
        className="absolute inset-x-0 z-20 flex justify-center px-4 sm:px-6"
        style={{ bottom: 'clamp(60px, 10vh, 120px)' }}
      >
        <HeroOverlay phase={phase} />
      </div>
    </section>
  )
}
