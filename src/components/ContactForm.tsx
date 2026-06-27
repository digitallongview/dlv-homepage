import { useState, type FormEvent } from 'react'
import { useStrings } from '../i18n/content'
import { useLang } from '../i18n/lang'
import { sendContact } from '../lib/contactApi'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'h-[52px] w-full rounded-2xl border-2 border-ink/12 bg-white/90 px-5 font-sans text-[15px] text-ink shadow-sm outline-none transition-colors placeholder:text-ink/35 hover:border-ink/25 focus:border-lavender focus:ring-4 focus:ring-lavender/20'

/**
 * Real contact form: posts to the PHP endpoint, which notifies the team and
 * sends the visitor a localised auto-reply. All copy comes from the i18n
 * catalogue, so it flips with the global DE/EN switch.
 */
export default function ContactForm() {
  const { lang } = useLang()
  const s = useStrings().contact
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    const res = await sendContact({
      type: 'contact',
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      company: form.company,
      lang,
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-2xl border-2 border-lavender/30 bg-lavender/10 px-5 py-4 font-sans text-[14px] text-ink"
      >
        <span aria-hidden className="grid h-8 w-8 flex-none place-items-center rounded-full bg-lavender text-white">✓</span>
        {s.success}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="sr-only">{s.name}</label>
          <input id="cf-name" name="name" type="text" required autoComplete="name"
            value={form.name} onChange={set('name')} placeholder={s.namePlaceholder} className={inputClass} />
        </div>
        <div>
          <label htmlFor="cf-email" className="sr-only">{s.email}</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email"
            value={form.email} onChange={set('email')} placeholder={s.emailPlaceholder} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="sr-only">{s.subject}</label>
        <input id="cf-subject" name="subject" type="text"
          value={form.subject} onChange={set('subject')} placeholder={s.subjectPlaceholder} className={inputClass} />
      </div>

      <div>
        <label htmlFor="cf-message" className="sr-only">{s.message}</label>
        <textarea id="cf-message" name="message" required rows={5}
          value={form.message} onChange={set('message')} placeholder={s.messagePlaceholder}
          className="w-full rounded-2xl border-2 border-ink/12 bg-white/90 px-5 py-3.5 font-sans text-[15px] leading-[1.6] text-ink shadow-sm outline-none transition-colors placeholder:text-ink/35 hover:border-ink/25 focus:border-lavender focus:ring-4 focus:ring-lavender/20" />
      </div>

      {/* Honeypot — hidden from real users; bots that fill it get silently dropped. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off"
          value={form.company} onChange={set('company')} />
      </div>

      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-8 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_14px_34px_-12px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 hover:shadow-[0_18px_42px_-12px_rgba(93,70,132,0.9)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
        >
          {status === 'sending' ? s.sending : s.submit}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>

        {status === 'error' && (
          <p role="alert" className="font-sans text-[13px] text-[#a13b5a]">{s.error}</p>
        )}
      </div>

      <p className="mt-1 font-serif text-[12px] leading-[1.5] text-ink/45">{s.privacy}</p>
    </form>
  )
}
