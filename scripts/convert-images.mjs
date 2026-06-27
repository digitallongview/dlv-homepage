/**
 * Einmal-Bild-Pipeline (Phase 2 der PERF-OPTIMIZATION.md).
 *
 * Verkleinert die überdimensionierten Raster-Assets auf eine sinnvolle Anzeige-
 * Obergrenze (@~2× für Retina) und re-encodiert sie als WebP. Jede Datei wird nur
 * ersetzt, wenn das Ergebnis WIRKLICH kleiner ist ("keep-if-smaller") — so kann
 * der Lauf nie etwas verschlimmern und ist idempotent. Originale werden vor dem
 * Überschreiben nach <scratchpad>/img-backup/ gesichert.
 *
 * Aufruf:  node scripts/convert-images.mjs            (schreibt)
 *          node scripts/convert-images.mjs --dry      (nur Bericht, keine Writes)
 *
 * Caps stammen aus den tatsächlichen CSS-Anzeigebreiten (Hero clamp(…,320px),
 * Leistungs-Icons col-span-4 ≈ 360–390px, Footer-Logos h-[90px]/max-h-[54px]).
 */
import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const DRY = process.argv.includes('--dry')
const ASSETS = 'public/assets'
const BACKUP =
  'C:/Users/buche/AppData/Local/Temp/claude/W--digitallongview-dlv-landing/2d04b384-7975-40bd-a5ea-a8316e18d092/scratchpad/img-backup'

// file → { maxW?/maxH? = Anzeige-Obergrenze (fit inside, kein Upscale), q = WebP-Qualität }
const PLAN = [
  // ── Hero / Marken-Logo (max 320px Anzeige) ──
  { file: 'logo.webp', maxW: 640, q: 86 },

  // ── Footer-Partner-Logos ──
  { file: 'LTAP_Logo.webp', maxH: 200, q: 82 }, // h-[90px] → @2x 180px hoch
  { file: 'mglogo.webp', maxW: 260, q: 82 }, // max-h-[54px], w-full Zelle ~ <120px

  // ── Leistungs-Icons (col-span-4 ≈ 360–390px Desktop, 357px Mobil → @2x ~760) ──
  { file: 'Artefact.webp', maxW: 760, q: 80 }, // 62%-Spalte, aber Quelle nur 394 → reine Rekompression
  { file: 'Graphics.webp', maxW: 760, q: 80 },
  { file: 'clock.webp', maxW: 760, q: 80 },
  { file: 'Joystick.webp', maxW: 760, q: 80 },
  { file: 'RetroPC.webp', maxW: 760, q: 80 },
  { file: 'Megaphone.webp', maxW: 760, q: 80 },
  { file: 'XR-Media.webp', maxW: 760, q: 80 },

  // ── Portfolio-/Mockup-Hintergründe (full-bleed, object-cover) ──
  { file: 'pacelayer.webp', maxW: 1600, q: 70 },
  { file: 'vr-lab-benz.webp', maxW: 1600, q: 74 },
  { file: 'vr-lab-rover.webp', maxW: 1600, q: 74 },
  { file: 'background-vrlab.webp', maxW: 1600, q: 74 },
  { file: 'bg-sophienkirche.webp', maxW: 1440, q: 74 },
  { file: 'bg-sophienkirche-altar.webp', maxW: 1440, q: 74 },
  { file: 'bg-langzeitdesign.webp', maxW: 1440, q: 74 },
  { file: 'bg-zeitpyramide.webp', maxW: 1440, q: 74 },
  { file: 'bg-sophienkriche-glocke.webp', maxW: 886, q: 76 },
  { file: 'pc-mockup.webp', maxW: 1400, q: 80 },
  { file: 'vrglasses.webp', maxW: 1400, q: 80 },

  // ── Team-Portraits / Detailbilder ──
  { file: 'Domi.webp', maxW: 500, q: 82 },
  { file: 'Johan.webp', maxW: 500, q: 82 },
  { file: 'Lukas.webp', maxW: 500, q: 82 },
  { file: 'domi-bild.webp', maxW: 500, q: 82 },
  { file: 'johann-bild.webp', maxW: 500, q: 82 },
  { file: 'lukas-bild.webp', maxW: 500, q: 82 },
  { file: 'telescope.webp', maxW: 640, q: 82 },
  { file: 'cone-left.webp', maxW: 720, q: 82 },
  { file: 'cone-right.webp', maxW: 720, q: 82 },
  { file: 'fil-smartphone.webp', q: 80 }, // 484×232 — passt schon, nur rekomprimieren
]

const kib = (n) => (n / 1024).toFixed(1).padStart(7) + ' KiB'

async function run() {
  if (!DRY) await fs.mkdir(BACKUP, { recursive: true })
  let before = 0
  let after = 0
  let saved = 0
  let replaced = 0
  const rows = []

  for (const item of PLAN) {
    const p = path.join(ASSETS, item.file)
    let input
    try {
      // Komplett in den Speicher lesen, damit libvips keinen Handle auf dem Pfad
      // hält — sonst scheitert das spätere Überschreiben unter Windows (EUNKNOWN).
      input = await fs.readFile(p)
    } catch {
      rows.push(`  ??.? KiB  FEHLT        ${item.file}`)
      continue
    }
    const origBytes = input.length
    const meta = await sharp(input).metadata()

    let pipe = sharp(input)
    if (item.maxW || item.maxH) {
      pipe = pipe.resize({
        width: item.maxW,
        height: item.maxH,
        fit: 'inside',
        withoutEnlargement: true,
      })
    }
    const buf = await pipe.webp({ quality: item.q, effort: 6 }).toBuffer()
    const newMeta = await sharp(buf).metadata()

    before += origBytes
    const win = buf.length < origBytes
    if (win) saved += origBytes - buf.length

    const dimChange =
      newMeta.width !== meta.width || newMeta.height !== meta.height
        ? `${meta.width}x${meta.height}→${newMeta.width}x${newMeta.height}`
        : `${meta.width}x${meta.height}`

    if (win && !DRY) {
      await fs.copyFile(p, path.join(BACKUP, item.file))
      await fs.writeFile(p, buf)
      replaced++
      after += buf.length
    } else {
      after += win ? buf.length : origBytes
      if (win) replaced++
    }

    rows.push(
      `${kib(origBytes)} → ${kib(buf.length)}  ${win ? '✓' : '·'}  ${dimChange.padEnd(20)}  ${item.file}`,
    )
  }

  console.log(`\n${DRY ? '[DRY-RUN] ' : ''}Bild-Pipeline — ${PLAN.length} Dateien geprüft\n`)
  console.log('  vorher  →  nachher   ok  Maße                  Datei')
  console.log('  ' + '-'.repeat(78))
  for (const r of rows) console.log('  ' + r)
  console.log('  ' + '-'.repeat(78))
  console.log(
    `  Σ ${kib(before)} → ${kib(after)}   ersetzt: ${replaced}/${PLAN.length}   Einsparung: ${kib(saved)} (${((saved / before) * 100).toFixed(1)}%)`,
  )
  if (!DRY) console.log(`\n  Originale gesichert: ${BACKUP}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
