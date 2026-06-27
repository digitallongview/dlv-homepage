import { useEffect, useRef, useState } from 'react'
import { useLegalModal } from '../legal/LegalModal'
import { useStrings, useFeatures } from '../../i18n/content'

function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function ArrowUnderlineLink({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-4 border-b border-ink/30 pb-2 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/70 transition-colors hover:text-ink"
    >
      <span>{children}</span>
      <span aria-hidden className="flex-none transition-transform group-hover:translate-x-1">→</span>
    </button>
  )
}

export default function MobileLongView() {
  const tele = useInView(0.25)
  const vr = useInView(0.25)
  const { open } = useLegalModal()
  const s = useStrings()
  const features = useFeatures()

  return (
    <section id="was-ist" className="scroll-mt-4 bg-cream">

      {/* ─────────── Frame I ─────────── */}
      <div className="flex min-h-[106svh] flex-col">
        <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col px-6 pt-16">
          <h2 className="font-sans text-[clamp(30px,9vw,40px)] font-bold uppercase leading-[1.12] tracking-[0.04em] text-ink">
            {s.sections.longviewTitle}
          </h2>
          <div className="mt-5 h-px w-full bg-gradient-to-r from-ink/35 via-ink/12 to-transparent" />

          <p className="mt-7 font-sans text-[clamp(18px,5vw,22px)] font-semibold leading-snug tracking-tight text-ink">
            {s.longview.lead}
          </p>
          <p className="mt-5 font-serif text-[15px] leading-[1.7] text-ink/70">
            {s.longview.body}
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <ArrowUnderlineLink onClick={() => open('longview')}>{s.longview.moreLongView}</ArrowUnderlineLink>
            <ArrowUnderlineLink onClick={() => open('langzeitdenken')}>{s.longview.whyLongterm}</ArrowUnderlineLink>
          </div>
        </div>

        {/* Bottom band: telescope over violet wedge (face baked into cone) */}
        <div ref={tele.ref} className="relative mt-auto h-[clamp(220px,38vh,380px)] w-full overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-out"
            style={{ transform: tele.inView ? 'translateX(0)' : 'translateX(55%)' }}
          >
            <img
              src="/assets/cone-right.webp"
              alt="" aria-hidden draggable={false}
              className="absolute top-[-10%] right-0 h-[69%] w-auto max-w-none select-none object-contain object-right-top"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(to right, #F7ECED 0%, #F7ECED 14%, rgba(247,236,237,0.3) 52%, transparent 88%)' }}
            />
          </div>
          <img
            src="/assets/telescope.webp"
            alt="Teleskop auf Stativ"
            draggable={false}
            className="absolute bottom-0 left-[3%] z-10 h-[100%] w-auto select-none object-contain object-bottom drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ─────────── Frame II ─────────── */}
      <div className="flex min-h-[100svh] flex-col">
        <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col px-6 pt-4">
          <h2 className="self-end text-right font-sans text-[clamp(18px,5vw,22px)] font-semibold leading-tight tracking-tight text-ink">
            {s.longview.featuresTitleMobile}
          </h2>

          <p className="mt-8 text-center font-serif text-[16px] leading-[1.7] text-ink/75">
            {s.longview.featuresIntroMobile}
          </p>
          <p className="mt-5 text-center font-serif text-[14px] italic leading-[1.6] text-ink/55">
            {s.longview.featuresLeadMobile}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
            {features.map((f) => (
              <div key={f.title}>
                <span
                  aria-hidden
                  className="mb-3 block h-4 w-4 rounded-full"
                  style={{ background: 'radial-gradient(circle at 30% 30%, #b29bd0, #5d4684)' }}
                />
                <h3 className="font-sans text-[14px] font-semibold tracking-tight text-ink">{f.title}</h3>
                <p className="mt-1.5 font-serif text-[12.5px] leading-[1.55] text-ink/65">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom band: VR headset over mirrored violet wedge */}
        <div ref={vr.ref} className="relative mt-auto h-[clamp(170px,30vh,310px)] w-full overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-[900ms] ease-out"
            style={{ transform: vr.inView ? 'translateX(0)' : 'translateX(-55%)' }}
          >
            <img
              src="/assets/cone-left.webp"
              alt="" aria-hidden draggable={false}
              className="absolute bottom-0 left-0 h-full w-auto max-w-[82%] select-none object-contain object-left-bottom"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(to left, #F7ECED 0%, #F7ECED 12%, rgba(247,236,237,0.28) 52%, transparent 88%)' }}
            />
          </div>
          <img
            src="/assets/vr-headset.webp"
            alt="VR-Headset"
            draggable={false}
            className="absolute bottom-[18%] right-[6%] z-10 w-[52%] max-w-[280px] select-none object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
