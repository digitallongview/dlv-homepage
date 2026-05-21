import { useState, type FormEvent } from 'react'

export default function HeroOverlay() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Newsletter-Backend anbinden (Phase 2)
    console.info('signup:', email)
    setStatus('sent')
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center pt-4 text-center sm:pt-6">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.42em] text-ink/70 sm:text-[12px]">
        Die Digitalagentur für Raum, Zeit und Kultur
      </p>

      <h1
        className="mt-3 font-sans font-bold leading-[1.05]"
        style={{
          fontSize: 'clamp(30px, 5vw, 48px)',
          letterSpacing: '0.04em',
          color: '#2d1f4d',
        }}
      >
        ist gerade{' '}
        <span
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(120deg, #b29bd0 0%, #8c74aa 45%, #5d4684 100%)',
          }}
        >
          in Entstehung
        </span>
      </h1>

      <p className="mt-4 max-w-[440px] font-serif text-[14px] italic leading-[1.5] text-ink/70 sm:text-[15px]">
        Falls du bereit jetzt schon erste Inhalte und Benachrichtigungen zu
        Updates möchtest, trag dich hier ein.
      </p>

      {status === 'idle' ? (
        <form
          onSubmit={onSubmit}
          className="mt-6 flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:gap-2"
        >
          <label className="sr-only" htmlFor="signup-email">
            E-Mail-Adresse
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            className="h-[56px] flex-1 rounded-xl border-2 border-ink/15 bg-white px-5 font-sans text-[16px] text-ink shadow-sm outline-none transition-colors placeholder:text-ink/40 hover:border-ink/30 focus:border-lavender focus:ring-4 focus:ring-lavender/20"
            autoComplete="email"
          />
          <button
            type="submit"
            className="group inline-flex h-[56px] cursor-pointer items-center justify-center gap-2 rounded-xl px-7 font-sans text-[15px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_-10px_rgba(93,70,132,0.7)] transition-all hover:shadow-[0_14px_36px_-10px_rgba(93,70,132,0.85)] focus:outline-none focus:ring-4 focus:ring-lavender/40 active:scale-[0.98]"
            style={{
              background:
                'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)',
            }}
          >
            Sign up
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </form>
      ) : (
        <div
          role="status"
          className="mt-6 flex w-full max-w-[480px] items-center justify-center gap-3 rounded-xl border-2 border-lavender/30 bg-lavender/10 px-5 py-4 font-sans text-[15px] text-ink"
        >
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-full bg-lavender text-white"
          >
            ✓
          </span>
          Danke — wir melden uns, sobald es losgeht.
        </div>
      )}
    </div>
  )
}
