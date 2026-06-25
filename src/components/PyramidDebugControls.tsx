import { useEffect, useRef } from 'react'
import { Leva, useControls, button } from 'leva'
import { ENV_PRESETS } from './PyramidScene'
import type { SceneControls, AdvControls, EnvPreset } from './PyramidScene'

function formatValues(o: Record<string, unknown>): string {
  const lines = Object.entries(o).map(([k, v]) => {
    if (typeof v === 'number') return `  ${k}: ${Number(v.toFixed(3))},`
    if (typeof v === 'string') return `  ${k}: '${v}',`
    return `  ${k}: ${JSON.stringify(v)},`
  })
  return `{\n${lines.join('\n')}\n}`
}

type Props = {
  onScene: (s: SceneControls) => void
  onAdv: (a: AdvControls) => void
  onReplay: () => void
}

/**
 * leva-Debug-Panel — nur bei `?debug` gemountet und als eigener Lazy-Chunk gebaut.
 * Hält die komplette leva-Dependency aus dem eager Hero-Bundle heraus und spiegelt
 * die Live-Werte über onScene/onAdv zurück in die PyramidScene. Die hier gesetzten
 * `value`-Defaults müssen mit SCENE_DEFAULTS/ADV_DEFAULTS in PyramidScene.tsx
 * übereinstimmen.
 */
export default function PyramidDebugControls({ onScene, onAdv, onReplay }: Props) {
  const valuesRef = useRef<Record<string, unknown>>({})

  const scene = useControls(
    'Scene',
    {
      camY: { value: 2.5, min: -5, max: 10, step: 0.05, label: 'Cam Y' },
      camZ: { value: 4.2, min: 1, max: 30, step: 0.1, label: 'Cam Z' },
      lookY: { value: 0.8, min: -3, max: 5, step: 0.05, label: 'Look Y' },
      fov: { value: 62, min: 15, max: 90, step: 1, label: 'FOV' },
      modelY: { value: 0, min: -5, max: 10, step: 0.05, label: 'Model Y' },
      rotationSpeed: { value: 0.18, min: 0, max: 2, step: 0.01, label: 'Rotate Speed' },
      Replay: button(() => onReplay()),
      'Copy as defaults': button(() => {
        const text = formatValues(valuesRef.current)
        navigator.clipboard
          .writeText(text)
          .then(() => console.info('[leva] copied:\n' + text))
          .catch(() => console.warn('[leva] clipboard write failed:\n' + text))
      }),
    },
    { collapsed: false },
  )

  const adv = useControls(
    'Advanced',
    {
      autoRotate: { value: false, label: 'Auto-Rotate' },
      dropEnabled: { value: true, label: 'Drop' },
      animationEnabled: { value: true, label: 'GLB Animation' },
      animationSpeed: { value: 1.5, min: 0, max: 3, step: 0.05, label: 'Anim Speed' },
      ambient: { value: 0.55, min: 0, max: 3, step: 0.05, label: 'Ambient' },
      dir: { value: 1.1, min: 0, max: 4, step: 0.05, label: 'Directional' },
      dirAzimuth: { value: 35, min: -180, max: 180, step: 1, label: 'Sun Az (°)' },
      dirElevation: { value: 55, min: 0, max: 90, step: 1, label: 'Sun El (°)' },
      envPreset: {
        value: 'city' as EnvPreset,
        options: ENV_PRESETS as unknown as string[],
        label: 'Env',
      },
      envIntensity: { value: 1.0, min: 0, max: 3, step: 0.05, label: 'Env Intensity' },
      orbitControls: { value: false, label: 'Orbit Drag' },
      showAxes: { value: false, label: 'Axes' },
      showGrid: { value: false, label: 'Grid (y=0)' },
      showStats: { value: false, label: 'FPS' },
    },
    { collapsed: true },
  )

  useEffect(() => {
    valuesRef.current = { ...scene, ...adv }
  }, [scene, adv])

  useEffect(() => {
    onScene({
      camY: scene.camY,
      camZ: scene.camZ,
      lookY: scene.lookY,
      fov: scene.fov,
      modelY: scene.modelY,
      rotationSpeed: scene.rotationSpeed,
    })
  }, [scene, onScene])

  useEffect(() => {
    onAdv({
      autoRotate: adv.autoRotate,
      dropEnabled: adv.dropEnabled,
      animationEnabled: adv.animationEnabled,
      animationSpeed: adv.animationSpeed,
      ambient: adv.ambient,
      dir: adv.dir,
      dirAzimuth: adv.dirAzimuth,
      dirElevation: adv.dirElevation,
      envPreset: adv.envPreset as EnvPreset,
      envIntensity: adv.envIntensity,
      orbitControls: adv.orbitControls,
      showAxes: adv.showAxes,
      showGrid: adv.showGrid,
      showStats: adv.showStats,
    })
  }, [adv, onAdv])

  return <Leva collapsed={false} oneLineLabels={false} />
}
