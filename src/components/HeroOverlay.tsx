import { useState, type FormEvent } from 'react'
import { useStrings } from '../i18n/content'
import { useLang } from '../i18n/lang'
import { sendContact } from '../lib/contactApi'

export default function HeroOverlay({ phase }: { phase: number }) {
  const { lang } = useLang()
  const s = useStrings().hero
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    const res = await sendContact({ type: 'signup', email, lang })
    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <div className="flex w-full max-w-[580px] flex-col items-center text-center">

      {/* Headline — erscheint in Phase 2, Animation startet beim Mount */}
      {phase >= 2 && (
        <div style={{ animation: 'headline-glow 2.2s ease-out both' }}>
          <h1
            className="font-sans font-bold leading-[1.18]"
            style={{ fontSize: 'clamp(40px, 6vw, 58px)', letterSpacing: '0.025em' }}
          >
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #2d1f4d 0%, #2d1f4d 60%, #181826 100%)',
                paddingBottom: '0.15em',
              }}
            >
              {s.headlineA}
            </span>
            <span
              className="inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(120deg, #b29bd0 0%, #8c74aa 45%, #5d4684 100%)',
                paddingBottom: '0.2em',
              }}
            >
              {s.headlineB}
            </span>
          </h1>
        </div>
      )}

      {/* Form + Beschreibung — erscheint in Phase 3 */}
      {phase >= 3 && (
        <div className="flex w-full flex-col items-center" style={{ animation: 'fade-up 0.7s ease-out both' }}>
          {status !== 'sent' ? (
            <form
              onSubmit={onSubmit}
              className="mt-5 flex w-full max-w-[540px] flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:gap-2"
            >
              <label className="sr-only" htmlFor="signup-email">{s.emailLabel}</label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={s.emailPlaceholder}
                className="h-[52px] w-full rounded-full border-2 border-ink/15 bg-white/90 px-5 font-sans text-[16px] text-ink shadow-sm outline-none backdrop-blur-sm transition-colors placeholder:text-ink/40 hover:border-ink/30 focus:border-lavender focus:ring-4 focus:ring-lavender/20 sm:h-[50px] sm:min-w-[200px] sm:flex-1 sm:px-6 sm:text-[14px]"
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex h-[52px] min-w-[160px] cursor-pointer items-center justify-center gap-2 self-center rounded-full px-8 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_10px_30px_-10px_rgba(93,70,132,0.65)] transition-all duration-200 hover:shadow-[0_14px_36px_-10px_rgba(93,70,132,0.9)] hover:brightness-110 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:h-[50px] sm:min-w-0 sm:flex-none sm:self-auto sm:px-7 sm:text-[11px]"
                style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
              >
                {status === 'sending' ? s.sending : s.signup}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </form>
          ) : (
            <div
              role="status"
              className="mt-5 flex w-full max-w-[460px] items-center justify-center gap-3 rounded-xl border-2 border-lavender/30 bg-lavender/10 px-5 py-3 font-sans text-[13px] text-ink sm:text-[15px]"
            >
              <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-lavender text-white">✓</span>
              {s.success}
            </div>
          )}

          {status === 'error' && (
            <p role="alert" className="mt-3 font-sans text-[13px] text-[#a13b5a]">{s.error}</p>
          )}

          <p className="mt-9 max-w-[400px] font-serif text-[14px] italic leading-[1.5] text-ink/55 sm:mt-3 sm:text-[13px]">
            {s.hint}
          </p>
        </div>
      )}
    </div>
  )
}
