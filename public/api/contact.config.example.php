<?php
/**
 * SMTP- und Mail-Konfiguration für contact.php.
 *
 * EINRICHTUNG (einmalig auf dem Server):
 *   1. Diese Datei kopieren nach  contact.config.php  (im selben Ordner).
 *   2. Echte SMTP-Zugangsdaten von dlv.ngo / digitallongview.com eintragen.
 *   3. contact.config.php NICHT committen (steht in .gitignore) und vom rsync-
 *      --delete ausschließen (siehe .github/workflows/deploy.yml → --exclude).
 *
 * Sicherheit: nginx muss den direkten Abruf von *.config.php blocken
 * (siehe docs/nginx-snippet.conf).
 */
return [
    // ── SMTP-Versand ────────────────────────────────────────────────────────
    'smtp_host'   => 'smtp.example.com',      // SMTP-Server des Postfachs
    'smtp_port'   => 587,                       // 587 = STARTTLS, 465 = implizites TLS
    'smtp_secure' => 'tls',                     // 'tls' | 'ssl' | '' (kein TLS)
    'smtp_user'   => 'info@digitallongview.com',
    'smtp_pass'   => 'CHANGE_ME',              // App-/Postfach-Passwort

    // ── Absender / Empfänger ───────────────────────────────────────────────
    'from_email'  => 'info@digitallongview.com', // muss zum SMTP-Postfach passen (SPF/DKIM!)
    'from_name'   => 'Digital Long View',
    'to_email'    => 'info@digitallongview.com', // Team-Benachrichtigung geht hierhin
    'to_name'     => 'Digital Long View',

    // ── Sicherheit ──────────────────────────────────────────────────────────
    // Erlaubte Origins für den POST (CSRF-Härtung). Leer lassen = nur same-origin
    // wird ohnehin durch fehlende CORS-Header erzwungen; hier zusätzlich prüfbar.
    'allowed_origins' => [
        'https://digitallongview.com',
        'https://www.digitallongview.com',
    ],
];
