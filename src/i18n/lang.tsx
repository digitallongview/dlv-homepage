/**
 * Global language state for the whole site (DE/EN).
 *
 * Until now the only bilingual surface was the legal modal, which kept its own
 * `lang` state. This promotes that state to an app-level context so a single
 * language switch in the header/menu flips the entire page — copy, the legal
 * modal and the video narration defaults all read from here.
 *
 * - persisted in localStorage (migrates the legacy `dlv-legal-lang` key)
 * - first visit falls back to the browser language (German → de, else en)
 * - keeps <html lang> in sync for a11y / SEO
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from '../lib/hlsSources'

export type { Lang }

const STORAGE_KEY = 'dlv-lang'
const LEGACY_KEY = 'dlv-legal-lang'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'de'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY)
    if (stored === 'de' || stored === 'en') return stored
  } catch {
    /* storage may be unavailable (private mode) — fall through to navigator */
  }
  // No stored choice yet: German-speaking browsers get DE, everyone else EN.
  const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'de'
  return nav.startsWith('de') ? 'de' : 'en'
}

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void }

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* non-critical */
    }
  }, [])

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'de' ? 'en' : 'de'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* non-critical */
      }
      return next
    })
  }, [])

  const value = useMemo<LangCtx>(() => ({ lang, setLang, toggle }), [lang, setLang, toggle])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** Read the current language + setters. Must be used under <LanguageProvider>. */
export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}

/** Convenience: pick the value for the active language from a `{ de, en }` pair. */
export function useT(): { lang: Lang; t: <T>(pair: Record<Lang, T>) => T } {
  const { lang } = useLang()
  return { lang, t: (pair) => pair[lang] }
}
