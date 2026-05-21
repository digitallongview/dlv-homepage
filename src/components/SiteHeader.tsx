import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { label: 'Was ist Long View?', href: '#was-ist' },
  { label: 'Wer sind wir?', href: '#wer-sind-wir' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Kontakt', href: '#kontakt' },
  { label: 'AGBs', href: '#agbs' },
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
      <div className="mx-auto h-full max-w-[1320px] px-6 sm:px-10">
        <div className="flex h-full flex-col justify-between py-6 sm:py-8">
          <div className="flex justify-end">
            <a
              href="#"
              className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <img
                src="/assets/logo.png"
                alt="Digital Longview"
                draggable={false}
                className="h-9 w-auto select-none brightness-0 invert drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
              />
            </a>
          </div>

          <nav className="max-w-[640px]">
            <ul className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center justify-between gap-4 border-b border-white/50 pb-1.5 pr-2 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-white transition-all hover:border-white hover:pl-1"
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
      </div>
    </header>
  )
}

/**
 * CompactTriangleHeader ist `fixed top-0` und initial via translateY(-100%)
 * versteckt. Sobald der ExpandedTriangleHeader oberhalb des Viewports liegt
 * (rect.bottom < 0), slidet er ein.
 */
export function CompactTriangleHeader() {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const update = () => {
      const el = document.querySelector<HTMLElement>('[data-expanded-header]')
      if (!el) {
        setStuck(false)
        return
      }
      const rect = el.getBoundingClientRect()
      setStuck(rect.bottom <= 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out"
      style={{
        height: 64,
        background: LILA_GRADIENT,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 0% 100%)',
        boxShadow: '0 6px 20px -10px rgba(45,31,77,0.6)',
        transform: stuck ? 'translateY(0)' : 'translateY(-110%)',
      }}
    >
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6 sm:px-10">
        <a
          href="#"
          className="flex items-center rounded-md transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <img
            src="/assets/logo.png"
            alt="Digital Longview"
            draggable={false}
            className="h-7 w-auto select-none brightness-0 invert"
          />
        </a>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative inline-flex items-center rounded-full px-3 py-1.5 font-sans text-[12.5px] font-medium text-white/85 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {item.label.replace('?', '')}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#kontakt"
          className="group inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 font-sans text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#5d4684] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] transition-all hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.45)] focus:outline-none focus:ring-4 focus:ring-white/40 active:scale-[0.97]"
        >
          Kontakt
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
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
