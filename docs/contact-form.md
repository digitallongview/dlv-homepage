# Kontaktformular, Funnel & Mailversand

Das Kontaktformular (`#kontakt`), der Hero-E-Mail-Signup **und** der Zeitpyramide-
Funnel (`/funnel/`) senden über einen gemeinsamen PHP-Endpoint
`/api/contact.php` jeweils Mails:

- **Benachrichtigung ans Team** → `info@digitallongview.com` (Reply-To = Absender).
- **Bestätigung / Auto-Antwort an den Absender** — sprachabhängig (DE/EN),
  HTML-Template im Seiten-Design. Beim Funnel optional (nur wenn E-Mail angegeben).
- **Funnel-Bild** wird als echter MIME-Anhang an die Team-Mail gehängt.

## Endpoint-Vertrag (`POST /api/contact.php`, JSON)

```json
{ "type": "contact|signup|funnel", "lang": "de|en",
  "name": "", "email": "", "subject": "", "message": "",
  "company": "",                                  // Honeypot, muss leer sein
  "image": { "filename": "", "mime": "image/…", "dataBase64": "" } }  // nur funnel, optional
```
Antwort: `{"ok":true}` oder `{"ok":false,"error":"…"}`.

## Wo das läuft (PRODUKTIV, k3s)

`dlv-dedicated` ist ein **k3s-Cluster mit openDesk**, kein klassischer LAMP-Host.
Die Homepage ist das statische Deployment `dlv-web` (ns `web`, nginx ohne PHP).
Der Mail-Endpoint läuft als **eigenes Deployment `dlv-mail`** (php:8.3-cli) und
wird per Ingress-Pfad `/api/contact.php` angesprochen. **Alle Manifeste +
Setup-Anleitung: [`deploy/k8s/`](../deploy/k8s/README.md).**

Kurzfassung:
- **Versand:** interner openDesk-Postfix `postfix-smtp.opendesk:25`, Relay ohne
  Login (Pod-Netz in `mynetworks`), ausgehend **DKIM-signiert**.
- **SMTP-Config:** k8s-Secret `dlv-mail-config` (außerhalb des Docroots, via
  `CONTACT_CONFIG`) — kein Secret im statisch ausgelieferten Verzeichnis.
- Status: **live & verifiziert** (Kontakt + Funnel inkl. Bild senden erfolgreich).

> `docs/nginx-snippet.conf` ist ein generisches LAMP-Beispiel und wird in dieser
> k3s-Installation **nicht** verwendet.

## Code

| Teil | Datei |
| --- | --- |
| API-Client (Homepage) | `src/lib/contactApi.ts` |
| Kontaktformular (Popup/Modal) | `src/components/ContactModal.tsx`, `ContactForm.tsx` — alle `#kontakt`-CTAs öffnen das Modal (globaler Click-Intercept) statt zu scrollen |
| Hero-Signup | `src/components/HeroOverlay.tsx` |
| Funnel (Standalone, nur per Link) | `public/funnel/` → `https://digitallongview.com/funnel/` |
| Mailer (SMTP, Templates, Anhang) | `public/api/contact.php` |
| Config-Vorlage | `public/api/contact.config.example.php` |

## Lokal testen

`contact.php` braucht PHP mit `mbstring`/`openssl`. Lokal ohne Cluster gibt es
kein internes Relay; zum Testen eine eigene `public/api/contact.config.php`
(gitignored) mit erreichbarem SMTP anlegen. In Produktion erledigt das der
k8s-Secret-Mount.
