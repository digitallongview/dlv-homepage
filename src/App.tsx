import HeroSection from './components/HeroSection'
import SiteHeader from './components/SiteHeader'
import SectionLongView from './components/sections/SectionLongView'
import SectionMotivation from './components/sections/SectionMotivation'
import SectionPortfolio from './components/sections/SectionPortfolio'
import SectionLeistungen from './components/sections/SectionLeistungen'
import SiteFooter from './components/SiteFooter'

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

      {/* Full-viewport hero — LANDING frame (Figma 1767:372) */}
      <HeroSection />

      {/*
        SiteHeader renders two layers:
        1. ExpandedTriangleHeader — in document flow, large lavender trapezoid
           with nav links, sits directly below the hero (Figma Nav 1787:28).
           The CompactTriangleHeader watches its rect.bottom to know when to slide in.
        2. CompactTriangleHeader — position:fixed z-50, hidden until
           ExpandedTriangleHeader scrolls out of view.
      */}
      <SiteHeader />

      <main id="main-content">
        {/* WAS IST DIGITAL LONG VIEW — Figma 1767:211 */}
        <SectionLongView />

        {/* MOTIVATION & VORSTELLUNG — Figma 1789:81 */}
        <SectionMotivation />

        {/* LANGZEIT-KULTUR & PORTFOLIO — Figma 1767:114 */}
        <SectionPortfolio />

        {/* UNSERE LEISTUNGEN & SERVICE — Figma 1767:275 + 1823:40 etc. */}
        <SectionLeistungen />

      </main>

      {/* FOOTER — Figma 1767:13 */}
      <SiteFooter />
    </>
  )
}
