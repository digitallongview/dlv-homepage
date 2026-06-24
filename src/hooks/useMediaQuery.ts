import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query. SSR-safe-ish for this CSR-only Vite app:
 * the initial value is read synchronously from matchMedia so there is no
 * desktop→mobile flash on first paint.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * The dedicated mobile/touch-friendly layout (carousels, swipe nav) is used for
 * phones, tablets AND narrow desktop windows. Only wide viewports (≥1024px) get
 * the rich desktop layout. Non-touch users in the 560–1023px band get clickable
 * arrows on the carousels.
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)')
}

/**
 * Real phone width — below this the carousels rely on touch-swipe and show the
 * diagonal indicator styling; above it (tablet / narrow desktop) we add arrows.
 */
export function useIsPhone(): boolean {
  return useMediaQuery('(max-width: 559px)')
}

/** Portrait-ish viewport (taller than wide) → portrait 3D framing for the hero. */
export function useIsPortrait(): boolean {
  return useMediaQuery('(max-aspect-ratio: 4/5)')
}
