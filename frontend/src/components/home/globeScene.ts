import * as THREE from 'three'

export type GeoPoint = {
  lat: number
  lng: number
}

export type GlobeRotation = {
  x: number
  y: number
  z: number
}

export type GlobeDragDelta = {
  deltaX: number
  deltaY: number
}

export type GlobeThemeColors = {
  ocean: [string, string, string]
  clouds: string
  matrix: string
  routes: [number, number, number]
  ambient: { color: number, intensity: number }
  keyLight: { color: number, intensity: number }
  rimLight: { color: number, intensity: number }
  emissive: { color: number, intensity: number }
  atmosphere: { color: number, opacity: number }
  wire: { color: number }
  hubNode: number
  normalNode: number
  core: number
}

export const HUB_POINT: GeoPoint = { lat: 23.35, lng: 116.68 }

const MAX_TILT = 1.2
const MIN_TILT = -1.2
const DRAG_SENSITIVITY = 0.0045
const DEFAULT_TILT_OFFSET = -0.45
const DEFAULT_SIDE_OFFSET = -0.65

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function latLngToVector3(point: GeoPoint, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - point.lat)
  const theta = THREE.MathUtils.degToRad(point.lng + 180)

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

export function centerPointRotation(point: GeoPoint): GlobeRotation {
  const pointVector = latLngToVector3(point, 1)
  const horizontalDistance = Math.hypot(pointVector.x, pointVector.z)

  return {
    x: Math.atan2(pointVector.y, horizontalDistance),
    y: Math.atan2(-pointVector.x, pointVector.z),
    z: 0
  }
}

const HUB_CENTER_ROTATION = centerPointRotation(HUB_POINT)
export const DEFAULT_GLOBE_ROTATION: GlobeRotation = {
  ...HUB_CENTER_ROTATION,
  x: HUB_CENTER_ROTATION.x + DEFAULT_TILT_OFFSET,
  y: HUB_CENTER_ROTATION.y + DEFAULT_SIDE_OFFSET
}

export function getGlobeThemeColors(dark: boolean): GlobeThemeColors {
  if (dark) {
    return {
      ocean: ['#dfe5ff', '#dfe5ff', '#dfe5ff'],
      clouds: 'rgba(224, 242, 254, 0.2)',
      matrix: 'rgba(14, 23, 90, 0.26)',
      routes: [0x3e55e9, 0x38bdf8, 0x8ea0ff],
      ambient: { color: 0xf1f4ff, intensity: 1.15 },
      keyLight: { color: 0xaab7ff, intensity: 1.85 },
      rimLight: { color: 0x38bdf8, intensity: 0.88 },
      emissive: { color: 0x3e55e9, intensity: 0.09 },
      atmosphere: { color: 0x8ea0ff, opacity: 0.16 },
      wire: { color: 0x3e55e9 },
      hubNode: 0x3e55e9,
      normalNode: 0x38bdf8,
      core: 0xf8faff
    }
  }

  return {
    ocean: ['#edf1ff', '#edf1ff', '#edf1ff'],
    clouds: 'rgba(14, 165, 233, 0.14)',
    matrix: 'rgba(62, 85, 233, 0.14)',
    routes: [0x3e55e9, 0x0284c7, 0x667dff],
    ambient: { color: 0xffffff, intensity: 1.3 },
    keyLight: { color: 0xe9ecff, intensity: 1.65 },
    rimLight: { color: 0x38bdf8, intensity: 0.66 },
    emissive: { color: 0x3e55e9, intensity: 0.04 },
    atmosphere: { color: 0x3e55e9, opacity: 0.1 },
    wire: { color: 0x3e55e9 },
    hubNode: 0x3e55e9,
    normalNode: 0x0284c7,
    core: 0xffffff
  }
}

export function applyGlobeDragRotation(
  rotation: GlobeRotation,
  delta: GlobeDragDelta,
  sensitivity = DRAG_SENSITIVITY
): GlobeRotation {
  return {
    x: clamp(rotation.x + delta.deltaY * sensitivity, MIN_TILT, MAX_TILT),
    y: rotation.y + delta.deltaX * sensitivity,
    z: 0
  }
}
