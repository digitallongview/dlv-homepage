import { useState } from 'react'
import SectionHeading from '../SectionHeading'

type Member = {
  id: string
  name: string
  role: string
  intro: string
  body: string
}

const TEAM: Member[] = [
  {
    id: 'lukas',
    name: 'Lukas',
    role: '… und mir geht es um ZEIT.',
    intro: 'Hi! Ich bin Lukas …',
    body: 'Mich interessiert, wie wir digitale Räume so bauen, dass sie nicht nach drei Jahren wieder abgerissen werden. Langlebige Software, langlebige Geschichten, langlebige Kultur.',
  },
  {
    id: 'cora',
    name: 'Cora',
    role: '… und mich treibt RAUM.',
    intro: 'Hi! Ich bin Cora …',
    body: 'Ich denke vom Ort aus: wie Architektur, Landschaft und Digitalität ineinandergreifen. Mein Lieblingswerkzeug ist die Konzeptzeichnung — direkt am Stein.',
  },
  {
    id: 'cora-2',
    name: 'Cora',
    role: '… und mich treibt KULTUR.',
    intro: 'Hi! Ich bin Cora …',
    body: 'Kultur ist kein Produkt, sondern eine Praxis. Ich kuratiere Programme und Formate, die Menschen einladen, langsamer zu schauen, zu hören, mitzudenken.',
  },
]

export default function SectionMotivation() {
  const [selected, setSelected] = useState<Member>(TEAM[0])

  return (
    <section
      id="wer-sind-wir"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
    >
      {/* Lavendel-Polygon-Band (Figma „Polygon 30" → schräges Band durch die Sektion) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[480px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(140,116,170,0.22) 0%, rgba(140,116,170,0.05) 100%)',
          clipPath: 'polygon(0 30%, 100% 0, 100% 70%, 0 100%)',
        }}
      />

      <div className="mx-auto max-w-[1200px]">
        <SectionHeading eyebrow="Wer sind wir" title="Motivation & Vorstellung" />

        <p className="mt-6 max-w-xl font-serif text-[18px] italic leading-[1.55] text-ink/75">
          Wähle eine:n von uns aus, um mehr zu erfahren.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-8 lg:justify-start">
            {TEAM.map((m) => {
              const active = m.id === selected.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelected(m)}
                  className={`group relative flex flex-col items-center transition-transform duration-300 focus:outline-none ${
                    active ? '-translate-y-2' : 'hover:-translate-y-1'
                  }`}
                  aria-pressed={active}
                  aria-label={`Profil ${m.name} öffnen`}
                >
                  <div
                    className={`aspect-[3/4] w-[140px] overflow-hidden rounded-3xl shadow-[0_18px_50px_-18px_rgba(24,24,38,0.4)] transition-all duration-300 sm:w-[180px] ${
                      active
                        ? 'ring-4 ring-lavender'
                        : 'ring-2 ring-transparent group-hover:ring-lavender/30'
                    }`}
                    style={{
                      background:
                        'linear-gradient(160deg, #cfb5e0 0%, #8c74aa 60%, #4d3a6e 100%)',
                    }}
                  >
                    {/* TODO: echtes Portrait einsetzen */}
                    <div className="flex h-full items-end justify-center pb-4 font-sans text-[14px] font-semibold uppercase tracking-[0.18em] text-white/85">
                      {m.name}
                    </div>
                  </div>
                  <span
                    className={`mt-3 font-sans text-[12px] font-medium uppercase tracking-[0.22em] transition-colors ${
                      active ? 'text-lavender' : 'text-ink/55'
                    }`}
                  >
                    {m.name}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white/70 p-8 shadow-[0_20px_60px_-30px_rgba(24,24,38,0.3)] backdrop-blur-md sm:p-10">
            <p className="font-sans text-[13px] font-medium uppercase tracking-[0.32em] text-lavender">
              {selected.intro}
            </p>
            <h3 className="mt-3 font-sans text-[clamp(22px,3vw,30px)] font-bold leading-tight tracking-tight text-ink">
              {selected.role}
            </h3>
            <p className="mt-5 font-serif text-[16px] leading-[1.65] text-ink/75">
              {selected.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
