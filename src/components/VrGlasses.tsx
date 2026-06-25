import { useEffect, useState } from 'react'

// Two VR scenes that fade across the goggle's lens, each with its caption. The
// source PNGs already carry a lens vignette, so they read as "the view inside the
// headset". Drawn from the project copy: Benz Patent-Motorwagen & Apollo 13.
const VR_SLIDES = [
  { src: '/assets/vr-lab-benz.webp',  caption: 'Benz Patent-Motorwagen' },
  { src: '/assets/vr-lab-rover.webp', caption: 'Apollo 13 · Mondlandung' },
]

// Lens "screen" rectangle as a fraction of vrglasses.png — the slideshow plays here.
// Sits a little high on the front face so the scenes read as the view in the headset.
const LENS = { left: '9%', right: '9%', top: '31.5%', bottom: '16.5%' }

/**
 * VR headset whose lens slowly cycles through the project's VR scenes.
 * Peu à peu: the lens starts empty (just the goggle), then the first scene fades in,
 * then they cross-fade on a slow loop. `active` pauses/​resets it when off-screen.
 * The caption rides *below* the goggle (not on the lens) so no gradient edge bleeds
 * over the frame.
 */
export default function VrGlasses({ active = true, className = '' }: { active?: boolean; className?: string }) {
  const [idx, setIdx] = useState(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!active) {
      setShown(false)
      setIdx(0)
      return
    }
    // Empty lens first, then ease the first scene in.
    const intro = setTimeout(() => setShown(true), 1100)
    const loop = setInterval(() => setIdx((i) => (i + 1) % VR_SLIDES.length), 4200)
    return () => {
      clearTimeout(intro)
      clearInterval(loop)
    }
  }, [active])

  return (
    <div className={`w-full ${className}`}>
      {/* Goggle + lens in their own box so the lens % track the goggle, not the caption */}
      <div className="relative w-full">
        <img src="/assets/vrglasses.webp" alt="VR-Brille" draggable={false} className="block w-full select-none" />

        {/* Lens screen — scenes cross-fade here over the goggle's front face */}
        <div
          className="pointer-events-none absolute overflow-hidden"
          style={{ left: LENS.left, right: LENS.right, top: LENS.top, bottom: LENS.bottom, borderRadius: '9% / 14%' }}
        >
          {VR_SLIDES.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.caption}
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-cover transition-opacity ease-in-out"
              style={{ opacity: shown && i === idx ? 1 : 0, transitionDuration: '1200ms' }}
            />
          ))}
        </div>
      </div>

      {/* Caption — below the goggle, cross-fading with the scene (no edge over the frame) */}
      <div className="relative mt-1 h-[15px]">
        {VR_SLIDES.map((s, i) => (
          <p
            key={s.src}
            className="absolute inset-x-0 text-center font-sans text-[10px] font-semibold uppercase leading-none tracking-[0.2em] text-lavender-dark/75 transition-opacity ease-in-out"
            style={{ opacity: shown && i === idx ? 1 : 0, transitionDuration: '1200ms' }}
          >
            {s.caption}
          </p>
        ))}
      </div>
    </div>
  )
}
