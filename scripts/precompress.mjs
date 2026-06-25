// Post-Build: Brotli- + Gzip-Precompression aller statisch komprimierbaren Assets in dist/.
// Nutzt ausschließlich Node-builtin zlib (keine Dependency). Der Webserver liefert die
// .br/.gz-Varianten via `brotli_static`/`gzip_static` aus (siehe docs/nginx-snippet.conf) —
// First-Paint-JS/CSS fällt dadurch auf einem nicht-komprimierenden Host drastisch.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync, brotliCompressSync, constants } from 'node:zlib'

const DIST = 'dist'
// Nur Text-Assets — Medien (webp/png/jpg/woff2/glb/mp4) sind bereits komprimiert.
const EXT = /\.(js|css|html|svg|json|webmanifest|txt|map|xml)$/i
const MIN = 1024 // < 1 KB lohnt nicht

let count = 0, raw = 0, br = 0
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) { walk(p); continue }
    if (!EXT.test(e.name)) continue
    const buf = readFileSync(p)
    if (buf.length < MIN) continue
    writeFileSync(p + '.gz', gzipSync(buf, { level: 9 }))
    const b = brotliCompressSync(buf, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
        [constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
      },
    })
    writeFileSync(p + '.br', b)
    count++; raw += buf.length; br += b.length
  }
}

try {
  statSync(DIST)
} catch {
  console.error('precompress: dist/ fehlt — erst `vite build` ausführen.')
  process.exit(0)
}
walk(DIST)
console.log(`precompress: ${count} Dateien, ${(raw / 1024).toFixed(0)} KB → ${(br / 1024).toFixed(0)} KB brotli (.br + .gz geschrieben)`)
