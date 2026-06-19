import { useState, type FormEvent } from 'react'

export default function HeroOverlay() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.info('signup:', email)
    setStatus('sent')
  }

  return (
    <div className="flex w-full max-w-[580px] flex-col items-center text-center">

      {/* Headline */}
      <h1
        className="font-sans font-bold leading-[1.18]"
        style={{ fontSize: 'clamp(30px, 5.5vw, 58px)', letterSpacing: '0.025em' }}
      >
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #2d1f4d 0%, #2d1f4d 60%, #181826 100%)' }}
        >
          ist gerade{' '}
        </span>
        <span
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(120deg, #b29bd0 0%, #8c74aa 45%, #5d4684 100%)',
            paddingBottom: '0.2em',
          }}
        >
          in Entstehung
        </span>
      </h1>

      {/* Signup-Form */}
      {status === 'idle' ? (
        <form
          onSubmit={onSubmit}
          className="mt-5 flex w-full max-w-[460px] flex-col gap-2.5 sm:flex-row sm:gap-2"
        >
          <label className="sr-only" htmlFor="signup-email">E-Mail-Adresse</label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            className="h-[46px] flex-1 rounded-full border-2 border-ink/15 bg-white/90 px-5 font-sans text-[14px] text-ink shadow-sm outline-none backdrop-blur-sm transition-colors placeholder:text-ink/40 hover:border-ink/30 focus:border-lavender focus:ring-4 focus:ring-lavender/20 sm:h-[50px] sm:px-6"
            autoComplete="email"
          />
          <button
            type="submit"
            className="group inline-flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full px-6 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_10px_30px_-10px_rgba(93,70,132,0.65)] transition-all duration-200 hover:shadow-[0_14px_36px_-10px_rgba(93,70,132,0.9)] hover:brightness-110 active:scale-[0.97] sm:h-[50px] sm:px-7 sm:text-[11px]"
            style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
          >
            Sign Up
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </form>
      ) : (
        <div
          role="status"
          className="mt-5 flex w-full max-w-[460px] items-center justify-center gap-3 rounded-xl border-2 border-lavender/30 bg-lavender/10 px-5 py-3 font-sans text-[13px] text-ink sm:text-[15px]"
        >
          <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-lavender text-white">✓</span>
          Danke — wir melden uns, sobald es losgeht.
        </div>
      )}

      {/* Beschreibung unterhalb */}
      <p className="mt-3 max-w-[400px] font-serif text-[12px] italic leading-[1.5] text-ink/55 sm:text-[13px]">
        Falls du bereit jetzt schon erste Inhalte und Benachrichtigungen zu
        Updates möchtest, trag dich hier ein.
      </p>
    </div>
  )
}
