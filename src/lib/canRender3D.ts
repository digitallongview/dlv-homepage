/**
 * Entscheidet EINMAL, synchron, ob der schwere WebGL-Hero (three/r3f/drei + Canvas +
 * GLB) geladen werden darf — oder ob ein statisches Poster ausgeliefert wird.
 *
 * Gegatet werden nur *fragile* Profile (GPU-OOM-/Ruckel-/Datenschutz-Risiko):
 *   - prefers-reduced-motion: reduce   (Nutzerpräferenz)
 *   - Save-Data                        (Datensparmodus)
 *   - deviceMemory < 4 GB              (nur Chromium liefert das; default 8 = großzügig)
 *   - kein WebGL                       (Kontext lässt sich nicht erzeugen)
 *
 * Bewusst NICHT gegatet wird allein auf Phone-Viewport — leistungsfähige Phones
 * behalten das 3D (der GLB ist nach der Textur-Kompression nur noch ~1,6 MB).
 * Wer alle Phones auf das Poster schicken will, ergänzt:
 *   if (window.matchMedia('(max-width: 559px)').matches) return false
 *
 * URL-Overrides zum Testen: ?poster erzwingt das Poster, ?force3d erzwingt 3D.
 */
export function canRender3D(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.has('poster')) return false
    if (params.has('force3d')) return true

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean }
      deviceMemory?: number
    }
    if (nav.connection?.saveData) return false
    if ((nav.deviceMemory ?? 8) < 4) return false

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    return !!gl
  } catch {
    return false
  }
}
