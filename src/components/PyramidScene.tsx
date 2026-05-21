import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  OrbitControls,
  Stats,
  useAnimations,
  useGLTF,
} from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import * as THREE from 'three'

const GLB_URL = '/3d-assets/Zeitpyramide3D.glb'
useGLTF.preload(GLB_URL)

const TARGET_SIZE = 4

// Drop-Animation-Defaults (hardcoded, kein UI dafür)
const DROP_HEIGHT = 8
const DROP_DURATION = 0.9
const DROP_STAGGER = 1.4
const DROP_DELAY = 0.6

const ENV_PRESETS = [
  'city',
  'sunset',
  'dawn',
  'night',
  'warehouse',
  'forest',
  'apartment',
  'studio',
  'park',
  'lobby',
] as const

type EnvPreset = (typeof ENV_PRESETS)[number]

type PyramidControls = {
  autoRotate: boolean
  rotationSpeed: number
  modelY: number
  animationEnabled: boolean
  animationSpeed: number
  dropEnabled: boolean
  dropHeight: number
  dropDuration: number
  dropStagger: number
  dropDelay: number
  dropTrigger: number
}

type DropItem = {
  mesh: THREE.Object3D
  finalY: number
  delay: number
  jitter: number
}

function Pyramid(ctl: PyramidControls) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(GLB_URL)
  const { actions, names } = useAnimations(animations, group)

  // Berechne autoScale + Offsets so dass die Pyramiden-BASIS bei world y=0 sitzt
  // und das Modell horizontal zentriert ist.
  const { autoScale, offsetX, offsetY, offsetZ } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? TARGET_SIZE / maxDim : 1
    return {
      autoScale: scale,
      offsetX: -center.x * scale,
      offsetY: -box.min.y * scale,
      offsetZ: -center.z * scale,
    }
  }, [scene])

  const dropItems = useRef<DropItem[]>([])
  const dropElapsed = useRef(0)
  const dropDelayRemaining = useRef(0)
  const dropActive = useRef(false)

  useEffect(() => {
    if (!ctl.dropEnabled) {
      dropItems.current.forEach((d) => {
        d.mesh.position.y = d.finalY
      })
      dropActive.current = false
      return
    }
    if (dropItems.current.length === 0) {
      const collected: DropItem[] = []
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          collected.push({
            mesh: o,
            finalY: o.position.y,
            delay: 0,
            jitter: 0,
          })
        }
      })
      collected.sort((a, b) => a.finalY - b.finalY)
      dropItems.current = collected
    }
    const count = dropItems.current.length
    // dropHeight wird im UI als WORLD-Units angegeben — intern in local-space umrechnen.
    const localDrop = ctl.dropHeight / autoScale
    dropItems.current.forEach((d, i) => {
      d.delay = (i / Math.max(1, count - 1)) * ctl.dropStagger
      d.jitter = (Math.random() * 1.5) / autoScale
      d.mesh.position.y = d.finalY + localDrop + d.jitter
    })
    dropDelayRemaining.current = ctl.dropDelay
    dropElapsed.current = 0
    dropActive.current = true
  }, [
    scene,
    autoScale,
    ctl.dropEnabled,
    ctl.dropTrigger,
    ctl.dropHeight,
    ctl.dropDuration,
    ctl.dropStagger,
    ctl.dropDelay,
  ])

  useEffect(() => {
    if (names.length === 0) return
    const action = actions[names[0]]
    if (!action) return
    if (ctl.animationEnabled) {
      action.reset().setEffectiveTimeScale(ctl.animationSpeed).play()
    } else {
      action.stop()
    }
    return () => {
      action.stop()
    }
  }, [actions, names, ctl.animationEnabled, ctl.animationSpeed])

  useFrame((_, delta) => {
    const g = group.current
    if (g && ctl.autoRotate) {
      g.rotation.y += delta * ctl.rotationSpeed
    }

    if (dropActive.current) {
      // Phase 1: Stationäres Warten (Blöcke schweben außerhalb des Viewports).
      if (dropDelayRemaining.current > 0) {
        dropDelayRemaining.current -= delta
        return
      }
      // Phase 2: Fall mit Stagger + Ease-out-cubic.
      dropElapsed.current += delta
      let stillFalling = false
      const localDrop = ctl.dropHeight / autoScale
      for (const d of dropItems.current) {
        const t = (dropElapsed.current - d.delay) / ctl.dropDuration
        if (t < 0) {
          stillFalling = true
          continue
        }
        if (t >= 1) {
          d.mesh.position.y = d.finalY
          continue
        }
        stillFalling = true
        const eased = 1 - Math.pow(1 - t, 3)
        const startY = d.finalY + localDrop + d.jitter
        d.mesh.position.y = startY + (d.finalY - startY) * eased
      }
      if (!stillFalling) {
        dropActive.current = false
      }
    }
  })

  return (
    <group
      ref={group}
      dispose={null}
      position={[offsetX, ctl.modelY + offsetY, offsetZ]}
      scale={autoScale}
    >
      <primitive object={scene} />
    </group>
  )
}

const isDebug = () => {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('debug')
}

function formatValues(o: Record<string, unknown>): string {
  const lines = Object.entries(o).map(([k, v]) => {
    if (typeof v === 'number') return `  ${k}: ${Number(v.toFixed(3))},`
    if (typeof v === 'string') return `  ${k}: '${v}',`
    return `  ${k}: ${JSON.stringify(v)},`
  })
  return `{\n${lines.join('\n')}\n}`
}

export default function PyramidScene() {
  const debug = useMemo(isDebug, [])
  const [dropTrigger, setDropTrigger] = useState(0)
  const valuesRef = useRef<Record<string, unknown>>({})

  const scene = useControls(
    'Scene',
    {
      camY: { value: 5, min: -5, max: 10, step: 0.05, label: 'Cam Y' },
      camZ: { value: 7, min: 1, max: 30, step: 0.1, label: 'Cam Z' },
      lookY: { value: 2.0, min: -3, max: 5, step: 0.05, label: 'Look Y' },
      fov: { value: 55, min: 15, max: 90, step: 1, label: 'FOV' },
      modelY: { value: 0, min: -5, max: 10, step: 0.05, label: 'Model Y' },
      rotationSpeed: {
        value: 0.18,
        min: 0,
        max: 2,
        step: 0.01,
        label: 'Rotate Speed',
      },
      
      Replay: button(() => setDropTrigger((c) => c + 1)),
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
      animationSpeed: {
        value: 1,
        min: 0,
        max: 3,
        step: 0.05,
        label: 'Anim Speed',
      },
      ambient: { value: 0.55, min: 0, max: 3, step: 0.05, label: 'Ambient' },
      dir: { value: 1.1, min: 0, max: 4, step: 0.05, label: 'Directional' },
      dirAzimuth: {
        value: 35,
        min: -180,
        max: 180,
        step: 1,
        label: 'Sun Az (°)',
      },
      dirElevation: {
        value: 55,
        min: 0,
        max: 90,
        step: 1,
        label: 'Sun El (°)',
      },
      envPreset: {
        value: 'city' as EnvPreset,
        options: ENV_PRESETS as unknown as string[],
        label: 'Env',
      },
      envIntensity: {
        value: 1.0,
        min: 0,
        max: 3,
        step: 0.05,
        label: 'Env Intensity',
      },
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

  const sunPos = useMemo<[number, number, number]>(() => {
    const az = THREE.MathUtils.degToRad(adv.dirAzimuth)
    const el = THREE.MathUtils.degToRad(adv.dirElevation)
    const r = 10
    return [
      r * Math.cos(el) * Math.sin(az),
      r * Math.sin(el),
      r * Math.cos(el) * Math.cos(az),
    ]
  }, [adv.dirAzimuth, adv.dirElevation])

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        className="!absolute inset-0"
        camera={{ position: [0, scene.camY, scene.camZ], fov: scene.fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraSync
          y={scene.camY}
          z={scene.camZ}
          fov={scene.fov}
          lookY={scene.lookY}
          enabled={!adv.orbitControls}
        />
        <ambientLight intensity={adv.ambient} />
        <directionalLight position={sunPos} intensity={adv.dir} />
        {adv.showAxes && <axesHelper args={[5]} />}
        {adv.showGrid && (
          <gridHelper args={[10, 10, '#8c74aa', '#cccccc']} position={[0, 0, 0]} />
        )}
        <Suspense fallback={null}>
          <Pyramid
            autoRotate={adv.autoRotate}
            rotationSpeed={scene.rotationSpeed}
            modelY={scene.modelY}
            animationEnabled={adv.animationEnabled}
            animationSpeed={adv.animationSpeed}
            dropEnabled={adv.dropEnabled}
            dropHeight={DROP_HEIGHT}
            dropDuration={DROP_DURATION}
            dropStagger={DROP_STAGGER}
            dropDelay={DROP_DELAY}
            dropTrigger={dropTrigger}
          />
          <Environment
            preset={adv.envPreset as EnvPreset}
            environmentIntensity={adv.envIntensity}
          />
        </Suspense>
        {adv.orbitControls && (
          <OrbitControls makeDefault target={[0, scene.lookY, 0]} />
        )}
        {adv.showStats && <Stats className="!left-auto !right-2 !top-2" />}
      </Canvas>
      <Leva hidden={!debug} collapsed={false} oneLineLabels={false} />
    </div>
  )
}

function CameraSync({
  y,
  z,
  fov,
  lookY,
  enabled,
}: {
  y: number
  z: number
  fov: number
  lookY: number
  enabled: boolean
}) {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    if (!enabled) return
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    camera.position.set(0, y, z)
    camera.lookAt(0, lookY, 0)
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  }, [camera, enabled, y, z, fov, lookY])
  return null
}
