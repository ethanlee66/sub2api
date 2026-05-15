import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import {
  DEFAULT_GLOBE_ROTATION,
  HUB_POINT,
  applyGlobeDragRotation,
  centerPointRotation,
  getGlobeThemeColors,
  latLngToVector3
} from '../globeScene'

describe('globe scene helpers', () => {
  it('starts Shantou on the upper-left side-facing globe', () => {
    const shantou = latLngToVector3(HUB_POINT, 1).applyEuler(
      new THREE.Euler(DEFAULT_GLOBE_ROTATION.x, DEFAULT_GLOBE_ROTATION.y, DEFAULT_GLOBE_ROTATION.z)
    )

    expect(shantou.x).toBeLessThan(-0.5)
    expect(shantou.y).toBeGreaterThan(0.35)
    expect(shantou.z).toBeGreaterThan(0.65)
  })

  it('derives a centered rotation for any geographic point', () => {
    const tokyo = { lat: 35.68, lng: 139.76 }
    const rotation = centerPointRotation(tokyo)
    const centered = latLngToVector3(tokyo, 1).applyEuler(
      new THREE.Euler(rotation.x, rotation.y, rotation.z)
    )

    expect(centered.x).toBeCloseTo(0, 4)
    expect(centered.y).toBeCloseTo(0, 4)
    expect(centered.z).toBeGreaterThan(0.999)
  })

  it('updates globe rotation from drag deltas without over-tilting', () => {
    const rotation = applyGlobeDragRotation(DEFAULT_GLOBE_ROTATION, {
      deltaX: 120,
      deltaY: -2000
    })

    expect(rotation.y).toBeGreaterThan(DEFAULT_GLOBE_ROTATION.y)
    expect(rotation.x).toBeGreaterThanOrEqual(-1.2)
    expect(rotation.x).toBeLessThanOrEqual(1.2)
    expect(rotation.z).toBe(0)
  })

  it('uses the product indigo palette for route and node emphasis', () => {
    const darkTheme = getGlobeThemeColors(true)
    const lightTheme = getGlobeThemeColors(false)

    expect(new Set(darkTheme.ocean).size).toBe(1)
    expect(new Set(lightTheme.ocean).size).toBe(1)
    expect(darkTheme.routes).toContain(0x3e55e9)
    expect(lightTheme.routes).toContain(0x3e55e9)
    expect(darkTheme.hubNode).toBe(0x3e55e9)
    expect(lightTheme.hubNode).toBe(0x3e55e9)
  })
})
