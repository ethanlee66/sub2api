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

export const HUB_POINT: GeoPoint = { lat: 23.35, lng: 116.68 }

const MAX_TILT = 1.2
const MIN_TILT = -1.2
const DRAG_SENSITIVITY = 0.0045

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

export const DEFAULT_GLOBE_ROTATION = centerPointRotation(HUB_POINT)

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
