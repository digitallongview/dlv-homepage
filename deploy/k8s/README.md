# Cluster-Deploy: Mail-Endpoint (k3s)

`dlv-dedicated` ist **kein LAMP-Server**, sondern ein **k3s-Cluster mit openDesk**.
Die Homepage wird vom statischen Deployment `dlv-web` (nginx-unprivileged) im
Namespace `web` ausgeliefert. PHP gibt es dort nicht — deshalb läuft der
Mail-Endpoint als eigenes Deployment `dlv-mail`.

> Hinweis: `docs/nginx-snippet.conf` beschreibt ein generisches LAMP-Setup und
> wird in dieser k3s-Installation **nicht** verwendet. Maßgeblich ist dieser
> Ordner.

## Komponenten

| Objekt | Zweck |
| --- | --- |
| `dlv-mail.yaml` | Deployment `dlv-mail` (php:8.3-cli, `php -S`) + Service `:8080`. Mountet `/var/www/dlv-homepage` (ro) → bekommt `api/contact.php` über den normalen Homepage-Deploy. |
| `dlv-homepage-ingress.yaml` | Ingress: `/api/contact.php` → `dlv-mail`, `/` → `dlv-web`. `proxy-body-size: 8m` für Funnel-Bilder. |
| Secret `dlv-mail-config` | `contact.config.php` (SMTP-Ziel), gemountet nach `/cfg`, referenziert via `CONTACT_CONFIG`. **Nicht im Repo** (auf dem Server erzeugt). |

## SMTP

Versand über den internen openDesk-Postfix **ohne Login**:
`postfix-smtp.opendesk.svc.cluster.local:25`. Das Pod-Netz (`10.42.0.0/24`) liegt
in Postfix `mynetworks` (`10.0.0.0/8`) → `permit_mynetworks` erlaubt Relay (auch
an externe Empfänger), und der `opendesk-dkimpy-milter` signiert ausgehend per
DKIM. Kein Passwort nötig.

## Secret anlegen / aktualisieren (auf dem Server)

```sh
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
cat > /tmp/contact.config.php <<'PHP'
<?php
return [
    'smtp_host'   => 'postfix-smtp.opendesk.svc.cluster.local',
    'smtp_port'   => 25,
    'smtp_secure' => '',           // interner Relay, kein TLS/Login
    'smtp_user'   => '',
    'smtp_pass'   => '',
    'from_email'  => 'info@digitallongview.com',
    'from_name'   => 'Digital Long View',
    'to_email'    => 'info@digitallongview.com',
    'to_name'     => 'Digital Long View',
    'allowed_origins' => ['https://digitallongview.com', 'https://www.digitallongview.com'],
];
PHP
kubectl -n web create secret generic dlv-mail-config \
  --from-file=contact.config.php=/tmp/contact.config.php \
  --dry-run=client -o yaml | kubectl apply -f -
rm -f /tmp/contact.config.php
kubectl -n web rollout restart deploy/dlv-mail   # nach Config-Änderung
```

## Anwenden

```sh
kubectl apply -f dlv-mail.yaml
kubectl apply -f dlv-homepage-ingress.yaml
kubectl -n web rollout status deploy/dlv-mail
```

## Smoke-Test

```sh
curl -sS -X POST https://digitallongview.com/api/contact.php \
  -H 'Content-Type: application/json' -H 'Origin: https://digitallongview.com' \
  -d '{"type":"contact","name":"Test","email":"info@digitallongview.com","message":"Test","lang":"de"}'
# → {"ok":true}  (Mail an info@ + Auto-Antwort)
```

Hinweis: Der ClamAV-Milter weist pathologische Mini-/Fake-Bilder als
„problematic content" ab (`send_failed`). Echte Fotos passieren normal.
