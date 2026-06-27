import { lazy, Suspense } from 'react'
import HeroSection from './components/HeroSection'
import SiteHeader from './components/SiteHeader'
import SectionLongView from './components/sections/SectionLongView'
import { LegalModalProvider } from './components/legal/LegalModal'
import { useIsMobile, useMediaQuery } from './hooks/useMediaQuery'
import { useStrings } from './i18n/content'

// Below-fold desktop sections — separate JS chunks, laden parallel im Hintergrund
const SectionMotivation = lazy(() => import('./components/sections/SectionMotivation'))
const SectionPortfolio  = lazy(() => import('./components/sections/SectionPortfolio'))
const SectionLeistungen = lazy(() => import('./components/sections/SectionLeistungen'))
const SiteFooter        = lazy(() => import('./components/SiteFooter'))

// Mobile tree — only loaded on phone-sized viewports
const MobileMenu        = lazy(() => import('./components/mobile/MobileMenu'))
const MobileLongView    = lazy(() => import('./components/mobile/MobileLongView'))
const MobileMotivation  = lazy(() => import('./components/mobile/MobileMotivation'))
const MobilePortfolio   = lazy(() => import('./components/mobile/MobilePortfolio'))
const MobileLeistungen  = lazy(() => import('./components/mobile/MobileLeistungen'))
const MobileFooter      = lazy(() => import('./components/mobile/MobileFooter'))

const SectionKontakt    = lazy(() => import('./components/SectionKontakt'))

export default function App() {
  const isMobile = useIsMobile()
  const s = useStrings()
  // The LongView section keeps its desktop side-by-side composition further down
  // than the rest of the site — it only collapses to the stacked mobile layout
  // below 500px, instead of the global 1024px breakpoint used everywhere else.
  const longViewStacked = useMediaQuery('(max-width: 499px)')

  return (
    <LegalModalProvider>
      {/* Skip-to-content for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-lavender focus:px-4 focus:py-2 focus:font-sans focus:text-[14px] focus:font-semibold focus:text-white focus:shadow-lg"
      >
        {s.a11y.skip}
      </a>

      <HeroSection />

      {isMobile ? (
        <Suspense fallback={null}>
          <MobileMenu />
          <main id="main-content">
            {longViewStacked ? <MobileLongView /> : <SectionLongView />}
            <MobileMotivation />
            <MobilePortfolio />
            <MobileLeistungen />
            <SectionKontakt />
          </main>
          <MobileFooter />
        </Suspense>
      ) : (
        <>
          <SiteHeader />
          <main id="main-content">
            <SectionLongView />
            <Suspense fallback={null}>
              <SectionMotivation />
              <SectionPortfolio />
              <SectionLeistungen />
              <SectionKontakt />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <SiteFooter />
          </Suspense>
        </>
      )}
    </LegalModalProvider>
  )
}
