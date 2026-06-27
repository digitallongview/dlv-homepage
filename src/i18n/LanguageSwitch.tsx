/**
 * DE/EN language switch — mirrors the pill toggle already used on the videos and
 * in the legal modal, so it feels native to the design. Two visual variants:
 *  - `header`  — white on the violet header/menu chrome
 *  - `light`   — ink on cream (footer / light surfaces)
 */
import { useLang, type Lang } from './lang'

const LANGS: Lang[] = ['de', 'en']

export default function LanguageSwitch({
  variant = 'light',
  className = '',
}: {
  variant?: 'header' | 'light'
  className?: string
}) {
  const { lang, setLang } = useLang()
  const onHeader = variant === 'header'

  return (
    <div
      role="group"
      aria-label="Sprache / Language"
      className={[
        'flex flex-none overflow-hidden rounded-full border',
        onHeader ? 'border-white/40' : 'border-ink/15 bg-white/50',
        className,
      ].join(' ')}
    >
      {LANGS.map((l) => {
        const active = lang === l
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            lang={l}
            className={[
              'px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition-colors',
              active
                ? 'text-white'
                : onHeader
                  ? 'text-white/60 hover:text-white/90'
                  : 'text-ink/45 hover:text-ink/70',
            ].join(' ')}
            style={
              active
                ? { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' }
                : undefined
            }
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}
