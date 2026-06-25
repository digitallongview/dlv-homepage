# Design-System — Digital Long View

Knappe Referenz für das visuelle System der Landing Page. Quelle der Wahrheit
für Tokens ist `src/index.css` (`@theme`-Block, Tailwind v4 — keine JS-Config).

---

## Tech-Basis

- **Tailwind v4** mit CSS-`@theme` in `src/index.css`. Alle Tokens sind
  CSS-Custom-Properties und stehen automatisch als Utilities zur Verfügung
  (`bg-cream`, `text-ink`, `text-lavender`, `font-serif` …).
- **React 19 + Vite**, 3D via React-Three-Fiber (`@react-three/fiber` / `drei`).
- **Separater Mobile-Baum** unter `src/components/mobile/` — eigene Komponenten
  und Animationen, aber dieselben Tokens.

---

## Farben

| Token             | Wert                  | Rolle                              |
| ----------------- | --------------------- | ---------------------------------- |
| `ink`             | `#07070d`             | Primärtext, fast-schwarz           |
| `ink-soft`        | `rgba(7, 7, 13, .5)`  | Gedämpfter Text                    |
| `cream`           | `#f7eced`             | Seiten-Hintergrund (warmes Off-White) |
| `lavender`        | `#8c74aa`             | Akzent / Eyebrows                  |
| `lavender-light`  | `#b29bd0`             | Verläufe, Glow                     |
| `lavender-dark`   | `#5d4684`             | Button-Text, Verlaufstiefe         |
| `shadow`          | `#18182640`           | Schattenton                        |

**Hierarchie über Opacity:** statt vieler Grautöne werden Opacity-Stufen auf
`ink` genutzt — `text-ink/75`, `/70`, `/60`, `/25`.

**Marken-Verlauf (Lila):**

```
linear-gradient(120deg, #a991c7 0%, #8c74aa 55%, #6a4f8e 100%)
```

Eingesetzt im Header-Trapez und (als Radial-Gradient `#b29bd0 → #5d4684`) für
die Punkt-Bullets.

---

## Typografie

Zwei Variable Fonts, funktional getrennt:

| Familie    | Token         | Achse     | Einsatz                                  |
| ---------- | ------------- | --------- | ---------------------------------------- |
| **Satoshi** | `font-sans`  | 300–900   | Headlines, UI, Eyebrows, Buttons         |
| **Erode**   | `font-serif` | 300–700   | Fließtext / Editorial, betonte Begriffe  |

Betonungen im Fließtext laufen als `italic font-normal` (Erode), nicht als Bold.

### Skala (durchgängig fluid via `clamp()`)

| Rolle          | Klasse / Wert                                  | Eigenschaften                          |
| -------------- | ---------------------------------------------- | -------------------------------------- |
| Section-Title  | `text-[clamp(28px,4.5vw,44px)]`                | `font-bold`, `tracking-tight`, `leading-[1.08]` |
| Lead-Text      | `text-[clamp(18px,1.9vw,24px)]`                | `font-semibold`, `leading-tight`       |
| Eyebrow        | `text-[11px]`                                  | `uppercase`, `tracking-[0.42em]`, `text-lavender` |
| Body           | `text-[14px]` – `text-[16px]`                  | `leading-[1.6]` – `leading-[1.65]`     |

---

## Wiederkehrende Patterns

- **`SectionHeading`** (`src/components/SectionHeading.tsx`) — Eyebrow + Title +
  Verlaufs-Trennlinie (`from-ink/35 via-ink/10 to-transparent`); `left` oder
  `center`.
- **Text-Links** — `border-b`, `uppercase`, `text-[11px]`, `tracking-[0.25em]`,
  mit Pfeil `→`, der bei Hover via `group-hover:translate-x-1` wandert.
- **CTA-Pill** — `rounded-full bg-white/95`, Lavender-Text (`#5d4684`),
  Schatten-Lift bei Hover.
- **Punkt-Bullet** — `h-3 w-3 rounded-full` mit Radial-Gradient als Feature-Marker.

---

## Layout

- **Content-Container:** `max-w-[1200px]` (Header `max-w-[1320px]`), Padding
  `px-6 sm:px-10`.
- **Fluchtende Full-Width-Reihen:** Bildreihen laufen über die volle Breite,
  Textspalten richten sich per
  `max(24px, calc((100vw - 1200px) / 2 + 40px))` an der Container-Kante aus.
- **Breakpoints:** Tailwind-Defaults plus projektspezifische Grenzen
  (`min-[500px]` Stack→2-Spalten, `md` Nav). Mobile-Logik lebt im separaten
  `mobile/`-Baum (`useIsMobile`).

---

## Motion

Keyframes in `src/index.css`:

| Animation        | Zweck                                            |
| ---------------- | ------------------------------------------------ |
| `fade-up`        | Standard-Einblendung (Opacity + Y-Versatz)       |
| `headline-glow`  | Hero-Headline mit kurzem Lavender-Glow           |
| `cta-shoot-in`   | Mobiler Kontakt-Button „schießt" von unten herein |
| `popup-in`       | Mobile Portfolio-Popups                          |
| `nudge-down`     | Scroll-Hint-Chevron (Auf-und-Ab)                 |

- **Scroll-Reveals** via `IntersectionObserver` + `translateX`/`translateY`-
  Transitions (`duration-[900ms] ease-out`).
- **`prefers-reduced-motion: reduce`** wird respektiert — Animationen und
  Smooth-Scroll werden global deaktiviert.

---

## Geometrie als Marke

- Header sind **Dreieck/Trapez** via `clip-path`-Polygone, die zwischen Zuständen
  morphen (Hero-Trapez `polygon(...)` → kompakte Bar). Beide Polygone haben
  4 Vertices, damit CSS sauber interpoliert.
- **3D-Pyramide** (`PyramidScene`, React-Three-Fiber) greift die Kegel-/Verlaufs-
  Formgebung thematisch auf.

---

## Kurzformel

> Warmes **Cream** + fast-schwarze **Ink** + **Lavendel**-Akzent · Satoshi/Erode
> Sans-/Serif-Paarung · fluide `clamp()`-Typografie · geometrische
> `clip-path`-Header · dezente, `IntersectionObserver`-getriebene Scroll-Reveals.
