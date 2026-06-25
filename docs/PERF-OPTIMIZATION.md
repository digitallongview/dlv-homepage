# Performance-Optimierung — dlv-landing

> Verifizierter Fahrplan aus dem Multi-Agent-Audit (10 Dimensionen, 50 Funde, 24 critical/high
> adversarial gegengeprüft → 22 bestätigt, 1 abgelehnt). Reihenfolge: Ladezeit (LCP, Transfer,
> Start-Render) zuerst, dann Laufzeit-Smoothness. Status-Checkboxen werden während der Umsetzung gepflegt.

**Geschätzte Wirkung:** ~30 MB weniger Transfer pro Desktop-Vollbesuch (mobil ~18–20 MB via Poster)
+ ~5 GB CI-/Deploy-Reduktion (Hygiene, kein Per-Visit-Effekt).

## Größte Hebel (mit Zahlen)
1. **GLB-Texturen 4K→1K WebP:** 18,1 MB → ~3–4 MB (−14,5 MB, ~80 %); VRAM 447 MB → ~28 MB. Geometrie ist
   bereits Draco-komprimiert (60 Primitives) — nur Texturen verkleinern, **kein** Re-Draco.
2. **Bilder → AVIF/WebP:** schwerster Pfad ~15–20 MB → ~1,5–3 MB (−13 MB).
3. **WebGL-Hero auf Mobil/Save-Data/reduced-motion gaten** + Poster: −18–20 MB + 447 MB VRAM, beseitigt GPU-OOM/Tab-Crash-Klasse.
4. **Build-Brotli/Gzip-Precompression:** First-Paint-JS/CSS 1,55 MB → ~361 KB (nur wirksam, wenn Host `.br` ausliefert).
5. **leva-Dev-GUI (+ drei `<Stats>`) aus dem eager Hero-Chunk:** −204 KB raw / −68 KB gzip; behebt nebenbei die IDE-TS-Fehler.

## Quick Wins (risikoarm)
- [x] **Fontshare-CSS entfernt** + lokales Satoshi-woff2 preloaded (`index.html`) — −1 render-blocking 3rd-party-Request.
- [x] **favicon.svg bereitgestellt** (`public/favicon.svg` aus ZPlogo.svg) — 404 pro Load weg.
- [x] **Draco-Decoder self-hosten** statt gstatic.com (`useGLTF.setDecoderPath('/draco/')`, WASM+wrapper+asm.js nach `public/draco/`). *(Runtime im Browser prüfen: keine gstatic-Anfrage.)*
- [ ] **drei `<Environment preset='city'>`** (CDN-HDRI ~1,5 MB) → Hemisphere-Light / self-hosted env. *(Lichtänderung — visuell prüfen.)*
- [ ] **Hero-Logo** auf 640px + WebP/AVIF (−145 KB). Kein high-prio-Preload (liegt opacity:0 hinter dem GLB).
- [ ] **rsync-Deploy härten:** expliziter Docroot statt `:` (Datenverlust durch `--delete`!), `-z` für inkompressible Medien droppen. *(Docroot vom User nötig.)*
- [ ] **Tote `<source>`-MP4-Fallbacks** (404) aus Portfolio entfernen; ZP-Player `preload='none'`.
- [ ] **Hero-Headline-Glow:** animierten `drop-shadow()`-Blur (LCP-Element) → opacity-only (compositor).
- [ ] **Mobile Sophienkirche-Loop:** `preload: active` statt sofort (−~3 MB beim Mobil-Load).

## Phase 1 — Hero-3D-Payload
- [x] **GLB: 5 Texturen 4K→1K (WebP), Draco re-applied — `18,15 MB → 1,56 MB (−91 %)`.** Verifiziert: nodes 240=240, mesh-nodes 118=118, Anim_0 117 Kanäle=117, bbox-Höhe 57.711 identisch, VRAM ~447→~28 MB. `dedup` teilt identische Stein-Geometrien (118→2 unique meshes), Nodes bleiben einzeln → Drop-Animation intakt. In-place ersetzt (gleicher Name, kein Code-Change); Original in LFS-History + Backup im Scratchpad. **⚠️ Hero visuell prüfen (Texturschärfe bei 1K, Beleuchtung).** Commands: `gltf-transform optimize … --texture-size 1024 --texture-compress webp --compress draco --simplify/join/flatten/instance/palette false`.
- [x] leva → neues `PyramidDebugControls.tsx` (einziger leva-Import, lazy nur bei `?debug`); getypte `SCENE_DEFAULTS`/`ADV_DEFAULTS` mit **exakt** den bisherigen Werten; aus `optimizeDeps.include` genommen. ✅ **PyramidScene-Chunk 1229→1002 KB; leva (198 KB) lädt nur noch bei `?debug`.** Behebt zugleich die IDE-`unknown`-TS-Fehler. *(Hero visuell prüfen: Kamera/Licht unverändert.)* — Offen: leva nach devDependencies (Lockfile-Churn, später); console-Drop via oxc (Vite 8 = Rolldown, `esbuild.drop` wirkungslos); Vendor-Split verworfen (zog leva eager).

## Phase 2 — Bild-Pipeline (AVIF/WebP)
- [ ] sharp-Prebuild `scripts/convert-images.mjs` → `.avif`(q55)/`.webp`(q80)-Geschwister; Alpha/Line-Art schonen; `<Picture>`-Komponente (reicht className/style/loading an inneres `<img>`).
- [ ] Nur aktives Portfolio-Background rendern (−~5,9 MB); `loading='lazy'`/`decoding='async'` an alle below-fold-`<img>`; width/height gegen CLS.
- [ ] Video-Poster → WebP (cwebp -q72 -resize 640); `poster=` an sichtbare Player; ungenutzte Poster aus dem Deploy.

## Phase 3 — Adaptiver Hero
- [ ] WebGL-Gate: **eager `import('./PyramidScene')` (HeroSection.tsx:7) UND module-scope `useGLTF.preload` gaten** — sonst lädt das GLB trotzdem. Flag synchron aus matchMedia(reduced-motion) + saveData + deviceMemory<4 + Phone-Viewport. Poster + sofort Phase 3.
- [ ] 3D-Import nach LCP via `requestIdleCallback`; `powerPreference:'default'`; `frameloop` demand-Übergang behalten; Keyframe-Resample.

## Phase 4 — Delivery & kritischer Pfad
- [ ] `vite-plugin-compression2` (brotli+gzip, Originale behalten, Medien excludieren).
- [ ] `public/.htaccess` (+ nginx-Doku): hashed Assets immutable 1y, index.html no-cache, `.br/.gz` ausliefern. *(Servertyp nötig.)*
- [ ] `manualChunks` Vendor-Split (react / three / r3f) — bessere Cache-Stabilität bei Redeploys.
- [ ] Font-Subsetting (latin, wght-Range) der 4 woff2 (−45–70 KB); Fallback-Metriken (size-adjust) gegen Swap-CLS; inline Above-the-fold-Greeting in index.html.

## Phase 5 — Repo/CI/Deploy-Hygiene + Video-CDN
- [ ] 4,9 GB HLS aus `public/`/Git → Object-Storage + CDN (CORS!); `hlsSources.ts` auf `VITE_VIDEO_CDN`. *(Infra-Entscheidung.)*
- [ ] Tote Deploy-Assets `git rm`: Font-Quell-Familien (~9,1 MB) + `.zip`, Duplikat-PDF (4,59 MB), verwaiste Bilder (~4,68 MB), Dev-/embed-Artefakte. **Nur die 4 `*-Variable*.woff2` behalten.**

## Phase 6 — Smoothness, Messung, Politur
- [ ] `content-visibility:auto` below-fold; SectionMotivation width-Anim → `transform:scale`; `will-change` transient.
- [ ] esbuild `drop:['console','debugger']` + ES2022-Target; Bundle-Visualizer als Guardrail.
- [ ] Meta/OG/theme-color; web-vitals-RUM; optional Service-Worker/Prerender (Coming-Soon-Seite eignet sich für Prerender).

## Abgelehnt (adversarial widerlegt)
- **GLB-Preload via `modulepreload`/`as=fetch crossorigin`:** three lädt das GLB per Same-Origin-XHR → Risiko eines **zweiten** 18-MB-Fetch + Verdrängung des First Paint. Stattdessen erst Phase 1 (Textur-Kompression). Erst danach ggf. als DevTools-verifizierter Follow-up.

## Offene Entscheidungen
1. Mobile-Hero: fragile Geräte gaten vs. Poster auf allen Phones vs. 3D überall.
2. Bild-Pipeline: sharp-Prebuild + Geschwister committen vs. CI-only vs. manuell.
3. Video 4,9 GB: CDN vs. Origin-nur-aus-Build-lösen vs. vorerst nichts.
4. Webserver (Apache/nginx/CDN, statisches Brotli?) — entscheidet, ob Precompression/Caching greifen.
