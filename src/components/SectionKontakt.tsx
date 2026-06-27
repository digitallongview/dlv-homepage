import ContactForm from './ContactForm'
import { useStrings } from '../i18n/content'

/**
 * Dedicated contact section that carries the global `#kontakt` anchor (every CTA
 * across the site scrolls here). Responsive: a single card that stacks on phones
 * and goes two-column on wider screens — so one component serves both the desktop
 * and the mobile tree. The footers keep their contact details but no longer own
 * the anchor or a form.
 */
export default function SectionKontakt() {
  const s = useStrings().contact

  return (
    <section id="kontakt" className="relative scroll-mt-24 overflow-hidden bg-cream px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-10 rounded-3xl border border-ink/10 bg-white/80 p-7 shadow-[0_30px_70px_-30px_rgba(24,24,38,0.35)] backdrop-blur-md sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Intro + direct contact */}
          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.42em] text-lavender">
              {s.eyebrow}
            </p>
            <h2 className="mt-2 font-sans text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.1] tracking-tight text-ink">
              {s.title}
            </h2>
            <p className="mt-4 max-w-md font-serif text-[15px] leading-[1.65] text-ink/70">
              {s.lead}
            </p>

            <div className="mt-8 flex flex-col gap-1">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.3em] text-ink/45">
                {s.or}
              </span>
              <a
                href="mailto:info@digitallongview.com"
                className="font-sans text-[clamp(18px,2.2vw,24px)] font-semibold tracking-tight text-ink transition-colors hover:text-lavender"
              >
                info@digitallongview.com
              </a>
              <a
                href="tel:+4915141441262"
                className="font-serif text-[17px] text-ink/70 transition-colors hover:text-lavender"
              >
                +49 151 4144 1262
              </a>
            </div>
          </div>

          {/* The form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
