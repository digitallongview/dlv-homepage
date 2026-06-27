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
import { LEGAL, LEGAL_UI, type LegalBlock, type LegalDoc, type LegalKey } from '../../lib/legalContent'
import { useLang, type Lang } from '../../i18n/lang'

// ─── Context ──────────────────────────────────────────────────────────────────

type LegalCtx = { open: (key: LegalKey) => void }
const Ctx = createContext<LegalCtx | null>(null)

/** Open the Impressum / Datenschutz pop-up from anywhere below the provider. */
export function useLegalModal(): LegalCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLegalModal must be used inside <LegalModalProvider>')
  return ctx
}

// ─── Inline linking ───────────────────────────────────────────────────────────

const LINK_CLASS =
  'font-medium text-lavender-dark underline decoration-lavender/40 underline-offset-2 transition-colors hover:text-lavender'

// Explicit `[label](https://…)` markdown links — used to link a specific word
// in running text (e.g. the LTAP reference).
const MD_LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
const TOKEN = /(https?:\/\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi

/** Auto-link bare URLs & e-mail addresses inside a plain-text segment. */
function autoLink(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0
    if (start > last) out.push(text.slice(last, start))

    const token = m[0]
    const isEmail = token.includes('@') && !/^https?:/i.test(token)

    // URLs often end a sentence — keep trailing punctuation outside the link.
    let href = token
    let trail = ''
    if (!isEmail) {
      const tm = token.match(/[.,;:)]+$/)
      if (tm) {
        trail = tm[0]
        href = token.slice(0, token.length - trail.length)
      }
    }

    out.push(
      <a
        key={`${keyPrefix}-${start}`}
        href={isEmail ? `mailto:${href}` : href}
        target={isEmail ? undefined : '_blank'}
        rel={isEmail ? undefined : 'noreferrer noopener'}
        className={LINK_CLASS}
      >
        {href}
      </a>,
    )
    if (trail) out.push(trail)
    last = start + token.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Render running text with explicit markdown links first, then auto-linked
 *  bare URLs / e-mails in the remaining segments. */
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(MD_LINK)) {
    const start = m.index ?? 0
    if (start > last) out.push(...autoLink(text.slice(last, start), `t${start}`))
    out.push(
      <a
        key={`md-${start}`}
        href={m[2]}
        target="_blank"
        rel="noreferrer noopener"
        className={LINK_CLASS}
      >
        {m[1]}
      </a>,
    )
    last = start + m[0].length
  }
  if (last < text.length) out.push(...autoLink(text.slice(last), `t${last}`))
  return out
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function Block({ block, onNavigate }: { block: LegalBlock; onNavigate: (key: LegalKey) => void }) {
  switch (block.k) {
    // Numbered top-level sections (semantically h3 below the dialog's h2 title)
    case 'h2':
      return (
        <h3 className="mt-10 flex items-center gap-3 font-sans text-[18px] font-bold leading-tight tracking-tight text-ink first:mt-0">
          <span
            aria-hidden
            className="h-4 w-1 flex-none rounded-full"
            style={{ background: 'linear-gradient(180deg, #b29bd0, #5d4684)' }}
          />
          {block.t}
        </h3>
      )
    case 'h3':
      return (
        <h4 className="mt-6 font-sans text-[14.5px] font-semibold tracking-tight text-ink">
          {block.t}
        </h4>
      )
    case 'h4':
      return <h5 className="mt-5 font-sans text-[13px] font-semibold text-ink/85">{block.t}</h5>
    case 'p':
      return (
        <p className="mt-3 whitespace-pre-line font-serif text-[14px] leading-[1.72] text-ink/72">
          {linkify(block.t)}
        </p>
      )
    case 'ul':
      return (
        <ul className="mt-3 flex flex-col gap-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span
                aria-hidden
                className="mt-[7px] inline-block h-1.5 w-1.5 flex-none rounded-full"
                style={{ background: 'radial-gradient(circle at 30% 30%, #b29bd0, #5d4684)' }}
              />
              <span className="font-serif text-[14px] leading-[1.7] text-ink/72">{linkify(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'note':
      return (
        <p className="mt-4 rounded-xl border border-lavender/25 bg-lavender/5 px-4 py-3 font-sans text-[11.5px] leading-[1.65] tracking-wide text-ink/65">
          {block.t}
        </p>
      )
    // Cross-link to another pop-up — same arrow-underline styling as the
    // front-page links, separated from the body by a hairline rule.
    case 'modalLink':
      return (
        <div className="mt-10 border-t border-ink/10 pt-6">
          <button
            type="button"
            onClick={() => onNavigate(block.to)}
            className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/60 transition-all duration-200 hover:border-ink/60 hover:text-ink"
          >
            {block.t}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      )
  }
}

// ─── Language switch — mirrors the DE/EN toggle on the Langzeit-Design video ──

function LangSwitch({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  return (
    <div className="flex flex-none overflow-hidden rounded-full border border-ink/15 bg-white/50">
      {(['de', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onLang(l)}
          aria-pressed={lang === l}
          className={[
            'px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition-colors',
            lang === l ? 'text-white' : 'text-ink/45 hover:text-ink/70',
          ].join(' ')}
          style={lang === l ? { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' } : undefined}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function LegalModal({
  activeKey,
  lang,
  onLang,
  onClose,
  onNavigate,
}: {
  activeKey: LegalKey | null
  lang: Lang
  onLang: (l: Lang) => void
  onClose: () => void
  onNavigate: (key: LegalKey) => void
}) {
  // `render` keeps the last doc mounted through the closing transition.
  const [render, setRender] = useState<LegalKey | null>(activeKey)
  const [visible, setVisible] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  // Drive enter / exit transitions off `activeKey`.
  useEffect(() => {
    if (activeKey) {
      setRender(activeKey)
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const t = setTimeout(() => setRender(null), 230)
    return () => clearTimeout(t)
  }, [activeKey])

  // Scroll-lock the page + close on Escape while the dialog is mounted.
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

  const doc: LegalDoc = LEGAL[render][lang]
  const ui = LEGAL_UI[lang]

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
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
          'relative z-10 flex max-h-[90svh] w-full flex-col overflow-hidden rounded-t-3xl bg-cream',
          'shadow-[0_-10px_60px_-12px_rgba(24,24,38,0.45)] sm:max-h-[88vh] sm:max-w-[760px] sm:rounded-3xl',
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
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.42em] text-lavender">
              {doc.eyebrow}
            </p>
            <h2
              id="legal-modal-title"
              className="mt-1.5 font-sans text-[clamp(22px,3vw,30px)] font-bold leading-tight tracking-tight text-ink"
            >
              {doc.title}
            </h2>
          </div>

          <div className="flex flex-none items-center gap-2">
            <LangSwitch lang={lang} onLang={onLang} />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={ui.close}
              className="grid h-9 w-9 flex-none place-items-center rounded-full border border-ink/15 text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink focus:outline-none focus:ring-2 focus:ring-lavender/40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body — remounts per document so scroll resets to top */}
        <div
          key={render}
          className="no-scrollbar overflow-y-auto px-6 py-6 sm:px-9 sm:py-7"
          style={{ overscrollBehavior: 'contain' }}
        >
          {doc.blocks.map((block, i) => (
            <Block key={i} block={block} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Bottom scroll fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-cream to-transparent"
        />
      </div>
    </div>,
    document.body,
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LegalModalProvider({ children }: { children: ReactNode }) {
  const [activeKey, setActiveKey] = useState<LegalKey | null>(null)
  // Language is now global (header switch) — the modal just reads/writes it.
  const { lang, setLang } = useLang()

  const close = useCallback(() => setActiveKey(null), [])
  const navigate = useCallback((key: LegalKey) => setActiveKey(key), [])
  const value = useMemo<LegalCtx>(() => ({ open: (key) => setActiveKey(key) }), [])

  return (
    <Ctx.Provider value={value}>
      {children}
      <LegalModal activeKey={activeKey} lang={lang} onLang={setLang} onClose={close} onNavigate={navigate} />
    </Ctx.Provider>
  )
}
