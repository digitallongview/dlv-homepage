/**
 * Legal copy for the Impressum & Datenschutzerklärung pop-ups.
 *
 * Source: the eRecht24 generator exports in `public/pdf/`
 *   - impressum_www_digitallongview_com_de.pdf
 *   - datenschutzerklaerung_www_digitallongview_com_de.pdf
 *
 * The German text is the legally binding original; the English version is a
 * faithful translation provided for convenience (shown via the DE/EN switch).
 * Content is modelled as flat blocks so the modal can render it with the site's
 * own typography instead of pasting raw HTML.
 */
import type { Lang } from './hlsSources'

export type LegalKey = 'impressum' | 'datenschutz'

export type LegalBlock =
  | { k: 'h2'; t: string }
  | { k: 'h3'; t: string }
  | { k: 'h4'; t: string }
  | { k: 'p'; t: string }
  | { k: 'ul'; items: string[] }
  /** Emphasised, all-caps legal passage (Art. 21 DSGVO Widerspruch). */
  | { k: 'note'; t: string }

export type LegalDoc = {
  eyebrow: string
  title: string
  blocks: LegalBlock[]
}

/** Per-language chrome strings used by the modal shell. */
export const LEGAL_UI: Record<Lang, { close: string; langLabel: string }> = {
  de: { close: 'Schließen', langLabel: 'Sprache' },
  en: { close: 'Close', langLabel: 'Language' },
}

// ─── Impressum ────────────────────────────────────────────────────────────────

const IMPRESSUM_DE: LegalDoc = {
  eyebrow: 'Digital Long View',
  title: 'Impressum',
  blocks: [
    { k: 'p', t: 'DIGITAL LONG VIEW (noch nicht gegründet)\nAn der Schule 3\n86742 Fremdingen' },
    { k: 'h3', t: 'Vertreten durch' },
    { k: 'p', t: 'Lukas Pfaller\nDominik Vasold\nJohann Schmitt' },
    { k: 'h3', t: 'Kontakt' },
    { k: 'p', t: 'Telefon: +49 151 4144 1262\nE-Mail: impressum@digitallongview.com' },
    { k: 'h3', t: 'Redaktionell verantwortlich' },
    { k: 'p', t: 'Lukas Pfaller\nAn der Schule 3\n86742 Fremdingen' },
    { k: 'h3', t: 'Verbraucherstreitbeilegung / Universalschlichtungsstelle' },
    {
      k: 'p',
      t: 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    },
  ],
}

const IMPRESSUM_EN: LegalDoc = {
  eyebrow: 'Digital Long View',
  title: 'Legal Notice',
  blocks: [
    { k: 'p', t: 'DIGITAL LONG VIEW (not yet incorporated)\nAn der Schule 3\n86742 Fremdingen, Germany' },
    { k: 'h3', t: 'Represented by' },
    { k: 'p', t: 'Lukas Pfaller\nDominik Vasold\nJohann Schmitt' },
    { k: 'h3', t: 'Contact' },
    { k: 'p', t: 'Phone: +49 151 4144 1262\nE-mail: impressum@digitallongview.com' },
    { k: 'h3', t: 'Responsible for content' },
    { k: 'p', t: 'Lukas Pfaller\nAn der Schule 3\n86742 Fremdingen, Germany' },
    { k: 'h3', t: 'Consumer dispute resolution / Universal arbitration board' },
    {
      k: 'p',
      t: 'We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.',
    },
  ],
}

// ─── Datenschutzerklärung ─────────────────────────────────────────────────────

const DATENSCHUTZ_DE: LegalDoc = {
  eyebrow: 'Digital Long View',
  title: 'Datenschutzerklärung',
  blocks: [
    { k: 'h2', t: '1. Datenschutz auf einen Blick' },

    { k: 'h3', t: 'Allgemeine Hinweise' },
    {
      k: 'p',
      t: 'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.',
    },

    { k: 'h3', t: 'Datenerfassung auf dieser Website' },
    { k: 'h4', t: 'Wer ist verantwortlich für die Datenerfassung auf dieser Website?' },
    {
      k: 'p',
      t: 'Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.',
    },
    { k: 'h4', t: 'Wie erfassen wir Ihre Daten?' },
    {
      k: 'p',
      t: 'Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.',
    },
    {
      k: 'p',
      t: 'Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.',
    },
    { k: 'h4', t: 'Wofür nutzen wir Ihre Daten?' },
    {
      k: 'p',
      t: 'Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern über die Website Verträge geschlossen oder angebahnt werden können, werden die übermittelten Daten auch für Vertragsangebote, Bestellungen oder sonstige Auftragsanfragen verarbeitet.',
    },
    { k: 'h4', t: 'Welche Rechte haben Sie bezüglich Ihrer Daten?' },
    {
      k: 'p',
      t: 'Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.',
    },
    {
      k: 'p',
      t: 'Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.',
    },

    { k: 'h2', t: '2. Hosting' },
    { k: 'p', t: 'Wir hosten die Inhalte unserer Website bei folgendem Anbieter:' },
    { k: 'h3', t: 'Hetzner' },
    {
      k: 'p',
      t: 'Anbieter ist die Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen (nachfolgend Hetzner).',
    },
    {
      k: 'p',
      t: 'Details entnehmen Sie der Datenschutzerklärung von Hetzner: https://www.hetzner.com/de/legal/privacy-policy/.',
    },
    {
      k: 'p',
      t: 'Die Verwendung von Hetzner erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung von Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers (z. B. Device-Fingerprinting) im Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.',
    },
    { k: 'h4', t: 'Auftragsverarbeitung' },
    {
      k: 'p',
      t: 'Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.',
    },

    { k: 'h2', t: '3. Allgemeine Hinweise und Pflichtinformationen' },
    { k: 'h3', t: 'Datenschutz' },
    {
      k: 'p',
      t: 'Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.',
    },
    {
      k: 'p',
      t: 'Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.',
    },
    {
      k: 'p',
      t: 'Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.',
    },
    { k: 'h3', t: 'Hinweis zur verantwortlichen Stelle' },
    { k: 'p', t: 'Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:' },
    {
      k: 'p',
      t: 'DIGITAL LONG VIEW GbR (noch nicht gegründet)\nAn der Schule 3\n86742 Fremdingen\nTelefon: +49 151 4144 1262\nE-Mail: info@digitallongview.com',
    },
    {
      k: 'p',
      t: 'Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.',
    },
    { k: 'h3', t: 'Speicherdauer' },
    {
      k: 'p',
      t: 'Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.',
    },
    { k: 'h3', t: 'Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website' },
    {
      k: 'p',
      t: 'Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung personenbezogener Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in Ihr Endgerät (z. B. via Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer rechtlichen Verpflichtung erforderlich sind, auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen dieser Datenschutzerklärung informiert.',
    },
    { k: 'h3', t: 'Empfänger von personenbezogenen Daten' },
    {
      k: 'p',
      t: 'Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei ist teilweise auch eine Übermittlung von personenbezogenen Daten an diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an externe Stellen weiter, wenn dies im Rahmen einer Vertragserfüllung erforderlich ist, wenn wir gesetzlich hierzu verpflichtet sind (z. B. Weitergabe von Daten an Steuerbehörden), wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe erlaubt. Beim Einsatz von Auftragsverarbeitern geben wir personenbezogene Daten unserer Kunden nur auf Grundlage eines gültigen Vertrags über Auftragsverarbeitung weiter. Im Falle einer gemeinsamen Verarbeitung wird ein Vertrag über gemeinsame Verarbeitung geschlossen.',
    },
    { k: 'h3', t: 'Widerruf Ihrer Einwilligung zur Datenverarbeitung' },
    {
      k: 'p',
      t: 'Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.',
    },
    { k: 'h3', t: 'Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)' },
    {
      k: 'note',
      t: 'WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).',
    },
    {
      k: 'note',
      t: 'WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).',
    },
    { k: 'h3', t: 'Beschwerderecht bei der zuständigen Aufsichtsbehörde' },
    {
      k: 'p',
      t: 'Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.',
    },
    { k: 'h3', t: 'Recht auf Datenübertragbarkeit' },
    {
      k: 'p',
      t: 'Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.',
    },
    { k: 'h3', t: 'Auskunft, Berichtigung und Löschung' },
    {
      k: 'p',
      t: 'Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.',
    },
    { k: 'h3', t: 'Recht auf Einschränkung der Verarbeitung' },
    {
      k: 'p',
      t: 'Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf Einschränkung der Verarbeitung besteht in folgenden Fällen:',
    },
    {
      k: 'ul',
      items: [
        'Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.',
        'Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie statt der Löschung die Einschränkung der Datenverarbeitung verlangen.',
        'Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der Löschung die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.',
        'Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen überwiegen, haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.',
      ],
    },
    {
      k: 'p',
      t: 'Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese Daten – von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses der Europäischen Union oder eines Mitgliedstaats verarbeitet werden.',
    },
    { k: 'h3', t: 'SSL- bzw. TLS-Verschlüsselung' },
    {
      k: 'p',
      t: 'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.',
    },
    {
      k: 'p',
      t: 'Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.',
    },
    { k: 'h3', t: 'Widerspruch gegen Werbe-E-Mails' },
    {
      k: 'p',
      t: 'Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.',
    },

    { k: 'h2', t: '4. Datenerfassung auf dieser Website' },
    { k: 'h3', t: 'Server-Log-Dateien' },
    {
      k: 'p',
      t: 'Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:',
    },
    {
      k: 'ul',
      items: [
        'Browsertyp und Browserversion',
        'verwendetes Betriebssystem',
        'Referrer URL',
        'Hostname des zugreifenden Rechners',
        'Uhrzeit der Serveranfrage',
        'IP-Adresse',
      ],
    },
    { k: 'p', t: 'Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.' },
    {
      k: 'p',
      t: 'Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.',
    },
    { k: 'h3', t: 'Kontaktformular' },
    {
      k: 'p',
      t: 'Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
    },
    {
      k: 'p',
      t: 'Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.',
    },
    {
      k: 'p',
      t: 'Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.',
    },
    { k: 'h3', t: 'Anfrage per E-Mail, Telefon oder Telefax' },
    {
      k: 'p',
      t: 'Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
    },
    {
      k: 'p',
      t: 'Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.',
    },
    {
      k: 'p',
      t: 'Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen – insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.',
    },
  ],
}

const DATENSCHUTZ_EN: LegalDoc = {
  eyebrow: 'Digital Long View',
  title: 'Privacy Policy',
  blocks: [
    { k: 'h2', t: '1. Privacy at a glance' },

    { k: 'h3', t: 'General information' },
    {
      k: 'p',
      t: 'The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to identify you personally. For detailed information on the subject of data protection, please refer to our privacy policy set out below this text.',
    },

    { k: 'h3', t: 'Data collection on this website' },
    { k: 'h4', t: 'Who is responsible for data collection on this website?' },
    {
      k: 'p',
      t: 'Data processing on this website is carried out by the website operator. You can find their contact details in the section “Information on the controller” in this privacy policy.',
    },
    { k: 'h4', t: 'How do we collect your data?' },
    {
      k: 'p',
      t: 'Your data is collected, on the one hand, by you providing it to us. This may be data that you enter into a contact form, for example.',
    },
    {
      k: 'p',
      t: 'Other data is collected automatically or with your consent when you visit the website via our IT systems. This is primarily technical data (e.g. internet browser, operating system or the time the page was accessed). This data is collected automatically as soon as you enter this website.',
    },
    { k: 'h4', t: 'What do we use your data for?' },
    {
      k: 'p',
      t: 'Part of the data is collected to ensure that the website is provided without errors. Other data may be used to analyse your user behaviour. Where contracts can be concluded or initiated via the website, the transmitted data is also processed for contract offers, orders or other enquiries.',
    },
    { k: 'h4', t: 'What rights do you have regarding your data?' },
    {
      k: 'p',
      t: 'You have the right at any time to receive information free of charge about the origin, recipients and purpose of your stored personal data. You also have a right to request the correction or deletion of this data. If you have given consent to data processing, you can revoke this consent at any time with effect for the future. You also have the right, under certain circumstances, to request that the processing of your personal data be restricted. Furthermore, you have a right to lodge a complaint with the competent supervisory authority.',
    },
    {
      k: 'p',
      t: 'You can contact us at any time regarding this and any other questions on the subject of data protection.',
    },

    { k: 'h2', t: '2. Hosting' },
    { k: 'p', t: 'We host the content of our website with the following provider:' },
    { k: 'h3', t: 'Hetzner' },
    {
      k: 'p',
      t: 'The provider is Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany (hereinafter Hetzner).',
    },
    {
      k: 'p',
      t: 'For details, please see Hetzner’s privacy policy: https://www.hetzner.com/de/legal/privacy-policy/.',
    },
    {
      k: 'p',
      t: 'The use of Hetzner is based on Art. 6(1)(f) GDPR. We have a legitimate interest in presenting our website as reliably as possible. Where a corresponding consent has been requested, processing is carried out exclusively on the basis of Art. 6(1)(a) GDPR and § 25(1) TDDDG, insofar as the consent covers the storage of cookies or access to information in the user’s device (e.g. device fingerprinting) within the meaning of the TDDDG. Consent can be revoked at any time.',
    },
    { k: 'h4', t: 'Data processing agreement' },
    {
      k: 'p',
      t: 'We have concluded a data processing agreement (DPA) for the use of the above-mentioned service. This is a contract prescribed by data protection law, which guarantees that the provider processes the personal data of our website visitors only in accordance with our instructions and in compliance with the GDPR.',
    },

    { k: 'h2', t: '3. General information and mandatory information' },
    { k: 'h3', t: 'Data protection' },
    {
      k: 'p',
      t: 'The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.',
    },
    {
      k: 'p',
      t: 'When you use this website, various personal data is collected. Personal data is data that can be used to identify you personally. This privacy policy explains what data we collect and what we use it for. It also explains how and for what purpose this is done.',
    },
    {
      k: 'p',
      t: 'We would like to point out that data transmission over the internet (e.g. when communicating by e-mail) may have security gaps. Complete protection of data against access by third parties is not possible.',
    },
    { k: 'h3', t: 'Information on the controller' },
    { k: 'p', t: 'The controller responsible for data processing on this website is:' },
    {
      k: 'p',
      t: 'DIGITAL LONG VIEW GbR (not yet incorporated)\nAn der Schule 3\n86742 Fremdingen, Germany\nPhone: +49 151 4144 1262\nE-mail: info@digitallongview.com',
    },
    {
      k: 'p',
      t: 'The controller is the natural or legal person who alone or jointly with others determines the purposes and means of the processing of personal data (e.g. names, e-mail addresses, etc.).',
    },
    { k: 'h3', t: 'Storage period' },
    {
      k: 'p',
      t: 'Unless a more specific storage period is stated within this privacy policy, your personal data will remain with us until the purpose for the data processing no longer applies. If you assert a legitimate request for deletion or revoke your consent to data processing, your data will be deleted, unless we have other legally permissible reasons for storing your personal data (e.g. retention periods under tax or commercial law); in the latter case, deletion takes place once these reasons no longer apply.',
    },
    { k: 'h3', t: 'General information on the legal bases for data processing on this website' },
    {
      k: 'p',
      t: 'If you have consented to data processing, we process your personal data on the basis of Art. 6(1)(a) GDPR or Art. 9(2)(a) GDPR, insofar as special categories of data are processed in accordance with Art. 9(1) GDPR. In the case of explicit consent to the transfer of personal data to third countries, data processing also takes place on the basis of Art. 49(1)(a) GDPR. If you have consented to the storage of cookies or to access to information in your device (e.g. via device fingerprinting), data processing additionally takes place on the basis of § 25(1) TDDDG. Consent can be revoked at any time. If your data is required to fulfil a contract or to carry out pre-contractual measures, we process your data on the basis of Art. 6(1)(b) GDPR. Furthermore, we process your data where this is necessary to fulfil a legal obligation, on the basis of Art. 6(1)(c) GDPR. Data processing may also be carried out on the basis of our legitimate interest pursuant to Art. 6(1)(f) GDPR. Information on the relevant legal bases in each individual case is provided in the following paragraphs of this privacy policy.',
    },
    { k: 'h3', t: 'Recipients of personal data' },
    {
      k: 'p',
      t: 'As part of our business activities, we work with various external parties. In some cases, this also requires the transfer of personal data to these external parties. We only pass on personal data to external parties if this is necessary in the context of fulfilling a contract, if we are legally obliged to do so (e.g. passing on data to tax authorities), if we have a legitimate interest in the disclosure pursuant to Art. 6(1)(f) GDPR, or if another legal basis permits the disclosure. When using processors, we only pass on the personal data of our customers on the basis of a valid data processing agreement. In the case of joint processing, a joint processing agreement is concluded.',
    },
    { k: 'h3', t: 'Revocation of your consent to data processing' },
    {
      k: 'p',
      t: 'Many data processing operations are only possible with your express consent. You can revoke consent you have already given at any time. The lawfulness of the data processing carried out until the revocation remains unaffected by the revocation.',
    },
    { k: 'h3', t: 'Right to object to data collection in special cases and to direct advertising (Art. 21 GDPR)' },
    {
      k: 'note',
      t: 'IF DATA PROCESSING IS BASED ON ART. 6(1)(E) OR (F) GDPR, YOU HAVE THE RIGHT AT ANY TIME TO OBJECT TO THE PROCESSING OF YOUR PERSONAL DATA ON GROUNDS RELATING TO YOUR PARTICULAR SITUATION; THIS ALSO APPLIES TO PROFILING BASED ON THESE PROVISIONS. THE RESPECTIVE LEGAL BASIS ON WHICH PROCESSING IS BASED CAN BE FOUND IN THIS PRIVACY POLICY. IF YOU OBJECT, WE WILL NO LONGER PROCESS YOUR PERSONAL DATA CONCERNED, UNLESS WE CAN DEMONSTRATE COMPELLING LEGITIMATE GROUNDS FOR THE PROCESSING WHICH OVERRIDE YOUR INTERESTS, RIGHTS AND FREEDOMS, OR THE PROCESSING SERVES TO ASSERT, EXERCISE OR DEFEND LEGAL CLAIMS (OBJECTION PURSUANT TO ART. 21(1) GDPR).',
    },
    {
      k: 'note',
      t: 'IF YOUR PERSONAL DATA IS PROCESSED FOR THE PURPOSE OF DIRECT ADVERTISING, YOU HAVE THE RIGHT TO OBJECT AT ANY TIME TO THE PROCESSING OF PERSONAL DATA CONCERNING YOU FOR THE PURPOSE OF SUCH ADVERTISING; THIS ALSO APPLIES TO PROFILING INSOFAR AS IT IS ASSOCIATED WITH SUCH DIRECT ADVERTISING. IF YOU OBJECT, YOUR PERSONAL DATA WILL SUBSEQUENTLY NO LONGER BE USED FOR THE PURPOSE OF DIRECT ADVERTISING (OBJECTION PURSUANT TO ART. 21(2) GDPR).',
    },
    { k: 'h3', t: 'Right to lodge a complaint with the competent supervisory authority' },
    {
      k: 'p',
      t: 'In the event of breaches of the GDPR, data subjects have the right to lodge a complaint with a supervisory authority, in particular in the member state of their habitual residence, place of work or the place of the alleged infringement. This right to complain exists without prejudice to any other administrative or judicial remedy.',
    },
    { k: 'h3', t: 'Right to data portability' },
    {
      k: 'p',
      t: 'You have the right to have data that we process automatically on the basis of your consent or in fulfilment of a contract handed over to you or to a third party in a common, machine-readable format. If you request the direct transfer of the data to another controller, this will only be done insofar as it is technically feasible.',
    },
    { k: 'h3', t: 'Information, correction and deletion' },
    {
      k: 'p',
      t: 'Within the framework of the applicable statutory provisions, you have the right at any time to free information about your stored personal data, its origin and recipients and the purpose of the data processing and, if applicable, a right to correction or deletion of this data. You can contact us at any time regarding this and any other questions on the subject of personal data.',
    },
    { k: 'h3', t: 'Right to restriction of processing' },
    {
      k: 'p',
      t: 'You have the right to request the restriction of the processing of your personal data. You can contact us at any time to do so. The right to restriction of processing exists in the following cases:',
    },
    {
      k: 'ul',
      items: [
        'If you dispute the accuracy of your personal data stored by us, we usually need time to verify this. For the duration of the review, you have the right to request the restriction of the processing of your personal data.',
        'If the processing of your personal data was/is unlawful, you can request the restriction of data processing instead of deletion.',
        'If we no longer need your personal data but you need it to exercise, defend or assert legal claims, you have the right to request the restriction of the processing of your personal data instead of deletion.',
        'If you have lodged an objection pursuant to Art. 21(1) GDPR, a balance must be struck between your interests and ours. As long as it has not yet been determined whose interests prevail, you have the right to request the restriction of the processing of your personal data.',
      ],
    },
    {
      k: 'p',
      t: 'If you have restricted the processing of your personal data, this data may – apart from being stored – only be processed with your consent or to assert, exercise or defend legal claims or to protect the rights of another natural or legal person or for reasons of important public interest of the European Union or a member state.',
    },
    { k: 'h3', t: 'SSL/TLS encryption' },
    {
      k: 'p',
      t: 'For security reasons and to protect the transmission of confidential content, such as orders or enquiries that you send to us as the site operator, this site uses SSL or TLS encryption. You can recognise an encrypted connection by the fact that the address line of the browser changes from “http://” to “https://” and by the lock symbol in your browser line.',
    },
    {
      k: 'p',
      t: 'If SSL or TLS encryption is activated, the data you transmit to us cannot be read by third parties.',
    },
    { k: 'h3', t: 'Objection to advertising e-mails' },
    {
      k: 'p',
      t: 'We hereby object to the use of contact data published within the framework of the imprint obligation for sending advertising and information material that has not been expressly requested. The operators of these pages expressly reserve the right to take legal action in the event of the unsolicited sending of advertising information, for example via spam e-mails.',
    },

    { k: 'h2', t: '4. Data collection on this website' },
    { k: 'h3', t: 'Server log files' },
    {
      k: 'p',
      t: 'The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:',
    },
    {
      k: 'ul',
      items: [
        'Browser type and browser version',
        'Operating system used',
        'Referrer URL',
        'Hostname of the accessing computer',
        'Time of the server request',
        'IP address',
      ],
    },
    { k: 'p', t: 'This data is not merged with other data sources.' },
    {
      k: 'p',
      t: 'This data is collected on the basis of Art. 6(1)(f) GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimisation of its website – for this purpose, the server log files must be collected.',
    },
    { k: 'h3', t: 'Contact form' },
    {
      k: 'p',
      t: 'If you send us enquiries via the contact form, your details from the enquiry form, including the contact details you provide there, will be stored by us for the purpose of processing the enquiry and in case of follow-up questions. We will not pass on this data without your consent.',
    },
    {
      k: 'p',
      t: 'This data is processed on the basis of Art. 6(1)(b) GDPR, provided that your enquiry is related to the fulfilment of a contract or is necessary to carry out pre-contractual measures. In all other cases, processing is based on our legitimate interest in the effective handling of the enquiries sent to us (Art. 6(1)(f) GDPR) or on your consent (Art. 6(1)(a) GDPR) if this was requested; consent can be revoked at any time.',
    },
    {
      k: 'p',
      t: 'The data you enter in the contact form will remain with us until you ask us to delete it, revoke your consent to its storage, or the purpose for storing the data no longer applies (e.g. after we have completed processing your enquiry). Mandatory statutory provisions – in particular retention periods – remain unaffected.',
    },
    { k: 'h3', t: 'Enquiry by e-mail, telephone or fax' },
    {
      k: 'p',
      t: 'If you contact us by e-mail, telephone or fax, your enquiry, including all resulting personal data (name, enquiry), will be stored and processed by us for the purpose of handling your request. We will not pass on this data without your consent.',
    },
    {
      k: 'p',
      t: 'This data is processed on the basis of Art. 6(1)(b) GDPR, provided that your enquiry is related to the fulfilment of a contract or is necessary to carry out pre-contractual measures. In all other cases, processing is based on our legitimate interest in the effective handling of the enquiries sent to us (Art. 6(1)(f) GDPR) or on your consent (Art. 6(1)(a) GDPR) if this was requested; consent can be revoked at any time.',
    },
    {
      k: 'p',
      t: 'The data you send us via contact enquiries will remain with us until you ask us to delete it, revoke your consent to its storage, or the purpose for storing the data no longer applies (e.g. after we have completed processing your request). Mandatory statutory provisions – in particular statutory retention periods – remain unaffected.',
    },
  ],
}

// ─── Public registry ──────────────────────────────────────────────────────────

export const LEGAL: Record<LegalKey, Record<Lang, LegalDoc>> = {
  impressum: { de: IMPRESSUM_DE, en: IMPRESSUM_EN },
  datenschutz: { de: DATENSCHUTZ_DE, en: DATENSCHUTZ_EN },
}
