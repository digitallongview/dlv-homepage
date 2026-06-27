/**
 * Central bilingual content catalogue (DE/EN) for the whole site.
 *
 * Both the desktop and the mobile component trees read their copy from here, so a
 * string exists exactly once and the DE/EN switch flips everything at once.
 *
 * - `STRINGS[lang]` — flat UI chrome (nav, hero, footer, contact form, headings …)
 * - `teamText / projectText / serviceText / features` — per-id editorial bundles
 *   that the components merge with their own (non-translatable) layout config
 *   (image paths, gradients, clip-paths, video kinds …).
 *
 * The German text is the source of truth; the English is a faithful translation.
 */
import type { ReactNode } from 'react'
import { useLang, type Lang } from './lang'

const Em = ({ children }: { children: ReactNode }) => (
  <strong className="font-normal italic">{children}</strong>
)

const srcLink = (href: string, label: string) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="underline underline-offset-2 transition-colors hover:text-ink/60"
  >
    {label}
  </a>
)

const fffLogo = (
  <a
    href="https://www.fff-bayern.de/"
    target="_blank"
    rel="noreferrer noopener"
    aria-label="FilmFernsehFonds Bayern"
    className="mt-2 -ml-2.5 block w-fit"
  >
    <img
      src="/assets/fff-logo.png"
      alt="FilmFernsehFonds Bayern"
      width={900}
      height={360}
      className="h-11 w-auto opacity-60 transition-opacity hover:opacity-100"
    />
  </a>
)

// ─── Flat UI chrome ─────────────────────────────────────────────────────────

type Strings = {
  nav: { wasIst: string; werSind: string; portfolio: string; leistungen: string; kontakt: string; header: string; footer: string }
  a11y: { skip: string; menu: string; openMenu: string; closeMenu: string; toTop: string; switchLang: string; langName: string }
  hero: {
    loading: string
    tagline: string
    headlineA: string
    headlineB: string
    emailLabel: string
    emailPlaceholder: string
    signup: string
    sending: string
    success: string
    hint: string
    error: string
  }
  sections: {
    longviewEyebrow: string
    longviewTitle: string
    motivationEyebrow: string
    motivationTitle: string
    portfolioEyebrow: string
    portfolioTitle: string
    leistungenEyebrow: string
    leistungenTitle: string
  }
  longview: {
    lead: string
    body: ReactNode
    moreLongView: string
    whyLongterm: string
    featuresTitle: string
    featuresTitleMobile: string
    featuresIntroMobile: string
    featuresLeadMobile: string
  }
  motivation: { talk: string; contact: string; swipe: string }
  footer: {
    partnerTitle: string
    partnerBody: string
    zeitgeistTitle: string
    zeitgeistBody: ReactNode
    kontakt: string
    impressum: string
    datenschutz: string
    cookies: string
    agbs: string
    header: string
    start: string
  }
  contact: {
    eyebrow: string
    title: string
    lead: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    subject: string
    subjectPlaceholder: string
    message: string
    messagePlaceholder: string
    submit: string
    sending: string
    success: string
    error: string
    privacy: string
    or: string
  }
}

const DE: Strings = {
  nav: {
    wasIst: 'Was ist Long View?',
    werSind: 'Wer sind wir?',
    portfolio: 'Portfolio',
    leistungen: 'Leistungen',
    kontakt: 'Kontakt',
    header: 'Header',
    footer: 'Footer',
  },
  a11y: {
    skip: 'Zum Inhalt springen',
    menu: 'Menü',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü zu',
    toTop: 'Zum Seitenanfang',
    switchLang: 'Sprache wechseln',
    langName: 'Deutsch',
  },
  hero: {
    loading: 'Für die zukünftigen Generationen',
    tagline: 'Die Digitalagentur für Raum, Zeit und Kultur',
    headlineA: 'ist gerade',
    headlineB: 'in Entstehung',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'deine@email.de',
    signup: 'Sign Up',
    sending: 'Senden …',
    success: 'Danke — wir melden uns, sobald es losgeht.',
    hint: 'Falls du bereit jetzt schon erste Inhalte und Benachrichtigungen zu Updates möchtest, trag dich hier ein.',
    error: 'Etwas ist schiefgelaufen. Bitte versuch es später erneut.',
  },
  sections: {
    longviewEyebrow: 'Long Term Thinking',
    longviewTitle: 'Was ist Digital Long View ?',
    motivationEyebrow: 'Wer sind wir',
    motivationTitle: 'Motivation & Vorstellung',
    portfolioEyebrow: 'Langzeit-Kultur & Portfolio',
    portfolioTitle: 'Für das Langzeitdenken',
    leistungenEyebrow: 'Wie wir der Kultur dienen',
    leistungenTitle: 'Unsere Leistungen & Service',
  },
  longview: {
    lead: 'Die Digitalagentur für Raum, Zeit und Kultur.',
    body: (
      <>
        Wir schaffen <Em>Kommunikation</Em> für <Em>Kulturschaffende und Erlebende</Em>. Wir glauben
        daran eine Verbesserung lässt sich durch <Em>Partizipation und Erleben schaffen</Em>, das durch
        digitale Stützen ermöglicht wird. Somit versprechen wir uns <Em>Langzeitdenken zu erwecken</Em>.
      </>
    ),
    moreLongView: 'Erfahre mehr über unseren Long View',
    whyLongterm: 'Wieso Langzeitdenken?',
    featuresTitle: 'Um das Langzeitdenken zu fördern.',
    featuresTitleMobile: 'Um Langzeitdenken zu fördern!',
    featuresIntroMobile:
      'Wir verbinden Gestaltung, Technologie und Kultur zu Erlebnissen, die über Generationen hinweg Bestand haben — und das Denken in langen Zeiträumen selbstverständlich machen.',
    featuresLeadMobile: 'Vier Felder, in denen wir die Long View in die Praxis bringen.',
  },
  motivation: {
    talk: 'Lass uns reden',
    contact: 'Kontakt',
    swipe: 'Swipe zwischen uns, um mehr zu erfahren!',
  },
  footer: {
    partnerTitle: 'Unsere Partner & Freunde',
    partnerBody:
      'Unsere Partner kommen aus Kultur, Bildung, Technologie und kreativen Bereichen, die langfristig denken und Zeit als Arbeitsraum und -material verstehen.',
    zeitgeistTitle: 'Teile den Zeitgeist',
    zeitgeistBody: (
      <>
        Social Media? Bewusst noch nicht. Ein eigener Kanal ist in Planung – einer, der Langzeitdenken
        fördert, statt dem Takt der schnellen Aufmerksamkeit zu folgen.{' '}
        <em className="italic">Wer den Zeitgeist mit uns teilen möchte, meldet sich gern.</em>
      </>
    ),
    kontakt: 'Kontakt',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    cookies: 'Cookies',
    agbs: 'AGBs',
    header: 'Header',
    start: 'Start',
  },
  contact: {
    eyebrow: 'Teile den Zeitgeist',
    title: 'Bleib mit uns in Kontakt.',
    lead: 'Wenn dich Räume, Zeit oder Kultur interessieren — oder du selbst ein Projekt mit langem Atem planst — schreib uns.',
    name: 'Name',
    namePlaceholder: 'Dein Name',
    email: 'E-Mail',
    emailPlaceholder: 'deine@email.de',
    subject: 'Betreff',
    subjectPlaceholder: 'Worum geht es?',
    message: 'Nachricht',
    messagePlaceholder: 'Erzähl uns von deinem Projekt …',
    submit: 'Nachricht senden',
    sending: 'Senden …',
    success: 'Danke für deine Nachricht — wir melden uns so bald wie möglich.',
    error: 'Senden fehlgeschlagen. Bitte versuch es erneut oder schreib uns direkt an info@digitallongview.com.',
    privacy: 'Mit dem Absenden stimmst du zu, dass wir deine Angaben zur Bearbeitung deiner Anfrage verarbeiten (siehe Datenschutz).',
    or: 'oder direkt',
  },
}

const EN: Strings = {
  nav: {
    wasIst: 'What is Long View?',
    werSind: 'Who are we?',
    portfolio: 'Portfolio',
    leistungen: 'Services',
    kontakt: 'Contact',
    header: 'Header',
    footer: 'Footer',
  },
  a11y: {
    skip: 'Skip to content',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toTop: 'Back to top',
    switchLang: 'Switch language',
    langName: 'English',
  },
  hero: {
    loading: 'For the generations to come',
    tagline: 'The digital agency for space, time and culture',
    headlineA: 'is currently',
    headlineB: 'taking shape',
    emailLabel: 'E-mail address',
    emailPlaceholder: 'you@email.com',
    signup: 'Sign Up',
    sending: 'Sending …',
    success: 'Thank you — we’ll be in touch as soon as we go live.',
    hint: 'If you’d like early content and update notifications already, sign up here.',
    error: 'Something went wrong. Please try again later.',
  },
  sections: {
    longviewEyebrow: 'Long Term Thinking',
    longviewTitle: 'What is Digital Long View ?',
    motivationEyebrow: 'Who we are',
    motivationTitle: 'Motivation & Introduction',
    portfolioEyebrow: 'Long-Term Culture & Portfolio',
    portfolioTitle: 'For long-term thinking',
    leistungenEyebrow: 'How we serve culture',
    leistungenTitle: 'Our Services',
  },
  longview: {
    lead: 'The digital agency for space, time and culture.',
    body: (
      <>
        We create <Em>communication</Em> for <Em>cultural creators and experiencers</Em>. We believe
        that improvement can be achieved through <Em>participation and experience</Em>, enabled by
        digital support. In this way we set out to <Em>awaken long-term thinking</Em>.
      </>
    ),
    moreLongView: 'Discover more about our Long View',
    whyLongterm: 'Why long-term thinking?',
    featuresTitle: 'To foster long-term thinking.',
    featuresTitleMobile: 'To foster long-term thinking!',
    featuresIntroMobile:
      'We combine design, technology and culture into experiences that endure across generations — and make thinking in long time spans feel natural.',
    featuresLeadMobile: 'Four fields in which we put the Long View into practice.',
  },
  motivation: {
    talk: 'Let’s talk',
    contact: 'Contact',
    swipe: 'Swipe between us to learn more!',
  },
  footer: {
    partnerTitle: 'Our Partners & Friends',
    partnerBody:
      'Our partners come from culture, education, technology and the creative fields — people who think long-term and understand time as both a workspace and a material.',
    zeitgeistTitle: 'Share the Zeitgeist',
    zeitgeistBody: (
      <>
        Social media? Deliberately not yet. A channel of our own is in the works – one that fosters
        long-term thinking instead of following the rhythm of fast attention.{' '}
        <em className="italic">If you’d like to share the zeitgeist with us, do get in touch.</em>
      </>
    ),
    kontakt: 'Contact',
    impressum: 'Legal Notice',
    datenschutz: 'Privacy',
    cookies: 'Cookies',
    agbs: 'Terms',
    header: 'Header',
    start: 'Start',
  },
  contact: {
    eyebrow: 'Share the Zeitgeist',
    title: 'Stay in touch with us.',
    lead: 'If space, time or culture interest you — or you’re planning a project with a long breath of your own — write to us.',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'E-mail',
    emailPlaceholder: 'you@email.com',
    subject: 'Subject',
    subjectPlaceholder: 'What’s it about?',
    message: 'Message',
    messagePlaceholder: 'Tell us about your project …',
    submit: 'Send message',
    sending: 'Sending …',
    success: 'Thank you for your message — we’ll get back to you as soon as we can.',
    error: 'Sending failed. Please try again or e-mail us directly at info@digitallongview.com.',
    privacy: 'By submitting you agree that we process your details to handle your enquiry (see Privacy).',
    or: 'or directly',
  },
}

export const STRINGS: Record<Lang, Strings> = { de: DE, en: EN }

export function useStrings(): Strings {
  const { lang } = useLang()
  return STRINGS[lang]
}

// ─── Features (Long View) — index-keyed ─────────────────────────────────────

type Feature = { title: string; body: string }

const FEATURES: Record<Lang, Feature[]> = {
  de: [
    { title: 'Digitales Erbe bewahren', body: 'Wir nutzen immersive Medien (XR) und interaktive Erlebnisse, um Kultur digital, barrierefrei und ethisch für die Zukunft zu sichern.' },
    { title: 'Für Generationen gestalten', body: 'Wir bringen Langzeitdenken in die Praxis, damit Wissen und Kultur generationsgerecht Jahrzehnte überdauern.' },
    { title: 'Ganzheitliche Co-Creation', body: 'Wir gestalten Erlebnisse gemeinsam mit Menschen (Co-Creation) und richten den Blick auf das gesamte lebendige Umfeld (Life-Centred).' },
    { title: 'Digitale Entschleunigung', body: 'Wir nutzen digitale Vielfalt als bewussten Gegenpol zur heutigen Schnelllebigkeit — um an die zukünftigen Generationen anzuknüpfen.' },
  ],
  en: [
    { title: 'Preserving digital heritage', body: 'We use immersive media (XR) and interactive experiences to secure culture for the future — digitally, accessibly and ethically.' },
    { title: 'Designing for generations', body: 'We put long-term thinking into practice so knowledge and culture endure for decades, fairly across generations.' },
    { title: 'Holistic co-creation', body: 'We design experiences together with people (co-creation) and keep the whole living environment in view (life-centred).' },
    { title: 'Digital deceleration', body: 'We use digital diversity as a conscious counterweight to today’s fast pace — to connect with the generations to come.' },
  ],
}

export function useFeatures(): Feature[] {
  const { lang } = useLang()
  return FEATURES[lang]
}

// ─── Team (Motivation) — id-keyed ───────────────────────────────────────────

export type MemberId = 'lukas' | 'johan' | 'domi'
type MemberText = { name: string; role: string; intro: string; body: string; bodyExtended: string }

const TEAM: Record<Lang, Record<MemberId, MemberText>> = {
  de: {
    lukas: {
      name: 'Lukas',
      role: '… und mir geht es um ZEIT.',
      intro: 'Hi! Ich bin Lukas …',
      body: 'Creative Director, Visionär und Langzeitdenker. Als Stiftungsmitglied der Wemdinger Zeitpyramide denke ich in Jahrhunderten, nicht in Quartalen.',
      bodyExtended: 'Zeit ist mein Gestaltungsraum. Ich entwickle Zukunftsbilder und Future-Design-Prozesse, die sich an der Vergangenheit orientieren – an dem, was sich bewährt hat und Bestand hatte. Daraus schöpfe ich Zuversicht: Langzeitdenken ist für mich kein abstraktes Konzept, sondern ein Akt der Hoffnung – für kommende Generationen und lange Zukünfte, im Einklang mit dem Hier und Jetzt.',
    },
    johan: {
      name: 'Johann',
      role: '… und mir geht es um RAUM.',
      intro: 'Hi! Ich bin Johann …',
      body: 'XR Developer & Designer. Ich verbinde visionäres Denken mit pragmatischem Handeln – Programmierung und Design, konsequent nutzerzentriert.',
      bodyExtended: 'Raum ist für mich die Schnittstelle von Mensch, Technologie und Interaktion. XR erweitert ihn um neue Dimensionen und verbindet Vergangenheit, Gegenwart und Zukunft. Mich fasziniert, durch immersive Räume neue Formen von Wahrnehmung und Präsenz zu schaffen – Ideen nicht nur sichtbar, sondern erlebbar zu machen.',
    },
    domi: {
      name: 'Dominik',
      role: '… und mir geht es um KULTUR.',
      intro: 'Hi! Ich bin Dominik …',
      body: 'Web Developer & Digital Strategist. Ich verbinde Technologie mit Struktur – von der Entwicklung digitaler Lösungen über Automatisierung bis hin zu nachhaltigen Geschäftsprozessen.',
      bodyExtended: 'Kultur ist für mich das, was Menschen verbindet, Identität schafft und Ideen über Generationen hinweg weiterträgt. Sie prägt, wie wir denken, handeln und miteinander leben. Mich fasziniert, wie digitale Technologien dazu beitragen können, kulturelle Werte sichtbar, zugänglich und erlebbar zu machen – und wie Innovation entsteht, wenn Tradition auf Zukunft trifft.',
    },
  },
  en: {
    lukas: {
      name: 'Lukas',
      role: '… and for me it’s about TIME.',
      intro: 'Hi! I’m Lukas …',
      body: 'Creative Director, visionary and long-term thinker. As a foundation member of the Wemding Time Pyramid, I think in centuries, not quarters.',
      bodyExtended: 'Time is my design space. I develop images of the future and future-design processes that take their bearings from the past – from what has proven itself and endured. From this I draw confidence: long-term thinking is not an abstract concept for me, but an act of hope – for generations to come and long futures, in harmony with the here and now.',
    },
    johan: {
      name: 'Johann',
      role: '… and for me it’s about SPACE.',
      intro: 'Hi! I’m Johann …',
      body: 'XR developer & designer. I combine visionary thinking with pragmatic action – programming and design, consistently user-centred.',
      bodyExtended: 'For me, space is the interface between people, technology and interaction. XR expands it with new dimensions and connects past, present and future. I’m fascinated by creating new forms of perception and presence through immersive spaces – making ideas not just visible, but tangible.',
    },
    domi: {
      name: 'Dominik',
      role: '… and for me it’s about CULTURE.',
      intro: 'Hi! I’m Dominik …',
      body: 'Web developer & digital strategist. I combine technology with structure – from building digital solutions to automation and sustainable business processes.',
      bodyExtended: 'For me, culture is what connects people, creates identity and carries ideas across generations. It shapes how we think, act and live together. I’m fascinated by how digital technologies can help make cultural values visible, accessible and tangible – and how innovation arises when tradition meets the future.',
    },
  },
}

export function useTeamText(): Record<MemberId, MemberText> {
  const { lang } = useLang()
  return TEAM[lang]
}

// ─── Services (Leistungen) — id-keyed ───────────────────────────────────────

export type ServiceId = 'programmierung' | 'immersive' | 'marketing' | 'grafik' | 'gamification' | '3d' | 'langzeit'
type ServiceText = { title: string; body: string; body2?: string; body3?: string; cta: string }

const SERVICES: Record<Lang, Record<ServiceId, ServiceText>> = {
  de: {
    programmierung: {
      title: 'Programmierung & Web',
      body: 'Wir entwickeln digitale Systeme, die nicht für den nächsten Trend gebaut werden, sondern für nachhaltige Nutzung, Weiterentwicklung und kulturelle Relevanz.',
      body2: 'Webseiten, Plattformen und individuelle Software verstehen wir als Systeme, die Kultur ermöglichen: Sie müssen sich verändern können, ohne ihre Identität zu verlieren.',
      body3: 'Von der technischen Architektur bis zur digitalen Erfahrung gestalten wir Lösungen, die heute funktionieren und morgen neugedacht werden.',
      cta: 'Anfrage Coding',
    },
    immersive: {
      title: 'Immersive Medien',
      body: 'Wir nutzen Augmented, Virtual und Mixed Reality, um neue Räume zwischen dem Digitalen und Physischen entstehen zu lassen.',
      body2: 'Dabei geht es nicht darum, Realität zu ersetzen, sondern sie zu erweitern: durch zusätzliche Ebenen, neue Perspektiven und interaktive Möglichkeiten der Begegnung.',
      body3: 'Wir gestalten immersive Erlebnisse, die über klassische Vermittlung hinausgehen und Menschen auf neue Weise mit Kultur, Wissen und Orten verbinden.',
      cta: 'Anfrage zu VR',
    },
    marketing: {
      title: 'Marketing & PR',
      body: 'Wir bringen Kultur, Räume und Ideen in den Dialog mit Menschen.',
      body2: 'Durch Marketing, PR und strategische Kommunikation schaffen wir Zugänge, die Inhalte verständlich machen und Erlebnisse nach außen erweitern.',
      body3: 'Unsere Arbeit verbindet Analyse, Gestaltung und Vermittlung — damit Projekte nicht nur sichtbar werden, sondern Bedeutung entfalten.',
      cta: 'Anfrage Marketing',
    },
    grafik: {
      title: 'Grafik & Content',
      body: 'Wir entwickeln visuelle Kommunikation, die nicht nur Aufmerksamkeit erzeugt, sondern Bedeutung schafft.',
      body2: 'Gestaltung verstehen wir als Mittel, Inhalte einzuordnen, verständlich zu machen und in einen kulturellen Kontext zu setzen, unabhängig davon, ob sie digital, gedruckt oder im Raum stattfindet.',
      body3: 'So entstehen Inhalte, die nicht nur gesehen werden, sondern etwas auslösen, einordnen und über den Moment hinaus wirken.',
      cta: 'Anfrage Grafik',
    },
    gamification: {
      title: 'Gamification & Storytelling',
      body: 'Videospiele sind kulturelle Systeme, in denen Menschen lernen, handeln und Bedeutung selbst erzeugen.',
      body2: 'Wir übertragen diese Logik auf digitale und physische Kontexte, um Storytelling und Inhalte interaktiv erfahrbar zu machen. Im Mittelpunkt steht dabei nicht der passive Konsum, sondern Partizipation: Menschen werden zu aktiven Teilnehmenden, die Inhalte durch ihre Entscheidungen, Handlungen und Perspektiven mitgestalten.',
      body3: 'Durch Narrative, Entscheidungen und Gamification entstehen neue Formen der kulturellen Vermittlung.',
      cta: 'Anfrage Gaming',
    },
    '3d': {
      title: '3D & Visualisierung',
      body: '3D-Visualisierungen, die darauf ausgelegt sind, Kultur, Architektur und Objekte zu bewahren, verständlich zu machen und weiterzudenken, wie die digitale Aufbereitung stehen bei uns im Mittelpunkt.',
      body2: 'Historische Orte, zerstörte oder veränderte Räume und kulturelle Objekte werden digital nachvollziehbar gemacht, um sie für Gegenwart und Zukunft zugänglich zu halten. Dabei verstehen wir Rekonstruktion nicht als reine Abbildung, sondern als interpretativen Prozess zwischen Geschichte, Wissen und Perspektive, inklusive kultureller Betrachtungswinkel.',
      body3: 'So entsteht ein Raum für kulturellen Austausch, in dem unterschiedliche Perspektiven sichtbar werden und neue Zugänge zum gemeinsamen Verständnis von Geschichte und Gegenwart entstehen.',
      cta: 'Anfrage 3D',
    },
    langzeit: {
      title: 'Langzeit- & Futuring Design',
      body: 'Strategische Perspektiven, die nicht auf kurzfristige Ergebnisse, sondern auf langfristige kulturelle und gesellschaftliche Entwicklung ausgerichtet sind.',
      body2: 'Future Thinking hilft, die Gegenwart in Relation zu setzen und Entscheidungen im Kontext möglicher Zukünfte zu verstehen. Zukunft wird dabei als gestaltbarer Möglichkeitsraum verstanden: Durch bewusstes Langzeitdenken entstehen Systeme, die Orientierung geben, Wandel ermöglichen und positive Entwicklungen fördern.',
      body3: 'So entstehen Ansätze, die Stabilität schaffen, ohne Veränderung zu bremsen und Zukunft als Chance aktiv mitgestalten.',
      cta: 'Anfrage Long View',
    },
  },
  en: {
    programmierung: {
      title: 'Programming & Web',
      body: 'We build digital systems that aren’t made for the next trend, but for sustainable use, ongoing development and cultural relevance.',
      body2: 'We understand websites, platforms and custom software as systems that enable culture: they have to be able to change without losing their identity.',
      body3: 'From technical architecture to the digital experience, we design solutions that work today and can be rethought tomorrow.',
      cta: 'Enquiry: Coding',
    },
    immersive: {
      title: 'Immersive Media',
      body: 'We use augmented, virtual and mixed reality to let new spaces emerge between the digital and the physical.',
      body2: 'It’s not about replacing reality, but expanding it: through additional layers, new perspectives and interactive ways of encounter.',
      body3: 'We design immersive experiences that go beyond classic mediation and connect people with culture, knowledge and places in new ways.',
      cta: 'Enquiry: VR',
    },
    marketing: {
      title: 'Marketing & PR',
      body: 'We bring culture, spaces and ideas into dialogue with people.',
      body2: 'Through marketing, PR and strategic communication, we create access points that make content understandable and extend experiences outward.',
      body3: 'Our work combines analysis, design and mediation — so projects don’t just become visible, but unfold meaning.',
      cta: 'Enquiry: Marketing',
    },
    grafik: {
      title: 'Graphics & Content',
      body: 'We develop visual communication that doesn’t just attract attention, but creates meaning.',
      body2: 'We understand design as a means to frame content, make it understandable and place it in a cultural context — whether it happens digitally, in print or in space.',
      body3: 'This creates content that isn’t just seen, but sparks something, gives context and resonates beyond the moment.',
      cta: 'Enquiry: Graphics',
    },
    gamification: {
      title: 'Gamification & Storytelling',
      body: 'Video games are cultural systems in which people learn, act and create meaning themselves.',
      body2: 'We transfer this logic to digital and physical contexts to make storytelling and content interactively tangible. The focus is not on passive consumption, but on participation: people become active participants who shape content through their decisions, actions and perspectives.',
      body3: 'Through narrative, decisions and gamification, new forms of cultural mediation emerge.',
      cta: 'Enquiry: Gaming',
    },
    '3d': {
      title: '3D & Visualisation',
      body: 'At our core are 3D visualisations designed to preserve culture, architecture and objects, make them understandable and think them forward through digital processing.',
      body2: 'Historic places, destroyed or altered spaces and cultural objects are made digitally comprehensible so they stay accessible for the present and the future. We understand reconstruction not as mere depiction, but as an interpretive process between history, knowledge and perspective — including cultural points of view.',
      body3: 'This creates a space for cultural exchange in which different perspectives become visible and new approaches to a shared understanding of history and the present emerge.',
      cta: 'Enquiry: 3D',
    },
    langzeit: {
      title: 'Long-Term & Futuring Design',
      body: 'Strategic perspectives geared not towards short-term results, but towards long-term cultural and societal development.',
      body2: 'Future thinking helps to put the present into relation and to understand decisions in the context of possible futures. The future is understood as a shapeable space of possibility: conscious long-term thinking creates systems that give orientation, enable change and foster positive developments.',
      body3: 'This produces approaches that create stability without slowing change down — and actively help shape the future as an opportunity.',
      cta: 'Enquiry: Long View',
    },
  },
}

export function useServiceText(): Record<ServiceId, ServiceText> {
  const { lang } = useLang()
  return SERVICES[lang]
}

// ─── Portfolio projects — id-keyed (incl. ReactNode bodies & sources) ───────

export type ProjectId = 'langzeitdesign' | 'sophienkirche' | 'zeitpyramide' | 'vrlab' | 'p5'
type ProjectText = {
  label: string
  title: string
  subtitle: string
  textA: string
  textB?: string
  textC?: ReactNode
  textD?: ReactNode
  linkLabel?: string
  downloadLabel?: string
  button?: string
  source?: ReactNode
}

const PROJECTS: Record<Lang, Record<ProjectId, ProjectText>> = {
  de: {
    langzeitdesign: {
      label: 'Langzeit-Design',
      title: 'Langzeit-Design: Herrnhuter Galaxie',
      subtitle: 'Forschung / Workshops & pragmatische Umsetzung',
      textA: 'Wir leben in einer Zeitwahrnehmungskrise: Quartalsgewinne, Wahlzyklen und sofortige Befriedigung verengen unseren Horizont. Wir kolonisieren die Zukunft, indem wir ökologische und technologische Schulden an Generationen ohne Mitspracherecht abtreten — und verlieren die positiven Zukunftsbilder, ohne die keine Zivilisation Bestand hat. Langzeitdesign ist die Antwort: eine Disziplin und Dienstleistung, die Institutionen und Projekten hilft, langfristiges Denken erfahrbar und über Generationen kommunizierbar zu machen.',
      textB: 'Langzeitdesign entwickelt Werkzeuge und Plattformen, die ferne Zukünfte im Rahmen menschlicher Tiefenzeit antizipierbar machen, erzeugt Zuversicht und stärkt die Verantwortung gegenüber denen, die nach uns kommen — für sie zu entwerfen heißt, ein guter Vorfahre zu sein. Es entstehen keine statischen Produkte, sondern resiliente Systeme: Eine duale Architektur trennt einen zeitstabilen Kern aus Werten und Ritualen von einer flexiblen Schnittstelle aus Technologie und Ästhetik — so bleibt ein Projekt anpassungsfähig, ohne seine Identität zu verlieren. Statt fertiger Baupläne entstehen Heuristiken: ein offenes Skript, das jede Generation dort weiterschreibt, wo die vorige aufhörte. Anders als Langzeitkunst — subjektiv und elitär — ist es pragmatisch, partizipativ und demokratisch zugänglich: kein blinder Optimismus, sondern Zuversicht gegenüber unsicheren Zukünften.',
      textC: 'Wie das in der Praxis aussieht, zeigt die Herrnhuter Galaxie, ein 1100-jähriges partizipatives Projekt zur sächsischen Landesausstellung 2029: ein Ritual, ein Stern, jede Generation. Der Herrnhuter Stern wird zum Taktgeber eines kosmologischen Kalenders — in der längsten Nacht des Jahres knüpft jede Generation eine neue Zacke an, bis aus einzelnen Sternen über die Jahrhunderte eine ganze Galaxie wächst. Eine analoge Kette macht die Weitergabe taktil, ein digitales XR-Observatorium lässt Menschen ihre Vision von Sachsens ferner Zukunft erschaffen. Entscheidend ist das Verhältnis von Design und Kunst: Langzeitkunst ruft die Emotion hervor, die tiefes Zukunftsdenken erst eröffnet — Langzeitdesign verstärkt ihre Wirkung, macht das Erlebnis zugänglich und alltagstauglich und sichert die Kontinuität, die ein Kunstwerk allein nicht trägt. Kunst liefert den Funken, Design die Infrastruktur.',
      textD: <Em>Damit ein Vorhaben Generationen überdauert, braucht es tragfähige Strukturen: ein Hybridmodell aus kultureller Agentur, Stiftungswesen und Ritualisierung, das Förderzyklen und politische Umbrüche übersteht. Die eigentliche Resilienz aber stiftet das Ritual — denn was Bestand hatte, besteht weiter. So wird Langzeitdesign, was es sein will: kein Service fürs nächste Quartal, sondern ein Beitrag zum kulturellen Erbe der nächsten Jahrhunderte.</Em>,
      linkLabel: 'Prototyp Herrnhuter Galaxie',
      downloadLabel: 'Download PDF zu LTD',
      button: 'Vortrag',
      source: (
        <>
          Vielen Dank an die Organisation der Landesausstellung 2029 in Sachsen ({srcLink('https://www.schloesserland-sachsen.de/de/news-presse/pressemitteilungen/?tx_news_pi1%5Bnews%5D=1676&tx_news_pi1%5Bcontroller%5D=News&tx_news_pi1%5Baction%5D=detail&cHash=042ed97d0870c8f4886f5540037a8447', 'Schlösserland Sachsen')}) und die Herrnhuter Brüdergemeinde
        </>
      ),
    },
    sophienkirche: {
      label: 'Sophienkirche',
      title: 'Denkraum Sophienkirche',
      subtitle: 'Immersives Prototyping als virtuelles Erinnerungsmedium',
      textA: 'Mitten in Dresden, unweit des Zwingers, erinnert der DenkRaum Sophienkirche an einen verschwundenen Ort. Die Sophienkirche — einst Franziskanerklosterkirche, später evangelische Hof- und Domkirche und lange die einzige gotisch erhaltene Kirche der Stadt — wurde 1945 zur Ruine und 1962/63 trotz Protesten abgerissen. An ihrer Stelle steht heute die Busmannkapelle: ein Ort des kollektiven Gedächtnisses — und zugleich spürbaren Identitätsverlusts.',
      textB: 'Genau hier setzt das Projekt an: die unsichtbare Kirche wieder sichtbar zu machen. Über Extended Reality wird die zerstörte Sophienkirche am echten Standort erlebbar — die Erinnerung gegen Zeit und Realität verteidigt, auch für kommende Generationen. Denn das Fortbestehen des Gedenkens ist selbst ein digitales Langzeitprojekt.',
      textC: 'Der Prototyp erprobt gezielt Gamification an einem Kulturort, um Geschichte engaging und zielgruppenorientierter zu vermitteln — für jüngere Besucher, Schulen und Stadtrundgänge. Als gespielte Zeitreise durch die Stockwerke der Geschichte erzählen historische Figuren von ihren Grabsteinen, laden über kleine Quests zur Bindung ein; der Verlust der Kirche wird spürbar, bis aktives Handeln sie wieder über dem realen Ort erstehen lässt. Das Finale fragt „Was bleibt?“ und überführt die Erinnerung in ein immersives Gästebuch — ein wachsendes Zukunftsarchiv.',
      textD: 'Entscheidend ist die Rolle des Designs: Es tritt nicht an die Stelle des Ortes, sondern verstärkt seine Wirkung — es übersetzt kuratierte, geprüfte Inhalte in ein zugängliches, spielerisches Erlebnis. Technisch bleibt die Lösung niederschwellig: smartphone-basierte AR, offen für weitere Erinnerungsorte in Dresden. So wird aus Verlust eine digitale Auferstehung — getragen von Erinnerungskultur, Technologie und Langzeitperspektive. Am Ende steht ein einfacher Gedanke: Ich will nicht vergessen werden.',
      linkLabel: 'Webseite Sophienkirche',
      button: 'Prototyp',
      source: (
        <>
          Vielen Dank an Christian Curschmann · Kooperation mit {srcLink('https://buergerstiftung-dresden.de/', 'Bürgerstiftung Dresden')}
        </>
      ),
    },
    zeitpyramide: {
      label: 'Zeitpyramide',
      title: 'Die Wemdinger Zeitpyramide',
      subtitle: 'Langzeitkunstprojekt & AR-Visualisierung',
      textA: 'Mitten im Nördlinger Ries, in der bayerischen Kleinstadt Wemding, entsteht eines der ersten Langzeitkunstprojekte überhaupt: die Zeitpyramide. Zum 1200-jährigen Stadtjubiläum 1993 vom Künstler Manfred Laber als Geschenk an die Stadt konzipiert, wächst sie über exakt 1200 Jahre — alle zehn Jahre wird ein Betonstein gesetzt, bis das Bauwerk 3183 aus 120 Steinen vollendet ist. Als Werk der konkreten Kunst ist sie kein statisches Monument, sondern ein bewusst entschleunigter Prozess: Der Beton nimmt mit der Zeit Patina und Risse an und macht so Vergänglichkeit und den langen Atem der Zeit sichtbar — ein Denkmal für die Langsamkeit, dessen Vollendung niemand erlebt, der heute lebt.',
      textB: 'Das Problem jeder Langzeitkunst ist ihre Abstraktion: Vier Steine auf einer Wiese lassen sich kaum als künftige Pyramide lesen. Eine UAV-Photogrammetrie-Visualisierung setzt hier an — per Drohne erfasste Aufnahmen werden zu einem präzisen digitalen Modell des realen Standorts zusammengeführt, in das sich der vollständige Bau einrechnen lässt. So wird die ferne Endgestalt aus dem heutigen Bestand heraus greifbar und an den tatsächlichen Ort rückgebunden.',
      textC: 'Daran knüpft eine AR-Visualisierung an, die wie ein Fenster in eine spekulative Zukunft funktioniert: Über das Smartphone erscheinen die noch ausstehenden Steine direkt vor Ort, bis die fertige Pyramide über der realen Landschaft steht. Dass dies mehr ist als ein Effekt, stützt eine Umfrage in der Region: Wer die Zeitpyramide positiv bewertet, glaubt zugleich signifikant häufiger an weitere 1200 Jahre Wemding und blickt optimistischer in die Zukunft — Langzeitprojekte wirken so als soziale Katalysatoren für Zukunftsvertrauen. Genau diese Wirkung verstärkt die Visualisierung: Indem sie die ferne Vollendung sinnlich erfahrbar macht, hilft sie den Wemdingern, sich eine Zukunft in 1200 Jahren tatsächlich vorzustellen — und stärkt die Zuversicht, die jedes Langzeitprojekt trägt. Dabei arbeiten wir eng mit der Stiftung Wemdinger Zeitpyramide zusammen, um die Pyramide zu ermöglichen, ihre Aufgaben und Projekte zu unterstützen und ihre Vollendung zu befördern — und ihr die Präsentation, Wirksamkeit und kommunikative Strahlkraft zu verleihen, die ihr gebührt.',
      linkLabel: 'Webseite der Zeitpyramiden Stiftung',
      button: 'Visualisierung',
      source: (
        <>
          Die {srcLink('https://www.donau-ries-aktuell.de/kultur/virtuelle-reise-durch-die-zeitpyramide-der-zukunft-wemding-81669', 'AR-Visualisierung')} ist an der Zeitpyramide einzusehen, die WebXR-Anwendung wird gefördert vom
          {fffLogo}
        </>
      ),
    },
    vrlab: {
      label: 'VRlab',
      title: 'VRlab',
      subtitle: 'VR-Entwicklung für das Deutsche Museum',
      textA: 'Im XR Hub des Deutschen Museums wurde eine bestehende VR Experience weiterentwickelt, um historische Inhalte durch immersive Erlebnisse zugänglicher und interaktiver zu gestalten. Dabei stand die Verbindung von User Experience, Storytelling und historischer Einordnung im Mittelpunkt.',
      textB: 'Aus der virtuellen Betrachtung bedeutender Exponate wie dem Benz Patent-Motorwagen, Otto Lilienthals Flugapparat, der Sulzer Dampfmaschine oder der Apollo-13-Mission entsteht eine Erfahrung, in der Besucher aktiv in vergangene Momente eintauchen können. Ob beim Zusammenbau des Motors gemeinsam mit Bertha Benz vor ihrer ersten längeren Testfahrt oder als Reporter einer Berliner Tageszeitung beim Start zu Otto Lilienthals nächstem Flug – die Besucher werden Teil historischer Ereignisse und erleben technische Meilensteine aus einer neuen Perspektive.',
      textC: <Em>Der XR Raum schafft so eine Brücke zwischen Museum, Technologie und interaktivem Lernen – Geschichte wird nicht nur betrachtet, sondern erlebbar gemacht.</Em>,
      linkLabel: 'VRlab am Deutschen Museum',
      button: 'VR-Experience',
      source: 'Bilder: Deutsches Museum · Forum der Zukunft, 2022',
    },
    p5: {
      label: 'Kommerz & Kultur',
      title: 'Kommerz und Kulturkapital pragmatisch bündeln',
      subtitle: 'Abgeschlossene Web- & Agenturprojekte & Kooperationen',
      textA: 'Kommerz und Kultur sind für uns kein Gegensatz, sondern Hebel füreinander. Das kurzfristige, lukrative Tagesgeschäft – in Commerce, Fashion, Lifestyle – schafft die Mittel und die Reichweite, aus denen langfristiges Kulturkapital wächst. Digitale Wirkung entsteht dabei nicht durch sichtbare Ergebnisse allein, sondern durch das, was trägt: verlässliche Systeme, stabile Infrastruktur und die Verbindung aus Technologie, Menschen und Kultur.',
      textB: 'Den Rahmen dafür liefert Stewart Brands Pace Layering: Wer die langsamen, bewahrenden Schichten der Kultur gestalten will, muss in den schnellen Schichten präsent sein. So denken wir in langen Zeithorizonten – und handeln trotzdem im Jetzt. Das schnelle Geschäft ist kein Widerspruch zum Langzeitanspruch, sondern seine Voraussetzung. Wer sich der Kultur bedient, gibt zurück.',
      textC: 'Deshalb arbeiten wir ohne Hierarchie: Familienunternehmen und Kulturinstitution, Subkultur und Hochkultur, Verein und Alltagskultur. Die folgenden Referenzen sind abgeschlossene Web- und Agenturprojekte sowie ehemalige Kooperationen – pragmatisch, ethisch, auf Wirkung ausgerichtet.',
      linkLabel: 'Pace Layering – Long Now Foundation',
      button: 'Websites',
      source: 'Hintergrundbild & Idee: Long Now Foundation · Pace Layering (Stewart Brand)',
    },
  },
  en: {
    langzeitdesign: {
      label: 'Long-Term Design',
      title: 'Long-Term Design: Herrnhut Galaxy',
      subtitle: 'Research / workshops & pragmatic implementation',
      textA: 'We live in a crisis of how we perceive time: quarterly profits, election cycles and instant gratification narrow our horizon. We colonise the future by passing ecological and technological debts on to generations who have no say — and we lose the positive images of the future without which no civilisation endures. Long-term design is the answer: a discipline and a service that helps institutions and projects make long-term thinking tangible and communicable across generations.',
      textB: 'Long-term design develops tools and platforms that make distant futures anticipable within the frame of human deep time, generates confidence and strengthens responsibility towards those who come after us — to design for them is to be a good ancestor. It produces not static products but resilient systems: a dual architecture separates a time-stable core of values and rituals from a flexible interface of technology and aesthetics — so a project stays adaptable without losing its identity. Instead of finished blueprints, heuristics emerge: an open script that each generation continues where the previous one left off. Unlike long-term art — subjective and elitist — it is pragmatic, participatory and democratically accessible: not blind optimism, but confidence in the face of uncertain futures.',
      textC: 'What this looks like in practice is shown by the Herrnhut Galaxy, an 1,100-year participatory project for the Saxon State Exhibition 2029: one ritual, one star, every generation. The Herrnhut star becomes the metronome of a cosmological calendar — on the longest night of the year, each generation adds a new point, until over the centuries single stars grow into an entire galaxy. An analogue chain makes the handover tactile; a digital XR observatory lets people create their vision of Saxony’s distant future. What matters is the relationship between design and art: long-term art evokes the emotion that deep future thinking first opens up — long-term design amplifies its effect, makes the experience accessible and everyday-suitable and secures the continuity that an artwork alone cannot carry. Art provides the spark, design the infrastructure.',
      textD: <Em>For an undertaking to outlast generations, it needs robust structures: a hybrid model of cultural agency, foundation governance and ritualisation that survives funding cycles and political upheavals. But the real resilience comes from the ritual — for what has endured, endures on. This is how long-term design becomes what it wants to be: not a service for the next quarter, but a contribution to the cultural heritage of the centuries to come.</Em>,
      linkLabel: 'Prototype Herrnhut Galaxy',
      downloadLabel: 'Download PDF on LTD',
      button: 'Talk',
      source: (
        <>
          Many thanks to the organisers of the Saxon State Exhibition 2029 ({srcLink('https://www.schloesserland-sachsen.de/de/news-presse/pressemitteilungen/?tx_news_pi1%5Bnews%5D=1676&tx_news_pi1%5Bcontroller%5D=News&tx_news_pi1%5Baction%5D=detail&cHash=042ed97d0870c8f4886f5540037a8447', 'Schlösserland Sachsen')}) and the Herrnhut Moravian Church
        </>
      ),
    },
    sophienkirche: {
      label: 'Sophienkirche',
      title: 'Denkraum Sophienkirche',
      subtitle: 'Immersive prototyping as a virtual medium of remembrance',
      textA: 'In the heart of Dresden, not far from the Zwinger, the DenkRaum Sophienkirche commemorates a place that has vanished. The Sophienkirche — once a Franciscan monastery church, later a Protestant court and cathedral church and for a long time the city’s only church preserved in the Gothic style — was reduced to ruins in 1945 and demolished in 1962/63 despite protests. In its place stands the Busmann Chapel today: a place of collective memory — and at the same time of palpable loss of identity.',
      textB: 'This is exactly where the project comes in: making the invisible church visible again. Through extended reality, the destroyed Sophienkirche becomes experienceable at its real location — memory defended against time and reality, for generations to come as well. For the survival of remembrance is itself a digital long-term project.',
      textC: 'The prototype deliberately tests gamification at a cultural site to convey history more engagingly and in a more target-group-oriented way — for younger visitors, schools and city tours. As a playable journey through the storeys of history, historical figures speak from their gravestones and invite engagement through small quests; the loss of the church becomes palpable until active deeds let it rise again above the real site. The finale asks “What remains?” and transfers the memory into an immersive guest book — a growing archive of the future.',
      textD: 'What is decisive is the role of design: it does not take the place of the site, but amplifies its effect — it translates curated, vetted content into an accessible, playful experience. Technically, the solution stays low-threshold: smartphone-based AR, open to further sites of remembrance in Dresden. So loss becomes a digital resurrection — carried by a culture of remembrance, technology and a long-term perspective. In the end there is a simple thought: I don’t want to be forgotten.',
      linkLabel: 'Sophienkirche website',
      button: 'Prototype',
      source: (
        <>
          Many thanks to Christian Curschmann · in cooperation with {srcLink('https://buergerstiftung-dresden.de/', 'Bürgerstiftung Dresden')}
        </>
      ),
    },
    zeitpyramide: {
      label: 'Time Pyramid',
      title: 'The Wemding Time Pyramid',
      subtitle: 'Long-term art project & AR visualisation',
      textA: 'In the middle of the Nördlinger Ries, in the small Bavarian town of Wemding, one of the very first long-term art projects is taking shape: the Time Pyramid. Conceived by the artist Manfred Laber in 1993 as a gift to the town for its 1,200-year anniversary, it grows over exactly 1,200 years — every ten years a concrete block is set, until in 3183 the structure is completed from 120 blocks. As a work of concrete art, it is not a static monument but a deliberately decelerated process: over time the concrete takes on patina and cracks, making transience and the long breath of time visible — a monument to slowness whose completion no one alive today will witness.',
      textB: 'The problem with any long-term art is its abstraction: four blocks in a meadow can hardly be read as a future pyramid. A UAV photogrammetry visualisation steps in here — drone-captured footage is merged into a precise digital model of the real site, into which the complete structure can be computed. This makes the distant final form tangible out of today’s state and ties it back to the actual place.',
      textC: 'An AR visualisation builds on this, working like a window into a speculative future: through the smartphone, the blocks still to come appear right on site, until the finished pyramid stands over the real landscape. That this is more than an effect is supported by a regional survey: those who rate the Time Pyramid positively are at the same time significantly more likely to believe in another 1,200 years of Wemding and look more optimistically into the future — long-term projects thus act as social catalysts for confidence in the future. The visualisation reinforces exactly this effect: by making the distant completion sensually experienceable, it helps the people of Wemding actually imagine a future in 1,200 years — and strengthens the confidence every long-term project carries. We work closely with the Wemding Time Pyramid Foundation to make the pyramid possible, support its tasks and projects and advance its completion — and to give it the presentation, impact and communicative radiance it deserves.',
      linkLabel: 'Website of the Time Pyramid Foundation',
      button: 'Visualisation',
      source: (
        <>
          The {srcLink('https://www.donau-ries-aktuell.de/kultur/virtuelle-reise-durch-die-zeitpyramide-der-zukunft-wemding-81669', 'AR visualisation')} can be viewed at the Time Pyramid; the WebXR application is funded by
          {fffLogo}
        </>
      ),
    },
    vrlab: {
      label: 'VRlab',
      title: 'VRlab',
      subtitle: 'VR development for the Deutsches Museum',
      textA: 'In the XR Hub of the Deutsches Museum, an existing VR experience was further developed to make historical content more accessible and interactive through immersive experiences. The focus was on connecting user experience, storytelling and historical contextualisation.',
      textB: 'From the virtual viewing of significant exhibits such as the Benz Patent-Motorwagen, Otto Lilienthal’s flying apparatus, the Sulzer steam engine or the Apollo 13 mission, an experience emerges in which visitors can actively immerse themselves in past moments. Whether assembling the engine together with Bertha Benz before her first longer test drive, or reporting for a Berlin daily newspaper at the launch of Otto Lilienthal’s next flight — visitors become part of historical events and experience technical milestones from a new perspective.',
      textC: <Em>The XR space thus creates a bridge between museum, technology and interactive learning – history is not just observed, but made experienceable.</Em>,
      linkLabel: 'VRlab at the Deutsches Museum',
      button: 'VR Experience',
      source: 'Images: Deutsches Museum · Forum der Zukunft, 2022',
    },
    p5: {
      label: 'Commerce & Culture',
      title: 'Bundling commerce and cultural capital pragmatically',
      subtitle: 'Completed web & agency projects & collaborations',
      textA: 'For us, commerce and culture are not opposites, but levers for one another. The short-term, lucrative day-to-day business – in commerce, fashion, lifestyle – creates the means and the reach from which long-term cultural capital grows. Digital impact arises not from visible results alone, but from what carries: reliable systems, stable infrastructure and the connection of technology, people and culture.',
      textB: 'The framework for this is Stewart Brand’s pace layering: those who want to shape the slow, preserving layers of culture must be present in the fast layers. So we think in long time horizons – and still act in the now. The fast business is not a contradiction to the long-term aspiration, but its precondition. Those who draw on culture give back.',
      textC: 'That’s why we work without hierarchy: family business and cultural institution, subculture and high culture, association and everyday culture. The following references are completed web and agency projects as well as former collaborations – pragmatic, ethical, geared towards impact.',
      linkLabel: 'Pace Layering – Long Now Foundation',
      button: 'Websites',
      source: 'Background image & idea: Long Now Foundation · Pace Layering (Stewart Brand)',
    },
  },
}

export function useProjectText(): Record<ProjectId, ProjectText> {
  const { lang } = useLang()
  return PROJECTS[lang]
}
