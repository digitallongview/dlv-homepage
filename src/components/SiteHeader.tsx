import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { label: 'Was ist Long View?', href: '#was-ist' },
  { label: 'Wer sind wir?', href: '#wer-sind-wir' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Kontakt', href: '#kontakt' },
]

const LILA_GRADIENT =
  'linear-gradient(120deg, #a991c7 0%, #8c74aa 55%, #6a4f8e 100%)'

/**
 * ExpandedTriangleHeader sitzt zwischen Hero und Sections im normalen
 * Document-Flow. Er ist großes lila Trapez (260px) und scrollt natürlich
 * mit der Page hoch.
 */
export function ExpandedTriangleHeader() {
  return (
    <header
      data-expanded-header
      className="relative w-full"
      style={{
        height: 260,
        background: LILA_GRADIENT,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 38%, 0% 100%)',
        boxShadow: '0 20px 60px -30px rgba(45,31,77,0.5)',
      }}
    >
      <div className="mx-auto h-full max-w-[1320px] px-10">
        <div className="grid h-full grid-cols-2 pt-7">

          {/* Linke Spalte: Ankerpunkte zentriert */}
          <div className="flex justify-center pt-1">
            <nav>
              <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group inline-flex items-center justify-between gap-4 border-b border-white/40 pb-1.5 pr-2 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition-all duration-200 hover:border-white hover:text-white hover:pl-1"
                    >
                      <span>{item.label}</span>
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Rechte Spalte: Logo rechtsbündig, oben verankert */}
          <div className="flex items-start justify-end">
            <a
              href="#"
              className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <img
                src="/assets/logo-weiss.webp"
                alt="Digital Long View"
                draggable={false}
                className="h-9 w-auto select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
              />
            </a>
          </div>

        </div>
      </div>
    </header>
  )
}

/**
 * CompactTriangleHeader ist `fixed top-0` und initial via translateY(-100%)
 * versteckt. Sobald der ExpandedTriangleHeader oberhalb des Viewports liegt
 * (rect.bottom < 0), slidet er ein.
 */
// Both polygons have 4 vertices so CSS can interpolate between them smoothly.
// Closed: triangle — logo sits in the wide upper zone, safe on all viewport sizes.
// Open:   full rectangle → straight bar, no diagonal.
const CLIP_CLOSED = 'polygon(0% 0%, 55% 0%, 55% 0%, 0% 100%)'
const CLIP_OPEN   = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

export function CompactTriangleHeader() {
  const [stuck, setStuck] = useState(false)
  const [open,  setOpen]  = useState(false)

  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-expanded-header]')
    if (!el) return
    // IntersectionObserver statt scroll+getBCR — kein Layout-Reflow bei Scroll.
    // Unterscheidung: Element oberhalb rausgescrollt (stuck=true) vs.
    // noch unterhalb des Viewports (stuck=false, beim Pageload).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStuck(false)
        } else {
          // boundingClientRect ist vom Browser vorberechnet — kein Reflow
          setStuck(entry.boundingClientRect.bottom < 120)
        }
      },
      { rootMargin: '-120px 0px 0px 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        height: 80,
        background: LILA_GRADIENT,
        clipPath: open ? CLIP_OPEN : CLIP_CLOSED,
        boxShadow: '0 8px 28px -8px rgba(45,31,77,0.7)',
        transform: stuck ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'clip-path 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s ease-out',
        willChange: 'transform, clip-path',
      }}
    >
      {/* pt-[14px] pins logo to the wide upper portion of the triangle at all viewport sizes */}
      <div className="mx-auto flex h-full max-w-[1320px] items-start pt-[14px] gap-8 px-6 sm:px-10">

        {/* Logo — mt-3 aligns it with the nav links' pt-3 offset */}
        <a
          href="#"
          className="flex-none mt-1 transition-opacity hover:opacity-80
                     focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
        >
          <img
            src="/assets/logo-weiss.webp"
            alt="Digital Long View"
            draggable={false}
            className="h-8 w-auto select-none"
          />
        </a>

        {/* Nav — fades in once the bar has opened */}
        <nav
          className="hidden md:flex items-center gap-8 pt-3"
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: open
              ? 'opacity 0.15s ease-out 0.1s'
              : 'opacity 0.08s ease-out',
          }}
        >
          {NAV_ITEMS.slice(0, 4).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group inline-flex items-center gap-2 border-b border-white/40 pb-1.5
                         font-sans text-[11px] font-semibold uppercase tracking-[0.25em]
                         text-white/75 transition-all duration-200
                         hover:border-white hover:text-white
                         focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {item.label.replace('?', '')}
              <span aria-hidden className="flex-none transition-transform group-hover:translate-x-1">→</span>
            </a>
          ))}

          {/* Kontakt — pill button */}
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-1.5
                       font-sans text-[11px] font-semibold uppercase tracking-[0.25em]
                       text-[#5d4684] transition-all duration-200
                       hover:bg-white hover:shadow-[0_4px_16px_-4px_rgba(45,31,77,0.5)]
                       focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Kontakt
            <span aria-hidden>→</span>
          </a>
        </nav>

      </div>
    </header>
  )
}

// Default export wraps beide Header für einfachen Import.
export default function SiteHeader() {
  return (
    <>
      <ExpandedTriangleHeader />
      <CompactTriangleHeader />
    </>
  )
}
