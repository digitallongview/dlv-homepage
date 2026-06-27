# Kontaktformular & Mailversand

Das Kontaktformular (`#kontakt`) und der Hero-E-Mail-Signup senden über einen
kleinen PHP-Endpoint **zwei** Mails pro Absendung:

1. **Benachrichtigung ans Team** → `info@digitallongview.com` (mit `Reply-To` =
   Absender, man kann also direkt antworten).
2. **Bestätigung / Auto-Antwort an den Absender** — sprachabhängig (DE/EN),
   HTML-Template im Seiten-Design (Cream/Ink/Lavendel).

## Architektur

```
Frontend (React)                         Server
─────────────────                        ──────────────────────────────
src/components/ContactForm.tsx  ─POST─►  public/api/contact.php
src/components/HeroOverlay.tsx           ├─ liest contact.config.php (SMTP)
src/lib/contactApi.ts                    └─ SMTP (STARTTLS/TLS, AUTH LOGIN)
   → /api/contact.php                        ├─► Team-Benachrichtigung
                                             └─► Auto-Antwort an Absender
```

- **JSON-Contract:** `{ type: 'contact'|'signup', name?, email, subject?, message?, lang, company }`
  (`company` ist ein Honeypot — von Bots ausgefüllt → wird still verworfen).
- **Antwort:** `{ "ok": true }` oder `{ "ok": false, "error": "…" }`.
- Kein externer Dienst, keine Library — reiner PHP-SMTP-Client.

## Server-Setup (einmalig)

1. **PHP-FPM installieren** (Beispiel Debian/Ubuntu):
   ```bash
   sudo apt install php8.3-fpm php8.3-mbstring
   ```
2. **SMTP-Config anlegen** auf dem Server, im Deploy-Zielordner unter `api/`:
   ```bash
   cp api/contact.config.example.php api/contact.config.php
   # contact.config.php mit echten dlv.ngo-/digitallongview.com-SMTP-Daten füllen
   ```
   Wichtig: `from_email` muss zum SMTP-Postfach passen, und für gute
   Zustellbarkeit sollten **SPF & DKIM** der Domain gesetzt sein.
3. **nginx** um den PHP-Block erweitern → siehe `docs/nginx-snippet.conf`
   (Punkt 5–6). Socket-Pfad ggf. anpassen (`php8.3-fpm.sock`).

## Sicherheit / Deploy

- `contact.config.php` ist **gitignored** (steht nie im Repo) und wird im Deploy
  per `--exclude='api/contact.config.php'` vom `rsync --delete` ausgenommen — die
  einmal angelegte Server-Config überlebt also jeden Deploy.
- nginx liefert **nur** `api/contact.php` aus; alle anderen `*.php` (inkl. der
  Config und der `.example`) werden mit 404 geblockt (kein Quelltext-Leak).
- Header-Injection ist abgefangen (Zeilenumbrüche in Name/Betreff werden entfernt).

## Testen

Nach dem Deploy + Config:
```bash
curl -sS -X POST https://digitallongview.com/api/contact.php \
  -H 'Content-Type: application/json' \
  -d '{"type":"contact","name":"Test","email":"DEINE@mail.tld","message":"Hallo","lang":"de"}'
# erwartet: {"ok":true}  → es treffen zwei Mails ein (Team + Bestätigung)
```
Schlägt der Versand fehl, steht der Grund im PHP-FPM-Error-Log
(`error_log`-Einträge `contact.php: …`).
