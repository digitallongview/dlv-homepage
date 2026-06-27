import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useStrings } from '../i18n/content'
import { useLang } from '../i18n/lang'
import ContactForm from './ContactForm'

// ─── Context ────────────────────────────────────────────────────────────────

type ContactCtx = { open: () => void; close: () => void }
const Ctx = createContext<ContactCtx | null>(null)

/** Open/close the contact pop-up from anywhere below the provider. */
export function useContactModal(): ContactCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useContactModal must be used inside <ContactModalProvider>')
  return ctx
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function ContactModal({ active, onClose }: { active: boolean; onClose: () => void }) {
  const s = useStrings().contact
  const { lang } = useLang()
  // `render` keeps the dialog mounted through the closing transition.
  const [render, setRender] = useState(active)
  const [visible, setVisible] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (active) {
      setRender(true)
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const t = setTimeout(() => setRender(false), 230)
    return () => clearTimeout(t)
  }, [active])

  // Scroll-lock + Escape + focus handling while mounted.
  useEffect(() => {
    if (!render) return
    restoreFocus.current = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusId = requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      cancelAnimationFrame(focusId)
      restoreFocus.current?.focus?.()
    }
  }, [render, onClose])

  if (!render) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={[
          'absolute inset-0 bg-ink/55 backdrop-blur-[3px] transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* Panel */}
      <div
        className={[
          'relative z-10 flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-3xl bg-cream',
          'shadow-[0_-10px_60px_-12px_rgba(24,24,38,0.45)] sm:max-h-[90vh] sm:max-w-[680px] sm:rounded-3xl',
          'transition-all duration-300 ease-out',
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[0.98] opacity-0',
        ].join(' ')}
      >
        {/* Gradient accent edge */}
        <div
          aria-hidden
          className="h-1 w-full flex-none"
          style={{ background: 'linear-gradient(90deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
        />

        {/* Header */}
        <div className="flex flex-none items-start justify-between gap-4 border-b border-ink/10 px-6 pb-4 pt-5 sm:px-9 sm:pt-7">
          <div className="min-w-0">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.42em] text-lavender">
              {s.eyebrow}
            </p>
            <h2
              id="contact-modal-title"
              className="mt-1.5 font-sans text-[clamp(22px,3vw,30px)] font-bold leading-tight tracking-tight text-ink"
            >
              {s.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={lang === 'de' ? 'Schließen' : 'Close'}
            className="grid h-9 w-9 flex-none place-items-center rounded-full border border-ink/15 text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-lavender/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="no-scrollbar overflow-y-auto px-6 py-6 sm:px-9 sm:py-7" style={{ overscrollBehavior: 'contain' }}>
          <p className="max-w-xl font-serif text-[15px] leading-[1.65] text-ink/70">{s.lead}</p>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.3em] text-ink/45">{s.or}</span>
            <a href="mailto:info@digitallongview.com" className="font-sans text-[17px] font-semibold tracking-tight text-ink transition-colors hover:text-lavender">
              info@digitallongview.com
            </a>
            <a href="tel:+4915141441262" className="font-serif text-[15px] text-ink/70 transition-colors hover:text-lavender">
              +49 151 4144 1262
            </a>
          </div>

          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const open = useCallback(() => setActive(true), [])
  const close = useCallback(() => setActive(false), [])

  // Intercept every `#kontakt` link site-wide (header, footer, sections, mobile
  // menu) so the pop-up opens instead of scrolling — no need to touch each CTA.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const target = e.target as Element | null
      const link = target?.closest?.('a[href$="#kontakt"]')
      if (link) {
        e.preventDefault()
        setActive(true)
      }
    }
    document.addEventListener('click', onClick, true) // capture: runs before React handlers
    // Direct visit to …/#kontakt → open + clean the hash so re-clicks still fire.
    if (typeof window !== 'undefined' && window.location.hash === '#kontakt') {
      setActive(true)
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  const value = useMemo<ContactCtx>(() => ({ open, close }), [open, close])

  return (
    <Ctx.Provider value={value}>
      {children}
      <ContactModal active={active} onClose={close} />
    </Ctx.Provider>
  )
}
