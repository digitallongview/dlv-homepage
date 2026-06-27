import { useState, useRef, useEffect, type ReactNode } from 'react'
import SectionHeading from '../SectionHeading'
import VrGlasses from '../VrGlasses'
import PcWebsites from '../PcWebsites'
import { useHlsVideo } from '../../hooks/useHlsVideo'
import { HLS, type Lang } from '../../lib/hlsSources'

// ─── Types & Data ─────────────────────────────────────────────────────────────

type ProjectId = 'langzeitdesign' | 'sophienkirche' | 'zeitpyramide' | 'vrlab' | 'p5'

const NAV_ITEMS: { id: ProjectId; label: string }[] = [
  { id: 'langzeitdesign', label: 'Langzeit-Design' },
  { id: 'sophienkirche',  label: 'Sophienkirche'   },
  { id: 'zeitpyramide',  label: 'Zeitpyramide'    },
  { id: 'vrlab',         label: 'VRlab'            },
  { id: 'p5',            label: 'Kommerz & Kultur' },
]

const BG_MAP: Record<ProjectId, string> = {
  langzeitdesign: '/assets/bg-langzeitdesign.webp',
  sophienkirche:  '/assets/bg-sophienkirche-altar.webp',
  zeitpyramide:   '/assets/bg-zeitpyramide.webp',
  vrlab:          '/assets/background-vrlab.webp',
  p5:             '/assets/pacelayer.webp',
}

// Crop anchor per slide (object-position). Most photos centre fine; a few need a
// nudge so their subject survives the full-bleed object-cover crop.
//   · vrlab        — pan right so Lilienthal's glider stays in frame.
//   · sophienkirche — portrait photo in a wide frame: bias toward the upper band so
//                     the gothic window arches + sky read behind the phone.
const BG_POSITION: Partial<Record<ProjectId, string>> = {
  vrlab:         '62% center',
  sophienkirche: '50% 32%',
}

// Directional cream scrim per slide. Strong on the left where the nav + copy sit,
// clearing toward the right so the photo keeps colour around the media. The three
// text-heavy slides (Langzeit-Design, Sophienkirche, Zeitpyramide) hold more cream
// across the width so copy that now reaches the right edge stays legible.
const SCRIM_MAP: Record<ProjectId, string> = {
  // Lange Copy bis in die rechte Spalte → Creme trägt über die ganze Breite.
  langzeitdesign: 'linear-gradient(to right, rgba(247,236,237,0.95) 0%, rgba(247,236,237,0.90) 42%, rgba(247,236,237,0.76) 72%, rgba(247,236,237,0.60) 100%)',
  // Textspalte links + helles Altar-Foto rechts → links sehr stark, hinter dem Phone klarer.
  sophienkirche:  'linear-gradient(to right, rgba(247,236,237,0.96) 0%, rgba(247,236,237,0.92) 48%, rgba(247,236,237,0.64) 80%, rgba(247,236,237,0.36) 100%)',
  // Zwei vollbreite Absätze über dem Foto → rechte Seite lesbar halten.
  zeitpyramide:   'linear-gradient(to right, rgba(247,236,237,0.95) 0%, rgba(247,236,237,0.90) 42%, rgba(247,236,237,0.76) 72%, rgba(247,236,237,0.60) 100%)',
  // Render/Foto ohne Text rechts → Motiv behält rechts seine Farbe.
  vrlab:          'linear-gradient(to right, rgba(247,236,237,0.95) 0%, rgba(247,236,237,0.88) 45%, rgba(247,236,237,0.72) 72%, rgba(247,236,237,0.66) 100%)',
  p5:             'linear-gradient(to right, rgba(247,236,237,0.95) 0%, rgba(247,236,237,0.88) 45%, rgba(247,236,237,0.72) 72%, rgba(247,236,237,0.66) 100%)',
}

type ProjectData = {
  title:      string
  subtitle:   string
  textA:      string
  textB?:     string
  textC?:     ReactNode
  textD?:     ReactNode
  twoColText: boolean
  link?:      { href: string; label: string; external?: boolean }
  download?:  { href: string; label: string }
  source?:    ReactNode
}

const PROJECTS: Record<ProjectId, ProjectData> = {
  langzeitdesign: {
    title:      'Langzeit-Design: Herrnhuter Galaxie',
    subtitle:   'Forschung / Workshops & pragmatische Umsetzung',
    textA:      'Wir leben in einer Zeitwahrnehmungskrise: Quartalsgewinne, Wahlzyklen und sofortige Befriedigung verengen unseren Horizont. Wir kolonisieren die Zukunft, indem wir ökologische und technologische Schulden an Generationen ohne Mitspracherecht abtreten — und verlieren die positiven Zukunftsbilder, ohne die keine Zivilisation Bestand hat. Langzeitdesign ist die Antwort: eine Disziplin und Dienstleistung, die Institutionen und Projekten hilft, langfristiges Denken erfahrbar und über Generationen kommunizierbar zu machen.',
    textB:      'Langzeitdesign entwickelt Werkzeuge und Plattformen, die ferne Zukünfte im Rahmen menschlicher Tiefenzeit antizipierbar machen, erzeugt Zuversicht und stärkt die Verantwortung gegenüber denen, die nach uns kommen — für sie zu entwerfen heißt, ein guter Vorfahre zu sein. Es entstehen keine statischen Produkte, sondern resiliente Systeme: Eine duale Architektur trennt einen zeitstabilen Kern aus Werten und Ritualen von einer flexiblen Schnittstelle aus Technologie und Ästhetik — so bleibt ein Projekt anpassungsfähig, ohne seine Identität zu verlieren. Statt fertiger Baupläne entstehen Heuristiken: ein offenes Skript, das jede Generation dort weiterschreibt, wo die vorige aufhörte. Anders als Langzeitkunst — subjektiv und elitär — ist es pragmatisch, partizipativ und demokratisch zugänglich: kein blinder Optimismus, sondern Zuversicht gegenüber unsicheren Zukünften.',
    textC:      'Wie das in der Praxis aussieht, zeigt die Herrnhuter Galaxie, ein 1100-jähriges partizipatives Projekt zur sächsischen Landesausstellung 2029: ein Ritual, ein Stern, jede Generation. Der Herrnhuter Stern wird zum Taktgeber eines kosmologischen Kalenders — in der längsten Nacht des Jahres knüpft jede Generation eine neue Zacke an, bis aus einzelnen Sternen über die Jahrhunderte eine ganze Galaxie wächst. Eine analoge Kette macht die Weitergabe taktil, ein digitales XR-Observatorium lässt Menschen ihre Vision von Sachsens ferner Zukunft erschaffen. Entscheidend ist das Verhältnis von Design und Kunst: Langzeitkunst ruft die Emotion hervor, die tiefes Zukunftsdenken erst eröffnet — Langzeitdesign verstärkt ihre Wirkung, macht das Erlebnis zugänglich und alltagstauglich und sichert die Kontinuität, die ein Kunstwerk allein nicht trägt. Kunst liefert den Funken, Design die Infrastruktur.',
    textD:      <strong className="font-normal italic">Damit ein Vorhaben Generationen überdauert, braucht es tragfähige Strukturen: ein Hybridmodell aus kultureller Agentur, Stiftungswesen und Ritualisierung, das Förderzyklen und politische Umbrüche übersteht. Die eigentliche Resilienz aber stiftet das Ritual — denn was Bestand hatte, besteht weiter. So wird Langzeitdesign, was es sein will: kein Service fürs nächste Quartal, sondern ein Beitrag zum kulturellen Erbe der nächsten Jahrhunderte.</strong>,
    twoColText: false,
    link:       { href: 'https://herrnhuter.digitallongview.com/', label: 'Prototyp Herrnhuter Galaxie', external: true },
    download:   { href: '/assets/Was ist Langzeitdesign.pdf', label: 'Download PDF zu LTD' },
    source:     (
      <>
        Vielen Dank an die Organisation der Landesausstellung 2029 in Sachsen (
        <a
          href="https://www.schloesserland-sachsen.de/de/news-presse/pressemitteilungen/?tx_news_pi1%5Bnews%5D=1676&tx_news_pi1%5Bcontroller%5D=News&tx_news_pi1%5Baction%5D=detail&cHash=042ed97d0870c8f4886f5540037a8447"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 transition-colors hover:text-ink/60"
        >
          Schlösserland Sachsen
        </a>
        ) und die Herrnhuter Brüdergemeinde
      </>
    ),
  },
  sophienkirche: {
    title:      'Denkraum Sophienkirche',
    subtitle:   'Immersives Prototyping als virtuelles Erinnerungsmedium',
    textA:      'Mitten in Dresden, unweit des Zwingers, erinnert der DenkRaum Sophienkirche an einen verschwundenen Ort. Die Sophienkirche — einst Franziskanerklosterkirche, später evangelische Hof- und Domkirche und lange die einzige gotisch erhaltene Kirche der Stadt — wurde 1945 zur Ruine und 1962/63 trotz Protesten abgerissen. An ihrer Stelle steht heute die Busmannkapelle: ein Ort des kollektiven Gedächtnisses — und zugleich spürbaren Identitätsverlusts.',
    textB:      'Genau hier setzt das Projekt an: die unsichtbare Kirche wieder sichtbar zu machen. Über Extended Reality wird die zerstörte Sophienkirche am echten Standort erlebbar — die Erinnerung gegen Zeit und Realität verteidigt, auch für kommende Generationen. Denn das Fortbestehen des Gedenkens ist selbst ein digitales Langzeitprojekt.',
    textC:      'Der Prototyp erprobt gezielt Gamification an einem Kulturort, um Geschichte engaging und zielgruppenorientierter zu vermitteln — für jüngere Besucher, Schulen und Stadtrundgänge. Als gespielte Zeitreise durch die Stockwerke der Geschichte erzählen historische Figuren von ihren Grabsteinen, laden über kleine Quests zur Bindung ein; der Verlust der Kirche wird spürbar, bis aktives Handeln sie wieder über dem realen Ort erstehen lässt. Das Finale fragt „Was bleibt?“ und überführt die Erinnerung in ein immersives Gästebuch — ein wachsendes Zukunftsarchiv.',
    textD:      'Entscheidend ist die Rolle des Designs: Es tritt nicht an die Stelle des Ortes, sondern verstärkt seine Wirkung — es übersetzt kuratierte, geprüfte Inhalte in ein zugängliches, spielerisches Erlebnis. Technisch bleibt die Lösung niederschwellig: smartphone-basierte AR, offen für weitere Erinnerungsorte in Dresden. So wird aus Verlust eine digitale Auferstehung — getragen von Erinnerungskultur, Technologie und Langzeitperspektive. Am Ende steht ein einfacher Gedanke: Ich will nicht vergessen werden.',
    twoColText:      false,
    link:       { href: 'https://www.denkraum-sophienkirche.de/', label: 'Webseite Sophienkirche', external: true },
    source:     (
      <>
        Vielen Dank an Christian Curschmann · Kooperation mit{' '}
        <a
          href="https://buergerstiftung-dresden.de/"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 transition-colors hover:text-ink/60"
        >
          Bürgerstiftung Dresden
        </a>
      </>
    ),
  },
  zeitpyramide: {
    title:      'Die Wemdinger Zeitpyramide',
    subtitle:   'Langzeitkunstprojekt & AR-Visualisierung',
    textA:      'Mitten im Nördlinger Ries, in der bayerischen Kleinstadt Wemding, entsteht eines der ersten Langzeitkunstprojekte überhaupt: die Zeitpyramide. Zum 1200-jährigen Stadtjubiläum 1993 vom Künstler Manfred Laber als Geschenk an die Stadt konzipiert, wächst sie über exakt 1200 Jahre — alle zehn Jahre wird ein Betonstein gesetzt, bis das Bauwerk 3183 aus 120 Steinen vollendet ist. Als Werk der konkreten Kunst ist sie kein statisches Monument, sondern ein bewusst entschleunigter Prozess: Der Beton nimmt mit der Zeit Patina und Risse an und macht so Vergänglichkeit und den langen Atem der Zeit sichtbar — ein Denkmal für die Langsamkeit, dessen Vollendung niemand erlebt, der heute lebt.',
    textB:      'Das Problem jeder Langzeitkunst ist ihre Abstraktion: Vier Steine auf einer Wiese lassen sich kaum als künftige Pyramide lesen. Eine UAV-Photogrammetrie-Visualisierung setzt hier an — per Drohne erfasste Aufnahmen werden zu einem präzisen digitalen Modell des realen Standorts zusammengeführt, in das sich der vollständige Bau einrechnen lässt. So wird die ferne Endgestalt aus dem heutigen Bestand heraus greifbar und an den tatsächlichen Ort rückgebunden.',
    textC:      'Daran knüpft eine AR-Visualisierung an, die wie ein Fenster in eine spekulative Zukunft funktioniert: Über das Smartphone erscheinen die noch ausstehenden Steine direkt vor Ort, bis die fertige Pyramide über der realen Landschaft steht. Dass dies mehr ist als ein Effekt, stützt eine Umfrage in der Region: Wer die Zeitpyramide positiv bewertet, glaubt zugleich signifikant häufiger an weitere 1200 Jahre Wemding und blickt optimistischer in die Zukunft — Langzeitprojekte wirken so als soziale Katalysatoren für Zukunftsvertrauen. Genau diese Wirkung verstärkt die Visualisierung: Indem sie die ferne Vollendung sinnlich erfahrbar macht, hilft sie den Wemdingern, sich eine Zukunft in 1200 Jahren tatsächlich vorzustellen — und stärkt die Zuversicht, die jedes Langzeitprojekt trägt. Dabei arbeiten wir eng mit der Stiftung Wemdinger Zeitpyramide zusammen, um die Pyramide zu ermöglichen, ihre Aufgaben und Projekte zu unterstützen und ihre Vollendung zu befördern — und ihr die Präsentation, Wirksamkeit und kommunikative Strahlkraft zu verleihen, die ihr gebührt.',
    twoColText: false,
    link:       { href: 'https://zeitpyramide.de', label: 'Webseite Stiftung', external: true },
    source:     (
      <>
        Die{' '}
        <a
          href="https://www.donau-ries-aktuell.de/kultur/virtuelle-reise-durch-die-zeitpyramide-der-zukunft-wemding-81669"
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 transition-colors hover:text-ink/60"
        >
          AR-Visualisierung
        </a>{' '}
        ist an der Zeitpyramide einzusehen, die WebXR-Anwendung wird gefördert vom
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
      </>
    ),
  },
  vrlab: {
    title:      'VRlab',
    subtitle:   'VR-Entwicklung für das Deutsche Museum',
    textA:      'Im XR Hub des Deutschen Museums wurde eine bestehende VR Experience weiterentwickelt, um historische Inhalte durch immersive Erlebnisse zugänglicher und interaktiver zu gestalten. Dabei stand die Verbindung von User Experience, Storytelling und historischer Einordnung im Mittelpunkt.',
    textB:      'Aus der virtuellen Betrachtung bedeutender Exponate wie dem Benz Patent-Motorwagen, Otto Lilienthals Flugapparat, der Sulzer Dampfmaschine oder der Apollo-13-Mission entsteht eine Erfahrung, in der Besucher aktiv in vergangene Momente eintauchen können. Ob beim Zusammenbau des Motors gemeinsam mit Bertha Benz vor ihrer ersten längeren Testfahrt oder als Reporter einer Berliner Tageszeitung beim Start zu Otto Lilienthals nächstem Flug – die Besucher werden Teil historischer Ereignisse und erleben technische Meilensteine aus einer neuen Perspektive.',
    textC:      <strong className="font-normal italic">Der XR Raum schafft so eine Brücke zwischen Museum, Technologie und interaktivem Lernen – Geschichte wird nicht nur betrachtet, sondern erlebbar gemacht.</strong>,
    twoColText: false,
    link:       { href: 'https://www.deutsches-museum.de/museumsinsel/programm/programm-a-z/vrlab', label: 'VRlab am Deutschen Museum', external: true },
    source:     'Bilder: Deutsches Museum · Forum der Zukunft, 2022',
  },
  p5: {
    title:      'Kommerz und Kulturkapital pragmatisch bündeln',
    subtitle:   'Abgeschlossene Web- & Agenturprojekte & Kooperationen',
    textA:      'Kommerz und Kultur sind für uns kein Gegensatz, sondern Hebel füreinander. Das kurzfristige, lukrative Tagesgeschäft – in Commerce, Fashion, Lifestyle – schafft die Mittel und die Reichweite, aus denen langfristiges Kulturkapital wächst. Digitale Wirkung entsteht dabei nicht durch sichtbare Ergebnisse allein, sondern durch das, was trägt: verlässliche Systeme, stabile Infrastruktur und die Verbindung aus Technologie, Menschen und Kultur.',
    textB:      'Den Rahmen dafür liefert Stewart Brands Pace Layering: Wer die langsamen, bewahrenden Schichten der Kultur gestalten will, muss in den schnellen Schichten präsent sein. So denken wir in langen Zeithorizonten – und handeln trotzdem im Jetzt. Das schnelle Geschäft ist kein Widerspruch zum Langzeitanspruch, sondern seine Voraussetzung. Wer sich der Kultur bedient, gibt zurück.',
    textC:      'Deshalb arbeiten wir ohne Hierarchie: Familienunternehmen und Kulturinstitution, Subkultur und Hochkultur, Verein und Alltagskultur. Die folgenden Referenzen sind abgeschlossene Web- und Agenturprojekte sowie ehemalige Kooperationen – pragmatisch, ethisch, auf Wirkung ausgerichtet.',
    twoColText: false,
    link:       { href: 'https://longnow.org/ideas/pace-layers/', label: 'Pace Layering – Long Now Foundation', external: true },
    source:     'Hintergrundbild & Idee: Long Now Foundation · Pace Layering (Stewart Brand)',
  },
}

// ─── Shared: underlined arrow link ───────────────────────────────────────────

function ArrowLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      className="group mt-5 inline-flex items-center gap-1.5 border-b border-ink/30 pb-0.5 font-sans text-[12px] font-medium text-ink/55 transition-all hover:border-ink hover:text-ink"
    >
      {label}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        {external ? '↗' : '→'}
      </span>
    </a>
  )
}

// ─── Shared: links + source footnote ─────────────────────────────────────────

function ProjectMeta({ project }: { project: ProjectData }) {
  return (
    <>
      {(project.link || project.download) && (
        <div className="mt-5 flex flex-col items-start gap-3">
          {project.link && (
            <ArrowLink
              href={project.link.href}
              label={project.link.label}
              external={project.link.external}
            />
          )}
          {project.download && (
            <a
              href={project.download.href}
              download
              className="group inline-flex items-center gap-1.5 border-b border-ink/30 pb-0.5
                         font-sans text-[12px] font-medium text-ink/55 transition-all
                         hover:border-ink hover:text-ink"
            >
              {project.download.label}
              <span aria-hidden className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
          )}
        </div>
      )}

      {project.source && (
        <p className="mt-4 font-sans text-[10px] tracking-wider text-ink/32">
          {project.source}
        </p>
      )}
    </>
  )
}

// ─── Langzeitdesign: Grayscale → Color Video Player ───────────────────────────

function LangzeitdesignMedia() {
  const [playing,  setPlaying]  = useState(false)
  const [muted,    setMuted]    = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [lang,     setLang]     = useState<Lang>('de')
  const [isFs,     setIsFs]     = useState(false)
  const ref          = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const src = lang === 'de' ? HLS.langzeitdesignDE : HLS.langzeitdesignEN
  // 45-min film → lazy: nothing downloads until the first play.
  useHlsVideo(ref, src, { preload: false })

  // Inline we crop to fill the rounded frame (object-cover); fullscreen we letterbox
  // (object-contain) so the whole 16:9 frame is visible and never cropped on any screen.
  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const switchLang = (e: React.MouseEvent, next: Lang) => {
    e.stopPropagation()
    if (next === lang) return
    setLang(next)
    setPlaying(false) // src swap resets the element to its poster
  }

  const toggle = () => {
    if (!ref.current) return
    if (playing) { ref.current.pause() } else { ref.current.play().catch(() => {}) }
    setPlaying(p => !p)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!ref.current) return
    ref.current.muted = !ref.current.muted
    setMuted(ref.current.muted)
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) { document.exitFullscreen() }
    else { el.requestFullscreen() }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!ref.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    ref.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div
      ref={containerRef}
      className={[
        'relative overflow-hidden bg-black cursor-pointer select-none',
        isFs ? '' : 'rounded-xl',
      ].join(' ')}
      style={
        isFs
          ? { aspectRatio: 'auto' }
          : { aspectRatio: '16/9', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.55), 0 16px 40px -12px rgba(0,0,0,0.35)' }
      }
      onClick={toggle}
    >
      <video
        ref={ref}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={() => setProgress(ref.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(ref.current?.duration ?? 0)}
        preload="metadata"
        className={[
          'w-full h-full transition-all duration-700',
          isFs ? 'object-contain' : 'object-cover',
          playing ? '' : 'grayscale brightness-75',
        ].join(' ')}
      >
        {/* Fallback for the rare browser without HLS (native or MSE) */}
      </video>

      {/* Inner vignette */}
      {!isFs && (
        <div className="pointer-events-none absolute inset-0 rounded-xl"
             style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.45)' }} />
      )}

      {/* Language toggle — DE / EN narration */}
      <div
        className="absolute top-2.5 right-2.5 z-20 flex overflow-hidden rounded-full border border-white/25 bg-black/35 backdrop-blur-sm"
        onClick={e => e.stopPropagation()}
      >
        {(['de', 'en'] as Lang[]).map(l => (
          <button
            key={l}
            onClick={e => switchLang(e, l)}
            aria-pressed={lang === l}
            className={[
              'px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] transition-colors',
              lang === l ? 'text-white' : 'text-white/45 hover:text-white/75',
            ].join(' ')}
            style={lang === l ? { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' } : undefined}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Paused: title + play */}
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35">
          <p className="font-sans text-[8px] font-medium uppercase tracking-[0.55em] mb-1"
             style={{ color: '#b29bd0' }}>
            Digital Long View
          </p>
          <p className="font-sans text-[11px] font-light uppercase tracking-[0.45em] text-white/60 leading-none">
            Long Term
          </p>
          <p className="font-sans text-[clamp(20px,2.6vw,30px)] font-bold uppercase tracking-[0.2em] text-white leading-none mb-5">
            Design
          </p>
          <button
            aria-label="Video abspielen"
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg
                       transition-all hover:brightness-110 hover:shadow-[0_8px_24px_-8px_rgba(93,70,132,0.7)]
                       active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Playing: pause on hover */}
      {playing && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center bg-black/10">
          <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </div>
        </div>
      )}

      {/* Player bar — always visible when playing */}
      {playing && (
        <div
          className="absolute bottom-0 inset-x-0 flex items-center gap-2 px-3 py-2"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Play/pause */}
          <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
                  className="flex-none w-6 h-6 rounded-full flex items-center justify-center
                             transition-all hover:brightness-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #b29bd0 0%, #8c74aa 50%, #5d4684 100%)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>

          {/* Time */}
          <span className="flex-none font-sans text-[9px] text-white/60 tabular-nums">
            {fmt(progress)} / {fmt(duration)}
          </span>

          {/* Progress bar */}
          <div className="flex-1 h-1 rounded-full bg-white/20 cursor-pointer" onClick={seek}>
            <div className="h-full rounded-full transition-none"
                 style={{
                   width: duration ? `${(progress / duration) * 100}%` : '0%',
                   background: 'linear-gradient(90deg, #b29bd0, #5d4684)',
                 }} />
          </div>

          {/* Mute */}
          <button onClick={toggleMute} aria-label={muted ? 'Ton ein' : 'Ton aus'}
                  className="flex-none text-white/60 hover:text-white transition-colors">
            {muted ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19.73L19 21 20.73 19.27 5.73 4.27 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>

          {/* Vollbild */}
          <button onClick={toggleFullscreen} aria-label="Vollbild"
                  className="flex-none text-white/60 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Sophienkirche: Portrait phone + autoplay video ──────────────────────────
// phone.png is 247×484 with transparent screen area (A ≈ 26 at center).
// Video placed behind the phone; transparency reveals it through the screen.

function SophienkircheMedia() {
  const [muted,   setMuted]   = useState(true)
  const [rotated, setRotated] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Autoplay loop → preload so the first frames are ready on scroll-in.
  useHlsVideo(videoRef, HLS.sophienkirche, { preload: true })

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  // Rotate at 0:50 (50s), back at 3:36 (216s) — works across loops
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTimeUpdate = () => setRotated(v.currentTime >= 51 && v.currentTime < 216)
    v.addEventListener('timeupdate', onTimeUpdate)
    return () => v.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  return (
    <div
      className="relative flex-none mx-auto"
      style={{
        width: 200,
        marginTop: 'clamp(-70px, calc(-8vw + 50px), 30px)',
        transform: rotated ? 'rotate(-90deg)' : 'rotate(0deg)',
        transition: 'transform 0.6s ease-in-out',
      }}
    >
      {/* Video slightly oversized so it bleeds under the opaque phone frame (z-10 covers overflow) */}
      <div
        className="absolute overflow-hidden"
        style={{ top: '2%', left: '3%', right: '3%', bottom: '2%', borderRadius: 18 }}
      >
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover">
        </video>
      </div>
      {/* Phone frame on top — screen area is nearly transparent */}
      <img
        src="/assets/phone.webp"
        alt="Smartphone-Mockup Sophienkirche"
        draggable={false}
        className="relative w-full z-10 pointer-events-none select-none"
      />
      {/* Mute toggle — bottom-right corner, above phone frame */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Ton einschalten' : 'Ton ausschalten'}
        className="absolute bottom-6 right-3 z-20 flex h-7 w-7 items-center justify-center
                   rounded-full bg-black/40 text-white backdrop-blur-sm
                   transition-all hover:bg-black/60"
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19.73L19 21 20.73 19.27 5.73 4.27 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </button>
    </div>
  )
}

// ─── Zeitpyramide: landscape phone, two video buttons, swappable ─────────────

function ZeitpyramideMedia() {
  const [vid, setVid] = useState<'ar' | 'uav' | null>(null)
  const [uavLang, setUavLang] = useState<Lang>('de')
  const arRef  = useRef<HTMLVideoElement>(null)
  const uavRef = useRef<HTMLVideoElement>(null)

  // Click-to-play → lazy: each stream loads only once its button is hit.
  // The UAV clip has DE/EN narration; swapping the source re-attaches the stream.
  useHlsVideo(arRef,  HLS.zpAr, { preload: false })
  useHlsVideo(uavRef, uavLang === 'de' ? HLS.zpUav : HLS.zpUavEN, { preload: false })

  // Play whichever video is selected; pause the other. A UAV language swap re-runs
  // this (uavLang dep) and resumes playback once the new stream has re-attached.
  useEffect(() => {
    const ar  = arRef.current
    const uav = uavRef.current
    if (!ar || !uav) return
    if (vid === 'ar') {
      uav.pause()
      ar.play().catch(() => {})
    } else if (vid === 'uav') {
      ar.pause()
      const id = setTimeout(() => uav.play().catch(() => {}), 150)
      return () => clearTimeout(id)
    }
  }, [vid, uavLang])

  const switchUavLang = (e: React.MouseEvent, next: Lang) => {
    e.stopPropagation()
    setUavLang(next)
  }

  const btnClass = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[9.5px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_4px_14px_-4px_rgba(93,70,132,0.7)] transition-all hover:shadow-[0_6px_18px_-4px_rgba(93,70,132,0.9)] active:scale-[0.97]"
  const btnStyle = { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' }

  return (
    // Width / placement are set by the call site so the phone can float beside the
    // copy (portfolio) or sit in a fixed column elsewhere.
    <div className="relative w-full">

      {/* Spacer — defines container height */}
      <img src="/assets/phone-empty.webp" aria-hidden draggable={false}
           className="w-full block select-none opacity-0 pointer-events-none" />

      {/* Screen content — fill + both videos, all clipped identically */}
      <div className="absolute overflow-hidden pointer-events-none"
           style={{ top: '2%', left: '0.5%', right: '0.5%', bottom: '2%', borderRadius: 16, zIndex: 2 }}>

        {/* fil smartphone.png — idle fill, fades when video selected */}
        <img
          src="/assets/fil-smartphone.webp"
          aria-hidden draggable={false}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500"
          style={{ opacity: vid ? 0 : 1 }}
        />

        <video ref={arRef} playsInline controls preload="auto"
               className="absolute inset-0 w-full h-full bg-black transition-opacity duration-300"
               style={{ objectFit: 'fill', opacity: vid === 'ar' ? 1 : 0, pointerEvents: vid === 'ar' ? 'auto' : 'none' }}>
        </video>

        <video ref={uavRef} playsInline controls preload="auto"
               className="absolute inset-0 w-full h-full bg-black transition-opacity duration-300"
               style={{ objectFit: 'fill', opacity: vid === 'uav' ? 1 : 0, pointerEvents: vid === 'uav' ? 'auto' : 'none' }}>
        </video>
      </div>

      {/* phone-empty.png — frame always visible */}
      <img
        src="/assets/phone-empty.webp"
        alt="Zeitpyramide Smartphone"
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none select-none
                   drop-shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
        style={{ zIndex: 20 }}
      />

      {/* Initial: two buttons over full preview */}
      {!vid && (
        <div className="absolute inset-0 flex items-center justify-center gap-3" style={{ zIndex: 30 }}>
          <button onClick={() => setVid('ar')} className={btnClass} style={btnStyle}>
            AR-Video <span aria-hidden className="opacity-70 text-[8px]">▶</span>
          </button>
          <button onClick={() => setVid('uav')} className={btnClass} style={btnStyle}>
            UAV-Video <span aria-hidden className="opacity-70 text-[8px]">▶</span>
          </button>
        </div>
      )}

      {/* Active: swap button above frame */}
      {vid && (
        <button
          onClick={() => setVid(v => v === 'ar' ? 'uav' : 'ar')}
          className={`absolute top-2 right-2 ${btnClass}`}
          style={{ ...btnStyle, zIndex: 30 }}
        >
          {vid === 'ar' ? 'UAV-Video' : 'AR-Video'}
          <span aria-hidden className="opacity-70 text-[8px]">▶</span>
        </button>
      )}

      {/* UAV narration language — only the UAV clip has an English cut */}
      {vid === 'uav' && (
        <div
          className="absolute top-2 left-2 flex overflow-hidden rounded-full border border-white/25 bg-black/40 backdrop-blur-sm"
          style={{ zIndex: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {(['de', 'en'] as Lang[]).map(l => (
            <button
              key={l}
              onClick={e => switchUavLang(e, l)}
              aria-pressed={uavLang === l}
              className={[
                'px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.18em] transition-colors',
                uavLang === l ? 'text-white' : 'text-white/45 hover:text-white/75',
              ].join(' ')}
              style={uavLang === l ? { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' } : undefined}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function SectionPortfolio() {
  const [active, setActive] = useState<ProjectId>('zeitpyramide')
  const project = PROJECTS[active]

  return (
    <section id="portfolio" className="relative scroll-mt-24 overflow-hidden" style={{ minHeight: 600 }}>

      {/* ── Background images — crossfade ──────────────────────────────────── */}
      {NAV_ITEMS.map(item => (
        <img
          key={item.id}
          src={BG_MAP[item.id]}
          aria-hidden
          draggable={false}
          style={{ objectPosition: BG_POSITION[item.id] ?? 'center' }}
          className={[
            'pointer-events-none absolute inset-0 h-full w-full select-none object-cover',
            'transition-opacity duration-700 ease-in-out',
            active === item.id ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
      ))}
      {/* Directional cream scrim — one tuned gradient per slide, crossfading on change
          (same opacity-swap pattern as the backgrounds above). Strong on the left where
          the nav + copy sit; the text-heavy slides keep more cream on the right so copy
          reaching the right edge stays legible, while render/photo slides clear toward
          the right so the subject keeps its colour. */}
      {NAV_ITEMS.map(item => (
        <div
          key={item.id}
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-in-out"
          aria-hidden
          style={{ opacity: active === item.id ? 1 : 0, background: SCRIM_MAP[item.id] }}
        />
      ))}
      {/* Edge fades blend the top/bottom into the cream page; the left edge reinforces
          legibility. The right edge stays clear so the subject keeps its colour. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-cream to-transparent" aria-hidden />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-24 pb-14 sm:px-10 sm:pt-32 sm:pb-18">

        {/* ── Section heading ───────────────────────────────────────────────── */}
        <SectionHeading eyebrow="Langzeit-Kultur & Portfolio" title="Für das Langzeitdenken" />

        {/* ── Two-column grid: narrow nav | project content ── */}
        <div className="mt-10 grid grid-cols-[118px_1fr] gap-8 sm:gap-12 lg:gap-14">

          {/* ── Left nav ────────────────────────────────────────────────────── */}
          <nav aria-label="Portfolio-Navigation" className="pt-1">
            <ul className="flex flex-col gap-0.5">
              {NAV_ITEMS.map(item => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(item.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={[
                        'flex w-full items-center gap-2 rounded py-1.5 pr-2 text-left transition-all',
                        isActive ? 'text-ink' : 'text-ink/30 hover:text-ink/60',
                      ].join(' ')}
                    >
                      {/* Triangle indicator — visible only for active */}
                      <span
                        className={[
                          'font-sans text-[8px] leading-none text-lavender transition-opacity duration-200 flex-none',
                          isActive ? 'opacity-100' : 'opacity-0',
                        ].join(' ')}
                        aria-hidden
                      >
                        ▶
                      </span>
                      <span className="font-sans text-[10px] font-medium uppercase leading-snug tracking-[0.22em]">
                        {item.label}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* ── Project content ─────────────────────────────────────────────── */}
          <div key={active} style={{ animation: 'fade-up 0.4s ease-out both' }}>

            {/* Title + subtitle */}
            <h3 className="font-sans text-[clamp(20px,2.4vw,30px)] font-semibold leading-tight tracking-tight text-ink">
              {project.title}
            </h3>
            <p className="mt-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.3em] text-lavender">
              {project.subtitle}
            </p>

            {/* Text columns + media */}
            {active === 'langzeitdesign' ? (
              /* Long-form copy: intro sits beside the film, the rest continues
                 full-width in two columns below it so the lines stay readable. */
              <div className="mt-6">
                {/* Intro paragraph sits beside the film */}
                <div className="flex items-start gap-8 lg:gap-12">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[13px] leading-[1.7] text-ink/70">
                      {project.textA}
                    </p>
                  </div>
                  <div className="flex-none" style={{ width: 'clamp(220px,32vw,400px)', marginTop: 'calc(-3rem - 25px)' }}>
                    <LangzeitdesignMedia />
                  </div>
                </div>

                {/* The two main paragraphs continue full-width in two clean
                   columns — one whole paragraph each, so the column break
                   always lands on a paragraph boundary, never mid-sentence. */}
                <div className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:gap-x-12">
                  {project.textB && (
                    <p className="font-serif text-[13px] leading-[1.7] text-ink/70">
                      {project.textB}
                    </p>
                  )}
                  {project.textC && (
                    <p className="font-serif text-[13px] leading-[1.7] text-ink/70">
                      {project.textC}
                    </p>
                  )}
                </div>

                {/* Closing thought spans the full width again */}
                {project.textD && (
                  <p className="mt-3 font-serif text-[13px] leading-[1.7] text-ink/70">
                    {project.textD}
                  </p>
                )}

                <ProjectMeta project={project} />
              </div>
            ) : active === 'zeitpyramide' ? (
              /* First two paragraphs run full-width; the long closing paragraph keeps a
                 fixed column beside the phone (its own column) so no line ever runs
                 full-width under the phone. */
              <div className="mt-6">
                <p className="font-serif text-[13px] leading-[1.7] text-ink/70">
                  {project.textA}
                </p>
                {project.textB && (
                  <p className="mt-3 font-serif text-[13px] leading-[1.7] text-ink/70">
                    {project.textB}
                  </p>
                )}
                <div className="mt-3 flex items-start gap-8 lg:gap-12">
                  <div className="min-w-0 flex-1">
                    {project.textC && (
                      <p className="font-serif text-[13px] leading-[1.7] text-ink/70">
                        {project.textC}
                      </p>
                    )}
                    <ProjectMeta project={project} />
                  </div>
                  <div className="flex-none self-center" style={{ width: 'clamp(280px,36vw,420px)', marginTop: '-150px' }}>
                    <ZeitpyramideMedia />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex items-start gap-8 lg:gap-12">

                {/* Text area */}
                <div className="min-w-0 flex-1" style={
                  active === 'sophienkirche' ? { paddingRight: '4rem' } :
                  undefined
                }>
                  <div
                    className={
                      project.twoColText
                        ? 'grid sm:grid-cols-2 gap-x-8 gap-y-3'
                        : 'flex flex-col gap-3'
                    }
                  >
                    {(() => {
                      // Sophienkirche carries the most copy, so its paragraphs read a
                      // notch smaller/tighter to keep the column beside the phone calm.
                      const pClass = active === 'sophienkirche'
                        ? 'font-serif text-[12px] leading-[1.6] text-ink/70'
                        : 'font-serif text-[14px] leading-[1.72] text-ink/70'
                      return (
                        <>
                          <p className={pClass}>{project.textA}</p>
                          {project.textB && <p className={pClass}>{project.textB}</p>}
                          {project.textC && <p className={pClass}>{project.textC}</p>}
                          {project.textD && <p className={pClass}>{project.textD}</p>}
                        </>
                      )
                    })()}
                  </div>

                  <ProjectMeta project={project} />
                </div>

                {/* Media */}
                {active === 'sophienkirche' && <SophienkircheMedia />}
                {active === 'vrlab' && (
                  <div className="flex-none" style={{ width: 'clamp(240px,34vw,440px)', marginTop: '-2rem' }}>
                    <VrGlasses />
                  </div>
                )}
                {active === 'p5' && (
                  <div className="flex-none" style={{ width: 'clamp(260px,36vw,460px)' }}>
                    <PcWebsites />
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
