# Spec: Skill `video-hls` — Videos für Web-Auslieferung sequenzieren (HLS / EXTM3U)

**Datum:** 2026-06-21
**Status:** Genehmigt (Brainstorming), wartet auf Spec-Review

## Ziel

Ein eigenständiges Claude-Code-**Plugin** `video-hls` (Skill + Node-Script +
`/video-hls`-Command), das ein einzelnes Quellvideo (`.mp4`/`.webm`)
entgegennimmt und es für die Web-Auslieferung als **HLS** (Adaptive Bitrate,
`#EXTM3U`-Playlists, fMP4/CMAF-Segmente) aufbereitet. Pro Video wird ein eigener
Ausgabeordner angelegt, der eine Master-Playlist, die Codec-/Auflösungs-Varianten,
ein Poster-Bild und ein Embed-Snippet enthält.

## Nicht-Ziele (YAGNI)

- Keine Batch-Verarbeitung ganzer Verzeichnisse (ein Video pro Lauf).
- Kein DRM / keine Verschlüsselung.
- Kein Low-Latency-HLS, kein Live-Streaming.
- Kein Upload/Deploy — die Skill erzeugt nur lokale Artefakte.
- Keine projektspezifische Player-Komponente (nur ein generisches Embed-Snippet).

## Kontext / Annahmen

- **Plattform:** Windows 11, PowerShell + Git Bash. Bash-Tool ist POSIX.
- **ffmpeg 7.0.2 Full-Build** (Chocolatey) ist im PATH — inkl. `libx264`, `libsvtav1`,
  `libx265`, NVENC (`h264_nvenc`, `hevc_nvenc`), AAC. `ffprobe` ebenfalls vorhanden.
- **Node.js** ist verfügbar (Projekt nutzt Vite/pnpm). Das Skript nutzt ausschließlich
  Node-Bordmittel (`node:child_process`, `node:fs`, `node:path`) — **keine npm-Deps**.
- RAM-Budget: Encoding läuft **sequentiell** je Rung/Codec (CPU/GPU-bound, geringer
  RAM-Bedarf), bleibt klar unter 24 GB.

## Architektur

### Komponenten

1. **`SKILL.md`** — Frontmatter (`name`, `description`, `version`) + Bedienungsanleitung:
   wann triggern, Aufruf-Syntax, Flags, Output-Struktur, Embed-Hinweise. Beschreibt, dass
   Claude das Node-Skript mit den passenden Argumenten ausführt.
2. **`scripts/hls.mjs`** — eigenständiges, dependency-freies Node-Skript. Orchestriert
   `ffprobe` (Analyse) und `ffmpeg` (Encode/Package) und schreibt die Master-Playlist
   sowie Poster und Embed-Snippet selbst.
3. **`references/embed.md`** (optional, bei Bedarf) — ausführlichere Einbettungs-Doku
   (hls.js, `<video>`-Attribute, Caching/MIME-Hinweise).

### Speicherort

- Plugin-Root: `C:\Users\buche\.claude\plugins\video-hls\` (eigenes Git-Repo, lokal
  via `/plugin marketplace add` + `/plugin install` installierbar).
- Script: `<plugin>/skills/video-hls/scripts/hls.mjs`.
- Aufruf: `/video-hls <input> <outdir> [flags]` oder direkt
  `node "${CLAUDE_PLUGIN_ROOT}/skills/video-hls/scripts/hls.mjs" <input> <outdir> [flags]`

## Schnittstelle (CLI des Skripts)

```
node hls.mjs <input> <outdir> [flags]
```

| Argument / Flag      | Default              | Bedeutung |
|----------------------|----------------------|-----------|
| `<input>`            | — (Pflicht)          | Pfad zur Quelle (`.mp4`/`.webm`). |
| `<outdir>`           | — (Pflicht)          | Zielverzeichnis; es wird ein Unterordner `<videoname>/` angelegt. |
| `--mode`             | `background`         | `background` (kein Audio, loop/autoplay-optimiert) \| `content` (AAC-Audio). |
| `--codecs`           | `avc,av1`            | Komma-Liste: `avc`, `av1`, `hevc`. `avc` ist immer Fallback. |
| `--gpu`              | aus                  | Nutzt NVENC (`h264_nvenc`/`hevc_nvenc`) statt CPU-Encoder. AV1 bleibt CPU (`libsvtav1`), außer NVENC-AV1 ist verfügbar. |
| `--ladder`           | aus Quelle abgeleitet| Override, z. B. `1080,720,480` (Höhen in px). |
| `--seg`              | `4`                  | Segmentlänge in Sekunden. |
| `--poster`           | `0`                  | Zeitstempel (s) für das Poster-Frame. |
| `--name`             | aus Dateiname        | Override für den Ordnernamen (sanitisiert). |

Fehlende Pflichtargumente, fehlendes `ffmpeg`/`ffprobe` oder eine nicht lesbare Quelle
→ klare Fehlermeldung + Exit-Code ≠ 0.

## Datenfluss

1. **Vorprüfung:** `ffmpeg`/`ffprobe` im PATH? Input existiert & ist Video?
2. **Probe (`ffprobe -print_format json`):** Breite, Höhe, FPS, Dauer, Audio-Spur ja/nein,
   Quell-Bitrate.
3. **Leiter bestimmen:** Standard-Rungs `1080/720/480/360`, gefiltert auf
   `≤ Quellhöhe` (**kein Upscaling**); via `--ladder` überschreibbar. Pro Rung eine
   Ziel-Bitrate (Tabelle im Skript, z. B. 1080p≈5 Mbit/s AVC, AV1 ~40 % weniger).
4. **Ordner anlegen:** `<outdir>/<name>/` (+ Unterordner je Codec/Rung, ggf. `audio/`).
5. **Keyframe-Alignment:** `-g <fps*seg>`, `-keyint_min <fps*seg>`, `-sc_threshold 0`,
   `-force_key_frames "expr:gte(t,n_forced*<seg>)"` — identisch über alle Rungs/Codecs,
   damit ABR-Switching sauber an Segmentgrenzen passiert.
6. **Encode + Package je (Codec, Rung):** ein `ffmpeg`-Lauf erzeugt CMAF/fMP4
   (`-hls_segment_type fmp4`, `-hls_playlist_type vod`) → `init.mp4`, `seg-XXXXX.m4s`,
   `<rung>.m3u8`. Modus `background` → `-an`. Modus `content` → einmalig eine separate
   AAC-Audio-Rendition (`audio/audio.m3u8`).
7. **Master-Playlist `master.m3u8` (handgeschrieben):** je Variante ein
   `#EXT-X-STREAM-INF` mit `BANDWIDTH`, `AVERAGE-BANDWIDTH`, `RESOLUTION`, `CODECS`
   (korrekte Codec-Strings: AVC `avc1.*`, AV1 `av01.*`, HEVC `hvc1.*`), im
   `content`-Modus zusätzlich `#EXT-X-MEDIA:TYPE=AUDIO` + `AUDIO="aud"`-Verknüpfung.
8. **Poster:** `ffmpeg -ss <poster> -i <input> -frames:v 1` → `poster.jpg`.
9. **Embed-Snippet `embed.html`:** `<video controls poster muted? loop? playsinline>` +
   kurzer hls.js-Init (für Chrome/Firefox; Safari spielt HLS nativ).

## Output-Struktur

```
<outdir>/<name>/
  master.m3u8            # #EXTM3U Master (Multi-Codec, Multi-Auflösung)
  poster.jpg
  embed.html
  avc/
    1080p/  init.mp4  seg-00001.m4s …  1080p.m3u8
    720p/   …
    480p/   …
  av1/
    1080p/  …
  audio/                 # nur bei --mode content
    audio.m3u8  init.mp4  seg-*.m4s
```

## Fehlerbehandlung

- Fehlendes `ffmpeg`/`ffprobe` → Hinweis auf Installation, Exit ≠ 0.
- Nicht existierende/unlesbare Quelle, 0 Video-Streams → Fehler.
- Ziel-Unterordner existiert bereits → Abbruch mit Hinweis (oder `--force` zum
  Überschreiben; im Plan zu entscheiden).
- Ein fehlschlagender `ffmpeg`-Lauf bricht den Gesamtlauf ab; Teil-Artefakte werden
  benannt, damit nachvollziehbar ist, wo es scheiterte.
- `content`-Modus, aber Quelle hat keine Audiospur → automatischer Fallback auf
  `background`-Verhalten (kein Audio) mit Warnhinweis.

## Test-/Verifikationsstrategie

- **Probe-Logik** an Beispiel-`ffprobe`-JSON (Fixture) testen: korrekte Leiter,
  kein Upscaling, Audio-Erkennung.
- **Smoke-Test:** kurzes Testvideo (z. B. 5 s, via `ffmpeg testsrc`/`lavfi` erzeugen)
  → Skript laufen lassen → prüfen: Ordner existiert, `master.m3u8` beginnt mit
  `#EXTM3U`, referenzierte Varianten-Playlists & Segmente vorhanden, `poster.jpg` da.
- **Master-Validität:** `ffprobe master.m3u8` listet alle Programme/Streams ohne Fehler.
- **Wiedergabe-Check (manuell, optional):** `embed.html` lokal serven, Wechsel der
  Renditionen beobachten.

## Offene Punkte für die Plan-Phase

- Genaue Bitraten-Tabelle pro Rung/Codec.
- `--force`-Verhalten bei existierendem Zielordner.
- NVENC-AV1-Erkennung (RTX 40+) vs. CPU-Fallback.
- Ob `references/embed.md` separat nötig ist oder das Inline-Snippet reicht.
