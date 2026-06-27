<?php
/**
 * Kontakt-Endpoint für die Digital-Long-View-Landingpage.
 *
 * Nimmt JSON vom Frontend (src/lib/contactApi.ts) entgegen und verschickt per
 * SMTP ZWEI Mails:
 *   1. Benachrichtigung an das Team (info@digitallongview.com)
 *   2. Eine sprachabhängige Bestätigung / Auto-Antwort an den Absender
 *
 * Versand via SMTP (STARTTLS/implizites TLS, AUTH LOGIN) ohne externe Library.
 * Zugangsdaten kommen aus contact.config.php (nicht im Repo).
 *
 * Antwort: application/json  →  {"ok":true}  oder  {"ok":false,"error":"…"}
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/** Kleine JSON-Antwort + Ende. */
function respond(bool $ok, string $error = '', int $status = 200): void
{
    http_response_code($ok ? 200 : $status);
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(false, 'method_not_allowed', 405);
}

// ── Konfiguration laden ─────────────────────────────────────────────────────
$configFile = __DIR__ . '/contact.config.php';
if (!is_file($configFile)) {
    error_log('contact.php: contact.config.php fehlt');
    respond(false, 'server_not_configured', 500);
}
/** @var array $cfg */
$cfg = require $configFile;

// Optionale Origin-Prüfung (CSRF-Härtung).
$allowed = $cfg['allowed_origins'] ?? [];
if (!empty($allowed)) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && !in_array($origin, $allowed, true)) {
        respond(false, 'forbidden_origin', 403);
    }
}

// ── Eingabe parsen ──────────────────────────────────────────────────────────
$raw = file_get_contents('php://input') ?: '';
$in = json_decode($raw, true);
if (!is_array($in)) {
    respond(false, 'invalid_payload', 400);
}

$type    = ($in['type'] ?? 'contact') === 'signup' ? 'signup' : 'contact';
$lang    = ($in['lang'] ?? 'de') === 'en' ? 'en' : 'de';
$name    = trim((string)($in['name'] ?? ''));
$email   = trim((string)($in['email'] ?? ''));
$subject = trim((string)($in['subject'] ?? ''));
$message = trim((string)($in['message'] ?? ''));
$company = trim((string)($in['company'] ?? '')); // Honeypot

// Honeypot ausgefüllt → Bot. So tun als ob alles geklappt hat.
if ($company !== '') {
    respond(true);
}

// ── Validierung ─────────────────────────────────────────────────────────────
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'invalid_email', 422);
}
if ($type === 'contact' && $message === '') {
    respond(false, 'message_required', 422);
}
// Header-Injection verhindern (Namen/Betreff dürfen keine Zeilenumbrüche tragen).
$name    = preg_replace('/[\r\n]+/', ' ', mb_substr($name, 0, 120));
$subject = preg_replace('/[\r\n]+/', ' ', mb_substr($subject, 0, 160));
$message = mb_substr($message, 0, 5000);

// ── Mails bauen ─────────────────────────────────────────────────────────────
$tpl = build_emails($type, $lang, $name, $email, $subject, $message);

try {
    // 1) Team-Benachrichtigung (Reply-To = Absender, damit man direkt antworten kann)
    smtp_send(
        $cfg,
        $cfg['to_email'], $cfg['to_name'],
        $tpl['team']['subject'], $tpl['team']['html'], $tpl['team']['text'],
        $email, ($name !== '' ? $name : $email)
    );

    // 2) Bestätigung / Auto-Antwort an den Absender (best effort)
    try {
        smtp_send(
            $cfg,
            $email, ($name !== '' ? $name : $email),
            $tpl['reply']['subject'], $tpl['reply']['html'], $tpl['reply']['text'],
            $cfg['from_email'], $cfg['from_name']
        );
    } catch (Throwable $e) {
        error_log('contact.php: Auto-Antwort fehlgeschlagen: ' . $e->getMessage());
        // Team-Mail ist raus → für den Nutzer trotzdem Erfolg.
    }

    respond(true);
} catch (Throwable $e) {
    error_log('contact.php: Versand fehlgeschlagen: ' . $e->getMessage());
    respond(false, 'send_failed', 502);
}

// ─────────────────────────────────────────────────────────────────────────────
// Template-Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Liefert ['team' => [...], 'reply' => [...]] mit je subject/html/text.
 */
function build_emails(string $type, string $lang, string $name, string $email, string $subject, string $message): array
{
    $safeName    = $name !== '' ? $name : ($lang === 'en' ? 'No name given' : 'Kein Name angegeben');
    $safeSubject = $subject !== '' ? $subject : ($type === 'signup'
        ? ($lang === 'en' ? 'Early-access sign-up' : 'Newsletter-Anmeldung')
        : ($lang === 'en' ? 'Contact request' : 'Kontaktanfrage'));

    // ── Team-Benachrichtigung (intern, Deutsch) ──────────────────────────────
    if ($type === 'signup') {
        $teamSubject = 'Neue Newsletter-Anmeldung — ' . $email;
        $teamRows = [
            ['Typ', 'Newsletter / Early Access'],
            ['E-Mail', $email],
            ['Sprache', strtoupper($lang)],
        ];
        $teamIntro = 'Jemand möchte über den Launch informiert werden.';
    } else {
        $teamSubject = 'Neue Kontaktanfrage — ' . $safeName;
        $teamRows = [
            ['Name', $safeName],
            ['E-Mail', $email],
            ['Betreff', $safeSubject],
            ['Sprache', strtoupper($lang)],
        ];
        $teamIntro = 'Über das Kontaktformular ist eine neue Nachricht eingegangen.';
    }

    $teamBodyHtml = '<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#3a3a44;">' . esc($teamIntro) . '</p>'
        . rows_html($teamRows);
    if ($type === 'contact') {
        $teamBodyHtml .= '<p style="margin:22px 0 6px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c74aa;">Nachricht</p>'
            . '<div style="font-size:15px;line-height:1.65;color:#1a1a22;white-space:pre-line;">' . nl2br(esc($message)) . '</div>';
    }

    $teamText = $teamIntro . "\n\n";
    foreach ($teamRows as $r) {
        $teamText .= $r[0] . ': ' . $r[1] . "\n";
    }
    if ($type === 'contact') {
        $teamText .= "\nNachricht:\n" . $message . "\n";
    }

    // ── Auto-Antwort an den Absender (sprachabhängig) ────────────────────────
    if ($lang === 'en') {
        if ($type === 'signup') {
            $replySubject = 'Welcome to Digital Long View';
            $greeting = $name !== '' ? "Hi $name," : 'Hello,';
            $greetingHtml = $name !== '' ? 'Hi ' . esc($name) . ',' : 'Hello,';
            $replyBodyHtml =
                "<p style=\"margin:0 0 16px;\">$greetingHtml</p>"
                . '<p style="margin:0 0 16px;">Thank you for signing up. We’ll let you know as soon as Digital Long View goes live — with first content and updates along the way.</p>'
                . '<p style="margin:0 0 16px;">In the meantime, feel free to reply to this e-mail if you’d like to share an idea or a project with a long breath.</p>';
            $replyText = "$greeting\n\nThank you for signing up. We’ll let you know as soon as Digital Long View goes live — with first content and updates along the way.\n\nIn the meantime, feel free to reply to this e-mail.\n\n— Digital Long View";
        } else {
            $replySubject = 'We received your message — Digital Long View';
            $greeting = $name !== '' ? "Hi $name," : 'Hello,';
            $greetingHtml = $name !== '' ? 'Hi ' . esc($name) . ',' : 'Hello,';
            $replyBodyHtml =
                "<p style=\"margin:0 0 16px;\">$greetingHtml</p>"
                . '<p style="margin:0 0 16px;">Thank you for reaching out. We’ve received your message and will get back to you as soon as we can.</p>'
                . '<p style="margin:0 0 8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c74aa;">Your message</p>'
                . '<div style="font-size:14px;line-height:1.6;color:#3a3a44;white-space:pre-line;border-left:3px solid #d8cce6;padding-left:14px;">' . nl2br(esc($message)) . '</div>';
            $replyText = "$greeting\n\nThank you for reaching out. We’ve received your message and will get back to you as soon as we can.\n\nYour message:\n$message\n\n— Digital Long View";
        }
        $replyTagline = 'The digital agency for space, time and culture';
    } else {
        if ($type === 'signup') {
            $replySubject = 'Willkommen bei Digital Long View';
            $greeting = $name !== '' ? "Hallo $name," : 'Hallo,';
            $greetingHtml = $name !== '' ? 'Hallo ' . esc($name) . ',' : 'Hallo,';
            $replyBodyHtml =
                "<p style=\"margin:0 0 16px;\">$greetingHtml</p>"
                . '<p style="margin:0 0 16px;">danke für deine Anmeldung. Wir melden uns, sobald Digital Long View startet — mit ersten Inhalten und Updates auf dem Weg dorthin.</p>'
                . '<p style="margin:0 0 16px;">Bis dahin: Antworte gern direkt auf diese E-Mail, wenn du eine Idee oder ein Projekt mit langem Atem teilen möchtest.</p>';
            $replyText = "$greeting\n\ndanke für deine Anmeldung. Wir melden uns, sobald Digital Long View startet — mit ersten Inhalten und Updates auf dem Weg dorthin.\n\nBis dahin: Antworte gern direkt auf diese E-Mail.\n\n— Digital Long View";
        } else {
            $replySubject = 'Wir haben deine Nachricht erhalten — Digital Long View';
            $greeting = $name !== '' ? "Hallo $name," : 'Hallo,';
            $greetingHtml = $name !== '' ? 'Hallo ' . esc($name) . ',' : 'Hallo,';
            $replyBodyHtml =
                "<p style=\"margin:0 0 16px;\">$greetingHtml</p>"
                . '<p style="margin:0 0 16px;">vielen Dank für deine Nachricht. Wir haben sie erhalten und melden uns so bald wie möglich bei dir.</p>'
                . '<p style="margin:0 0 8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8c74aa;">Deine Nachricht</p>'
                . '<div style="font-size:14px;line-height:1.6;color:#3a3a44;white-space:pre-line;border-left:3px solid #d8cce6;padding-left:14px;">' . nl2br(esc($message)) . '</div>';
            $replyText = "$greeting\n\nvielen Dank für deine Nachricht. Wir haben sie erhalten und melden uns so bald wie möglich bei dir.\n\nDeine Nachricht:\n$message\n\n— Digital Long View";
        }
        $replyTagline = 'Die Digitalagentur für Raum, Zeit und Kultur';
    }

    return [
        'team' => [
            'subject' => $teamSubject,
            'html'    => email_shell($type === 'signup' ? 'Newsletter-Anmeldung' : 'Kontaktanfrage', $teamBodyHtml, 'Digital Long View · interne Benachrichtigung'),
            'text'    => $teamText . "\n\n— Digital Long View",
        ],
        'reply' => [
            'subject' => $replySubject,
            'html'    => email_shell($replySubject, '<div style="font-size:15px;line-height:1.65;color:#1a1a22;">' . $replyBodyHtml . '</div>', $replyTagline),
            'text'    => $replyText,
        ],
    ];
}

/** Tabellen-Zeilen (Label/Wert) als HTML. */
function rows_html(array $rows): string
{
    $out = '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    foreach ($rows as $r) {
        $out .= '<tr>'
            . '<td style="padding:6px 0;width:120px;vertical-align:top;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#8c74aa;">' . esc($r[0]) . '</td>'
            . '<td style="padding:6px 0;font-size:15px;color:#1a1a22;">' . esc($r[1]) . '</td>'
            . '</tr>';
    }
    return $out . '</table>';
}

/**
 * Mail-Rahmen im Seiten-Design (Cream/Ink/Lavendel, Tabellen-Layout + Inline-CSS,
 * damit es in allen Clients trägt).
 */
function email_shell(string $title, string $bodyHtml, string $tagline): string
{
    $year = date('Y');
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;padding:0;background:#f7eced;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f7eced;">'
        . '<tr><td align="center" style="padding:32px 16px;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 30px 70px -30px rgba(24,24,38,0.35);font-family:Helvetica,Arial,sans-serif;">'
        // Gradient-Leiste
        . '<tr><td style="height:6px;background:linear-gradient(90deg,#b29bd0 0%,#8c74aa 50%,#5d4684 100%);font-size:0;line-height:0;">&nbsp;</td></tr>'
        // Header
        . '<tr><td style="padding:30px 36px 8px;">'
        . '<div style="font-size:11px;letter-spacing:.42em;text-transform:uppercase;color:#8c74aa;font-weight:700;">Digital Long View</div>'
        . '<div style="margin-top:8px;font-size:22px;font-weight:700;color:#07070d;letter-spacing:-.01em;">' . esc($title) . '</div>'
        . '</td></tr>'
        // Body
        . '<tr><td style="padding:14px 36px 30px;">' . $bodyHtml . '</td></tr>'
        // Footer
        . '<tr><td style="padding:18px 36px 28px;border-top:1px solid #eee2e4;">'
        . '<div style="font-size:13px;color:#6a6472;font-style:italic;font-family:Georgia,serif;">' . esc($tagline) . '</div>'
        . '<div style="margin-top:8px;font-size:12px;color:#9a93a4;">'
        . '<a href="mailto:info@digitallongview.com" style="color:#5d4684;text-decoration:none;">info@digitallongview.com</a>'
        . ' &nbsp;·&nbsp; +49 151 4144 1262'
        . '</div>'
        . '<div style="margin-top:10px;font-size:11px;color:#b7b0c0;">© ' . $year . ' Digital Long View</div>'
        . '</td></tr>'
        . '</table></td></tr></table></body></html>';
}

/** HTML-escape Kurzform. */
function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

/** RFC-2047-Kodierung für Header mit Nicht-ASCII (Betreff, Anzeigenamen). */
function mime_header(string $s): string
{
    return preg_match('/[^\x20-\x7e]/', $s)
        ? '=?UTF-8?B?' . base64_encode($s) . '?='
        : $s;
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimaler SMTP-Client (STARTTLS / implizites TLS, AUTH LOGIN)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verschickt eine multipart/alternative-Mail (Text + HTML).
 * Wirft bei jedem Protokollfehler eine RuntimeException.
 */
function smtp_send(array $cfg, string $toEmail, string $toName, string $subject, string $html, string $text, ?string $replyTo = null, ?string $replyToName = null): void
{
    $host   = (string)($cfg['smtp_host'] ?? '');
    $port   = (int)($cfg['smtp_port'] ?? 587);
    $secure = (string)($cfg['smtp_secure'] ?? 'tls');
    $user   = (string)($cfg['smtp_user'] ?? '');
    $pass   = (string)($cfg['smtp_pass'] ?? '');
    $fromEmail = (string)($cfg['from_email'] ?? $user);
    $fromName  = (string)($cfg['from_name'] ?? 'Digital Long View');

    $transport = $secure === 'ssl' ? "ssl://$host" : $host;
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true]]);
    $conn = @stream_socket_client("$transport:$port", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$conn) {
        throw new RuntimeException("connect failed: $errstr ($errno)");
    }
    stream_set_timeout($conn, 15);

    $read = function () use ($conn): array {
        $data = '';
        while (($line = fgets($conn, 515)) !== false) {
            $data .= $line;
            // Mehrzeilige Antworten: "250-" = weitere folgen, "250 " = Ende.
            if (strlen($line) >= 4 && $line[3] === ' ') break;
        }
        $code = (int)substr($data, 0, 3);
        return [$code, $data];
    };
    $cmd = function (string $c) use ($conn, $read): array {
        fwrite($conn, $c . "\r\n");
        return $read();
    };
    $expect = function (array $res, array $okCodes, string $stage): void {
        if (!in_array($res[0], $okCodes, true)) {
            throw new RuntimeException("SMTP $stage: " . trim($res[1]));
        }
    };

    $expect($read(), [220], 'greeting');
    $ehloHost = $_SERVER['SERVER_NAME'] ?? 'localhost';
    $expect($cmd("EHLO $ehloHost"), [250], 'ehlo');

    if ($secure === 'tls') {
        $expect($cmd('STARTTLS'), [220], 'starttls');
        if (!stream_socket_enable_crypto($conn, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('TLS handshake failed');
        }
        $expect($cmd("EHLO $ehloHost"), [250], 'ehlo-tls');
    }

    if ($user !== '') {
        $expect($cmd('AUTH LOGIN'), [334], 'auth');
        $expect($cmd(base64_encode($user)), [334], 'auth-user');
        $expect($cmd(base64_encode($pass)), [235], 'auth-pass');
    }

    $expect($cmd('MAIL FROM:<' . $fromEmail . '>'), [250], 'mail-from');
    $expect($cmd('RCPT TO:<' . $toEmail . '>'), [250, 251], 'rcpt-to');
    $expect($cmd('DATA'), [354], 'data');

    $boundary = 'dlv-' . bin2hex(random_bytes(8));
    $date = date('r');
    $msgId = '<' . bin2hex(random_bytes(12)) . '@digitallongview.com>';

    $headers = [
        'Date: ' . $date,
        'Message-ID: ' . $msgId,
        'From: ' . mime_header($fromName) . ' <' . $fromEmail . '>',
        'To: ' . mime_header($toName) . ' <' . $toEmail . '>',
        'Subject: ' . mime_header($subject),
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    if ($replyTo) {
        $headers[] = 'Reply-To: ' . mime_header($replyToName ?? '') . ' <' . $replyTo . '>';
    }

    $body = '--' . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text)) . "\r\n"
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html)) . "\r\n"
        . '--' . $boundary . "--\r\n";

    // Dot-Stuffing: Zeilen, die mit "." beginnen, escapen.
    $data = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    $data = preg_replace('/^\./m', '..', $data);

    fwrite($conn, $data . "\r\n.\r\n");
    $expect($read(), [250], 'data-end');

    @fwrite($conn, "QUIT\r\n");
    fclose($conn);
}
