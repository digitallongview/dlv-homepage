import HeroOverlay from './HeroOverlay'
import PyramidScene from './PyramidScene'

export default function HeroSection() {
  return (
    <section
      data-hero
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-cream"
    >
      {/* 3D-Pyramide füllt den gesamten Hero-Viewport */}
      <div className="absolute inset-0">
        <PyramidScene />
      </div>

      {/* Großes Logo, schwebt prominent über der Pyramide */}
      <img
        src="/assets/logo.png"
        alt="Digital Longview"
        className="pointer-events-none absolute inset-x-0 top-[14vh] z-30 mx-auto h-auto w-[min(380px,70vw)] select-none drop-shadow-[0_8px_22px_rgba(24,24,38,0.28)]"
        draggable={false}
      />

      {/* Cream-Fade lässt die Pyramidenbasis weich in den Text-Bereich übergehen */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%]"
        style={{
          background:
            'linear-gradient(180deg, rgba(247,236,237,0) 0%, rgba(247,236,237,0.7) 35%, rgba(247,236,237,0.95) 65%, var(--color-cream) 100%)',
        }}
      />

      {/* Text-Inhalt + Signup am unteren Drittel */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[6vh] sm:px-6 sm:pb-[8vh]">
        <HeroOverlay />
      </div>
    </section>
  )
}
