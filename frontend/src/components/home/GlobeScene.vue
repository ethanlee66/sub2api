<template>
  <div ref="containerRef" class="globe-scene" :class="dark ? 'globe-dark' : 'globe-light'" aria-label="实时全球路由 3D 地球">
    <canvas ref="canvasRef" class="globe-canvas" @pointerdown="onPointerDown"></canvas>
    <div class="globe-label-layer" aria-hidden="true">
      <div
        v-for="label in nodeLabels"
        :key="label.id"
        :ref="(el) => setLabelRef(label.id, el)"
        class="globe-node-label"
        :class="{ 'globe-node-label-hub': label.id === 'hub' }"
      >
        {{ label.name }}
        <span v-if="label.latency">{{ label.latency }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import * as THREE from 'three'
import {
  DEFAULT_GLOBE_ROTATION,
  HUB_POINT,
  applyGlobeDragRotation,
  getGlobeThemeColors,
  latLngToVector3,
  type GeoPoint,
  type GlobeRotation
} from './globeScene'

const props = withDefaults(defineProps<{ dark?: boolean }>(), { dark: true })

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let frameId = 0
let resizeObserver: ResizeObserver | null = null
let globeGroup: THREE.Group | null = null
let routeLines: THREE.Line[] = []
let routeParticles: THREE.Mesh[] = []
let globeRotation: GlobeRotation = { ...DEFAULT_GLOBE_ROTATION }
let dragState: { pointerId: number, lastX: number, lastY: number, target: HTMLElement } | null = null
const nodeObjects = new Map<string, THREE.Group>()
const labelElements = new Map<string, HTMLElement>()

type Route = {
  from: GeoPoint
  to: GeoPoint
  color: number
  speed: number
  offset: number
}

type NodeLabel = {
  id: string
  name: string
  point: GeoPoint
  latency?: string
}

const nodeLabels: NodeLabel[] = [
  { id: 'hub', name: '汕头', point: HUB_POINT },
  { id: 'japan', name: '日本', latency: '98 ms', point: { lat: 35.68, lng: 139.76 } },
  { id: 'korea', name: '韩国', latency: '78 ms', point: { lat: 37.57, lng: 126.98 } },
  { id: 'singapore', name: '新加坡', latency: '58 ms', point: { lat: 1.35, lng: 103.82 } },
  { id: 'malaysia', name: '马来西亚', latency: '66 ms', point: { lat: 3.13, lng: 101.68 } },
  { id: 'thailand', name: '泰国', latency: '72 ms', point: { lat: 13.75, lng: 100.5 } },
  { id: 'us', name: '美国', latency: '186 ms', point: { lat: 37.77, lng: -122.42 } }
]

function getRoutes(): Route[] {
  const theme = getThemeColors()
  return [
    { from: HUB_POINT, to: nodeLabels[1].point, color: theme.routes[0], speed: 0.009, offset: 0.12 },
    { from: HUB_POINT, to: nodeLabels[2].point, color: theme.routes[1], speed: 0.008, offset: 0.42 },
    { from: HUB_POINT, to: nodeLabels[3].point, color: theme.routes[2], speed: 0.0095, offset: 0.2 },
    { from: HUB_POINT, to: nodeLabels[4].point, color: theme.routes[0], speed: 0.0075, offset: 0.64 },
    { from: HUB_POINT, to: nodeLabels[5].point, color: theme.routes[1], speed: 0.0085, offset: 0.82 },
    { from: HUB_POINT, to: nodeLabels[6].point, color: theme.routes[0], speed: 0.0068, offset: 0.34 }
  ]
}

function setLabelRef(id: string, element: Element | ComponentPublicInstance | null) {
  if (element instanceof HTMLElement) {
    labelElements.set(id, element)
    return
  }
  labelElements.delete(id)
}

function getThemeColors() {
  return getGlobeThemeColors(props.dark)
}

function createEarthTexture() {
  const theme = getThemeColors()
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  ctx.fillStyle = theme.ocean[0]
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  drawCloudBand(ctx, theme.clouds, 13, 0.14, 0.18)
  drawCloudBand(ctx, theme.clouds, -34, 0.12, 0.12)
  drawMatrixDots(ctx, theme.matrix)
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function geoToCanvasPoint(ctx: CanvasRenderingContext2D, longitude: number, latitude: number) {
  const { width, height } = ctx.canvas
  return {
    x: ((longitude + 180) / 360) * width,
    y: ((90 - latitude) / 180) * height
  }
}

function drawCloudBand(
  ctx: CanvasRenderingContext2D,
  color: string,
  latitude: number,
  amplitude: number,
  opacity: number
) {
  const { width } = ctx.canvas
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.beginPath()
  for (let x = 0; x <= width; x += 42) {
    const longitude = (x / width) * 360 - 180
    const waveLatitude = latitude + Math.sin(longitude * 0.045) * amplitude * 90
    const point = geoToCanvasPoint(ctx, longitude, waveLatitude)
    if (x === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.lineWidth = 16
  ctx.lineCap = 'round'
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.restore()
}

function drawMatrixDots(ctx: CanvasRenderingContext2D, color: string) {
  const { width, height } = ctx.canvas
  ctx.save()
  ctx.fillStyle = color
  for (let latitude = -66; latitude <= 66; latitude += 6) {
    const rowScale = Math.max(0.3, Math.cos(THREE.MathUtils.degToRad(latitude)))
    const y = ((90 - latitude) / 180) * height
    for (let longitude = -180; longitude <= 180; longitude += 6) {
      const x = ((longitude + 180) / 360) * width
      const radius = 1.05 + rowScale * 0.7
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

function createArcPoints(from: GeoPoint, to: GeoPoint, radius: number) {
  const start = latLngToVector3(from, radius)
  const end = latLngToVector3(to, radius)
  const midpoint = start.clone().add(end).normalize().multiplyScalar(radius * 1.34)
  const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end)
  return curve.getPoints(92)
}

function createRoute(route: Route) {
  const points = createArcPoints(route.from, route.to, 2.14)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: route.color,
    transparent: true,
    opacity: 0.9,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const line = new THREE.Line(geometry, material)
  line.renderOrder = 6
  line.userData.points = points
  line.userData.speed = route.speed
  line.userData.progress = route.offset
  routeLines.push(line)

  const particle = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshBasicMaterial({
      color: route.color,
      transparent: true,
      opacity: 0.95,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  )
  particle.renderOrder = 7
  particle.userData.points = points
  particle.userData.speed = route.speed
  particle.userData.progress = route.offset
  routeParticles.push(particle)

  return { line, particle }
}

function createNode(point: GeoPoint, color = 0x60a5fa) {
  const group = new THREE.Group()
  const position = latLngToVector3(point, 2.08)
  group.position.copy(position)

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 24, 24),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  )
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshBasicMaterial({ color: getThemeColors().core })
  )
  group.add(glow, core)
  return group
}

function resize() {
  if (!containerRef.value || !renderer || !camera) return

  const { clientWidth, clientHeight } = containerRef.value
  const width = Math.max(clientWidth, 1)
  const height = Math.max(clientHeight, 1)

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

function animate() {
  if (!renderer || !scene || !camera || !globeGroup) return

  routeParticles.forEach((particle) => {
    const points = particle.userData.points as THREE.Vector3[]
    const progress = Number(particle.userData.progress)
    const speed = Number(particle.userData.speed)
    const nextProgress = (progress + speed) % 1
    particle.userData.progress = nextProgress
    const index = Math.floor(nextProgress * (points.length - 1))
    particle.position.copy(points[index])
  })

  updateLabelPositions()
  renderer.render(scene, camera)
  frameId = requestAnimationFrame(animate)
}

function applyRotationToGlobe() {
  if (!globeGroup) return
  globeGroup.rotation.set(globeRotation.x, globeRotation.y, globeRotation.z)
}

function onPointerDown(event: PointerEvent) {
  if (!canvasRef.value) return

  event.preventDefault()
  dragState = {
    pointerId: event.pointerId,
    lastX: event.clientX,
    lastY: event.clientY,
    target: canvasRef.value
  }
  canvasRef.value.setPointerCapture(event.pointerId)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}

function onPointerMove(event: PointerEvent) {
  if (!dragState || event.pointerId !== dragState.pointerId) return

  const deltaX = event.clientX - dragState.lastX
  const deltaY = event.clientY - dragState.lastY
  dragState.lastX = event.clientX
  dragState.lastY = event.clientY
  globeRotation = applyGlobeDragRotation(globeRotation, { deltaX, deltaY })
  applyRotationToGlobe()
}

function onPointerUp(event: PointerEvent) {
  if (!dragState || event.pointerId !== dragState.pointerId) return

  if (dragState.target.hasPointerCapture(event.pointerId)) {
    dragState.target.releasePointerCapture(event.pointerId)
  }
  dragState = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}

function updateLabelPositions() {
  if (!containerRef.value || !camera) return

  const { clientWidth, clientHeight } = containerRef.value
  const cameraPosition = camera.position

  nodeObjects.forEach((object, id) => {
    const element = labelElements.get(id)
    if (!element) return

    const worldPosition = new THREE.Vector3()
    object.getWorldPosition(worldPosition)
    const normal = worldPosition.clone().normalize()
    const cameraDirection = cameraPosition.clone().sub(worldPosition).normalize()
    const isVisible = normal.dot(cameraDirection) > 0.08
    const projected = worldPosition.clone().project(camera!)
    const x = (projected.x * 0.5 + 0.5) * clientWidth
    const y = (-projected.y * 0.5 + 0.5) * clientHeight

    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -118%)`
    element.style.opacity = isVisible ? '1' : '0'
    element.style.pointerEvents = isVisible ? 'auto' : 'none'
  })
}

function initScene() {
  if (!containerRef.value || !canvasRef.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
  camera.position.set(0, 0, 7.35)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const theme = getThemeColors()

  const ambient = new THREE.AmbientLight(theme.ambient.color, theme.ambient.intensity)
  const keyLight = new THREE.DirectionalLight(theme.keyLight.color, theme.keyLight.intensity)
  keyLight.position.set(-3.2, 2.4, 4.5)
  const rimLight = new THREE.DirectionalLight(theme.rimLight.color, theme.rimLight.intensity)
  rimLight.position.set(3.6, -1.2, 2.2)
  scene.add(ambient, keyLight, rimLight)

  globeGroup = new THREE.Group()
  globeRotation = { ...DEFAULT_GLOBE_ROTATION }
  applyRotationToGlobe()
  scene.add(globeGroup)

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(2, 96, 96),
    new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.86,
      metalness: 0.02,
      emissive: new THREE.Color(theme.emissive.color),
      emissiveIntensity: theme.emissive.intensity,
      transparent: false
    })
  )

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.08, 96, 96),
    new THREE.MeshBasicMaterial({
      color: theme.atmosphere.color,
      transparent: true,
      opacity: theme.atmosphere.opacity,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    })
  )

  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(2.012, 64, 64),
    new THREE.MeshBasicMaterial({
      color: theme.wire.color,
      wireframe: true,
      transparent: true,
      opacity: 0.018
    })
  )

  globeGroup.add(earth, atmosphere, wire)
  getRoutes().forEach((route) => {
    const { line, particle } = createRoute(route)
    globeGroup?.add(line, particle)
  })
  nodeLabels.forEach((label) => {
    const color = label.id === 'hub' ? theme.hubNode : theme.normalNode
    const node = createNode(label.point, color)
    nodeObjects.set(label.id, node)
    globeGroup?.add(node)
  })

  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(containerRef.value)
  frameId = requestAnimationFrame(animate)
}

function destroyScene() {
  cancelAnimationFrame(frameId)
  if (dragState) {
    if (dragState.target.hasPointerCapture(dragState.pointerId)) {
      dragState.target.releasePointerCapture(dragState.pointerId)
    }
    dragState = null
  }
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  resizeObserver?.disconnect()
  resizeObserver = null
  routeLines = []
  routeParticles = []
  nodeObjects.clear()

  if (scene) {
    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
        object.geometry.dispose()
        const material = object.material
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose())
        } else {
          material.dispose()
        }
      }
    })
  }

  renderer?.dispose()
  renderer = null
  scene = null
  camera = null
  globeGroup = null
}

onMounted(initScene)

watch(() => props.dark, () => {
  destroyScene()
  initScene()
})

onBeforeUnmount(() => {
  destroyScene()
  labelElements.clear()
})
</script>

<style scoped>
.globe-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: transparent;
  cursor: grab;
  user-select: none;
}

.globe-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.globe-scene:active {
  cursor: grabbing;
}

.globe-label-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.globe-node-label {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  max-width: 138px;
  align-items: center;
  gap: 5px;
  padding: 0;
  overflow: hidden;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 180ms ease;
  will-change: transform, opacity;
}

.globe-node-label::after {
  display: none;
  content: none;
}

/* Dark theme labels */
.globe-dark .globe-node-label {
  color: rgba(233, 236, 255, 0.72);
  text-shadow: 0 1px 8px rgba(2, 6, 23, 0.62);
}

.globe-dark .globe-node-label::after {
  display: none;
}

.globe-dark .globe-node-label span {
  color: rgba(233, 236, 255, 0.58);
  font-size: 10px;
}

.globe-dark .globe-node-label-hub {
  color: #8ea0ff;
  font-weight: 800;
  text-shadow: 0 0 14px rgba(62, 85, 233, 0.56);
}

.globe-dark .globe-node-label-hub::after {
  display: none;
}

/* Light theme labels */
.globe-light .globe-node-label {
  color: rgba(31, 41, 55, 0.64);
  text-shadow: 0 1px 8px rgba(255, 255, 255, 0.88);
}

.globe-light .globe-node-label::after {
  display: none;
}

.globe-light .globe-node-label span {
  color: rgba(31, 41, 55, 0.52);
  font-size: 10px;
}

.globe-light .globe-node-label-hub {
  color: #3e55e9;
  font-weight: 800;
  text-shadow: 0 1px 10px rgba(255, 255, 255, 0.92);
}

.globe-light .globe-node-label-hub::after {
  display: none;
}
</style>
