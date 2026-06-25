# DSGVO-Wissensordner — Zugriffsanleitung für Claude

Dieser Ordner enthält das **vollständige deutsche Datenschutzrecht** als KI-optimierten
Datensatz: **eine Markdown-Datei pro Vorschrift**, mit vorhersagbaren Pfaden. Antworte
Datenschutz-Fragen ausschließlich aus diesen Dateien (nicht aus dem Gedächtnis).

## Effizientes Nachschlagen — in dieser Reihenfolge

1. **Zitat bekannt → Datei direkt lesen (kein Suchen nötig).** Pfad aus dem Zitat bauen:
   - `Art. N DSGVO`         → `dsgvo/art-N.md`              (z. B. Art. 17 → `dsgvo/art-17.md`)
   - `Erwägungsgrund N`     → `erwaegungsgruende/eg-N.md`   (Recital N)
   - `§ N BDSG`             → `bdsg/bdsg-N.md`
   - `§ N <Landescode>`     → `landesrecht/<slug>/<slug>-N.md`  (Slug-Tabelle unten)
   - Buchstaben-Paragraphen (`§ 3a`) → `...-3a.md`
2. **Nur Stichwort/Thema bekannt → suchen, dann gezielt lesen.**
   - `grep` über den Ordner nach dem Begriff (findet die Vorschrift in Sekunden), **oder**
   - `grep` in `INDEX.md` (eine Zeile je Vorschrift: `Titel · Pfad`).
   - Dann **nur** die Treffer-Datei(en) lesen.
3. **Niemals** `_data/provisions.jsonl` oder den ganzen Ordner in den Kontext laden, um
   eine Einzelfrage zu beantworten. Immer nur die konkrete(n) Datei(en) lesen.

## Dateiformat

YAML-Frontmatter + Gesetzestext:
```
---
id: dsgvo-art-6
type: dsgvo_article        # dsgvo_article | recital | bdsg | landesrecht
law: DSGVO
number: 6
title: Rechtmäßigkeit der Verarbeitung
kapitel: Kapitel II – Grundsätze
erwaegungsgruende: [39, 40, ...]   # passende Erwägungsgründe (Querverweis)
bdsg: [3, 4, ...]                  # passende BDSG-Paragraphen (Querverweis)
source: https://dsgvo-gesetz.de/art-6-dsgvo/
---
# Art. 6 DSGVO – Rechtmäßigkeit der Verarbeitung
(1) … Absatz …
  a) … Buchstabe …
(2) ¹Satz 1. ²Satz 2. …
---
Querverweise — Erwägungsgründe: … · BDSG: …
Quelle: <url>
```
**Textkonventionen:** `(1)` = Absatz · `1.` = Nummer/Definition (z. B. Art. 4) ·
`a)` = Buchstabe · `i)` = Unterpunkt · hochgestellte Ziffer (`¹²³`) = Satznummer.
Querverweise stehen getrennt (Frontmatter + Block am Ende), nicht im Gesetzestext.

## Slug-Tabelle Landesrecht (`landesrecht/<slug>/`)

| Slug | Gesetz | Land |
|------|--------|------|
| `baydsg` | BayDSG | Bayern |
| `blndsg` | BlnDSG | Berlin |
| `bbgdsg` | BbgDSG | Brandenburg |
| `bremdsgvoag` | BremDSGVOAG | Bremen |
| `hmbdsg` | HmbDSG | Hamburg |
| `hdsig` | HDSIG | Hessen |
| `dsg-m-v` | DSG M-V | Mecklenburg-Vorpommern |
| `ndsg` | NDSG | Niedersachsen |
| `dsg-nrw` | DSG NRW | Nordrhein-Westfalen |
| `ldsg-rlp` | LDSG RLP | Rheinland-Pfalz |
| `sdsg` | SDSG | Saarland |
| `saechsdsdg` | SächsDSDG | Sachsen |
| `dsag-lsa` | DSAG LSA | Sachsen-Anhalt |
| `ldsg-sh` | LDSG SH | Schleswig-Holstein |
| `thuerdsg` | ThürDSG | Thüringen |
| `ldsg-bw` | LDSG BW | Baden-Württemberg |
| `tdddg` | TDDDG | Bund (ehem. TTDSG) |

## Umfang

99 DSGVO-Artikel · 173 Erwägungsgründe · 86 BDSG-Paragraphen · 827 Landesvorschriften
(16 Bundesländer + TDDDG) = **1.185 Vorschriften**. Quelle: https://dsgvo-gesetz.de/

Programmatischer Zugriff: `_data/provisions.jsonl` (eine Zeile je Datensatz, gleiche
Felder + `path` + `text`), Metadaten in `_data/manifest.json`.
