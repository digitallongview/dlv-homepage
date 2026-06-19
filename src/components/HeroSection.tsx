import { lazy, Suspense } from 'react'
import HeroOverlay from './HeroOverlay'

// Lazy-load the full Three.js/Drei/Leva stack so it splits into its own chunk
// and doesn't block the initial page render or LCP.
const PyramidScene = lazy(() => import('./PyramidScene'))

export default function HeroSection() {
  return (
    <section
      data-hero
      className="relative w-full overflow-hidden bg-cream"
      style={{ height: '100dvh', minHeight: 580 }}
    >
      {/* 3D-Pyramide füllt den gesamten Hero-Viewport */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-cream" />}>
          <PyramidScene />
        </Suspense>
      </div>

      {/* Logo + Subtitle */}
      <div
        className="pointer-events-none absolute inset-x-0 z-30 flex flex-col items-center"
        style={{ top: 'clamp(5vh, 8vh, 12vh)' }}
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

      {/* Radial-Fade oben — gibt Logo + Tagline Kontrast */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40%]"
        style={{
          background:
            'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(247,236,237,0.85) 0%, rgba(247,236,237,0.4) 55%, rgba(247,236,237,0) 100%)',
        }}
      />
      {/* Cream-Fade unten */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[65%]"
        style={{
          background:
            'linear-gradient(180deg, rgba(247,236,237,0) 0%, rgba(247,236,237,0.75) 28%, rgba(247,236,237,0.96) 58%, var(--color-cream) 100%)',
        }}
      />

      {/* Text-Inhalt + Signup */}
      <div className="absolute inset-x-0 z-20 flex justify-center px-4 sm:px-6" style={{ bottom: 'clamp(60px, 10vh, 120px)' }}>
        <HeroOverlay />
      </div>
    </section>
  )
}
