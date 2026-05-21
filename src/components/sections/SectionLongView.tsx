import SectionHeading from '../SectionHeading'

const FEATURES = [
  {
    title: 'Digitale Anwendungen',
    body: 'Webseiten, Apps und immersive Plattformen, die für lange Zeiträume gedacht sind.',
  },
  {
    title: 'Storytelling & Immersion',
    body: 'Geschichten, die Raum und Zeit überbrücken — von AR bis Audio-Walk.',
  },
  {
    title: 'Langzeit-Projekte',
    body: 'Begleitung von Initiativen, die ihre Wirkung erst über Jahrzehnte entfalten.',
  },
  {
    title: 'Kulturgestaltung',
    body: 'Kuratorische Konzepte für Institutionen, Stiftungen und Communitys.',
  },
]

export default function SectionLongView() {
  return (
    <section
      id="was-ist"
      className="relative scroll-mt-24 bg-cream px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Long Term Thinking"
          title="Was ist Digital Long View ?"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="font-sans text-[clamp(20px,2vw,26px)] font-semibold leading-tight tracking-tight text-ink">
              Die Digitalagentur für Raum, Zeit und Kultur.
            </p>
            <p className="mt-4 font-serif text-[16px] leading-[1.65] text-ink/75">
              Wir entwerfen, programmieren und kuratieren digitale Erlebnisse,
              die nicht nach der nächsten Quartalsrelease verfallen — sondern
              langlebige Spuren in Kultur und Erinnerung hinterlassen.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#wer-sind-wir"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-all hover:border-lavender hover:bg-lavender hover:text-white"
              >
                Erfahre mehr
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#kontakt"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_-8px_rgba(93,70,132,0.6)] transition-all hover:shadow-[0_12px_28px_-8px_rgba(93,70,132,0.85)]"
                style={{
                  background:
                    'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)',
                }}
              >
                Kontaktiere uns
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="relative">
            {/* TODO: echte Bilder (Teleskop links, VR-Headset rechts) später ersetzen */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-ink/8 via-lavender/15 to-ink/20 shadow-[0_30px_60px_-30px_rgba(24,24,38,0.35)]">
              <div className="flex h-full items-center justify-center font-serif text-[14px] italic text-ink/40">
                Teleskop · VR · Long-View-Illustration
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <p className="font-sans text-[clamp(22px,2.5vw,30px)] font-semibold tracking-tight text-ink">
            … um das Langzeitdenken zu fördern.
          </p>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-1.5 inline-block h-3 w-3 flex-none rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, #b29bd0, #5d4684)',
                  }}
                />
                <div>
                  <h3 className="font-sans text-[16px] font-semibold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1 font-serif text-[14px] leading-[1.6] text-ink/70">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
