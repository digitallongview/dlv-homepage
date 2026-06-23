import { lazy, Suspense } from 'react'
import HeroSection from './components/HeroSection'
import SiteHeader from './components/SiteHeader'
import SectionLongView from './components/sections/SectionLongView'

// Below-fold sections — separate JS chunks, laden parallel im Hintergrund
const SectionMotivation = lazy(() => import('./components/sections/SectionMotivation'))
const SectionPortfolio  = lazy(() => import('./components/sections/SectionPortfolio'))
const SectionLeistungen = lazy(() => import('./components/sections/SectionLeistungen'))
const SiteFooter        = lazy(() => import('./components/SiteFooter'))

export default function App() {
  return (
    <>
      {/* Skip-to-content for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-lavender focus:px-4 focus:py-2 focus:font-sans focus:text-[14px] focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Zum Inhalt springen
      </a>

      <HeroSection />
      <SiteHeader />

      <main id="main-content">
        <SectionLongView />

        <Suspense fallback={null}>
          <SectionMotivation />
          <SectionPortfolio />
          <SectionLeistungen />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </>
  )
}
