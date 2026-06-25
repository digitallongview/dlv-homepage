# Einsetz-Prompt

Nachdem du den Ordner `dsgvo-data/` in ein Projekt kopiert hast, gib Claude einmalig Bescheid.

## Empfohlen (automatisch, dauerhaft)

Füge **eine Zeile** in die `CLAUDE.md` deines Projekts ein (Ordner im Projektwurzelverzeichnis):

```
@dsgvo-data/CLAUDE.md
```

Damit lädt Claude Code das Zugriffsprotokoll automatisch in jeder Session.

## Alternativ (in den Chat einfügen)

Kopiere den folgenden Block in den Chat (oder in die `CLAUDE.md`):

> Dieses Projekt enthält den Ordner `dsgvo-data/` mit dem **vollständigen deutschen
> Datenschutzrecht** (DSGVO, alle 173 Erwägungsgründe, BDSG, alle 16 Landesdatenschutz-
> gesetze + TDDDG) als KI-optimierten Datensatz — **eine Markdown-Datei pro Vorschrift**.
>
> Beantworte Datenschutz-/DSGVO-Fragen **ausschließlich aus diesem Ordner**, nicht aus
> dem Gedächtnis, und **zitiere die Quelle** (Datei + `source`-URL aus der Frontmatter).
>
> Zugriff — effizient, nur die nötige Datei lesen:
> - **Zitat bekannt → Datei direkt lesen:**
>   `Art. N DSGVO` = `dsgvo-data/dsgvo/art-N.md` ·
>   `Erwägungsgrund N` = `dsgvo-data/erwaegungsgruende/eg-N.md` ·
>   `§ N BDSG` = `dsgvo-data/bdsg/bdsg-N.md` ·
>   Landesrecht = `dsgvo-data/landesrecht/<slug>/<slug>-N.md`
>   (Slugs z. B. `ldsg-bw`, `baydsg`, `dsg-nrw`, `tdddg` — Tabelle in `dsgvo-data/CLAUDE.md`).
> - **Nur Stichwort bekannt →** mit `grep` im Ordner oder in `dsgvo-data/INDEX.md` suchen,
>   dann nur die Treffer-Datei(en) lesen.
> - **Niemals** den ganzen Ordner oder `_data/provisions.jsonl` für eine Einzelfrage laden.
>
> Format: `(1)` Absatz · `1.` Nummer · `a)` Buchstabe · `¹²³` Satznummer.
> Details: `dsgvo-data/CLAUDE.md`.
