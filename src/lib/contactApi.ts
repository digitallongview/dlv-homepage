/**
 * Tiny client for the PHP mail endpoint (`public/api/contact.php`).
 *
 * Two message kinds share one endpoint:
 *  - `contact` — the full contact form (name + e-mail + message)
 *  - `signup`  — the hero "early access" e-mail capture
 *
 * The endpoint sends a notification to the team AND a localised confirmation /
 * auto-reply to the visitor, so the UI only needs `{ ok }` back.
 */
import type { Lang } from '../i18n/lang'

export type ContactType = 'contact' | 'signup'

export interface ContactPayload {
  type: ContactType
  email: string
  name?: string
  subject?: string
  message?: string
  lang: Lang
  /** Honeypot — must stay empty; real users never see this field. */
  company?: string
}

/** Resolved relative to the site root, so it works behind any domain/path. */
const ENDPOINT = '/api/contact.php'

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    // The endpoint always answers JSON; tolerate an empty/garbled body too.
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (res.ok && data?.ok) return { ok: true }
    return { ok: false, error: data?.error || `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network error' }
  }
}
