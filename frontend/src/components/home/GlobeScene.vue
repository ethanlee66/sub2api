<template>
  <div ref="containerRef" class="globe-scene" aria-label="实时全球路由 3D 地球">
    <canvas ref="canvasRef" class="globe-canvas"></canvas>
    <div class="globe-label-layer" aria-hidden="true">
      <div
        v-for="label in nodeLabels"
        :key="label.id"
        :ref="(element) => setLabelRef(label.id, element)"
        class="globe-node-label"
        :class="{ 'globe-node-label-hub': label.id === 'hub' }"
      >
        {{ label.name }}
        <span v-if="label.latency">{{ label.latency }}</span>
      </div>
    </div>
    <div class="globe-vignette" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import * as THREE from 'three'

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
const nodeObjects = new Map<string, THREE.Group>()
const labelElements = new Map<string, HTMLElement>()

type GeoPoint = {
  lat: number
  lng: number
}

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

const hub = { lat: 23.35, lng: 116.68 }

const nodeLabels: NodeLabel[] = [
  { id: 'hub', name: '汕头', point: hub },
  { id: 'japan', name: '日本', latency: '98 ms', point: { lat: 35.68, lng: 139.76 } },
  { id: 'korea', name: '韩国', latency: '78 ms', point: { lat: 37.57, lng: 126.98 } },
  { id: 'singapore', name: '新加坡', latency: '58 ms', point: { lat: 1.35, lng: 103.82 } },
  { id: 'malaysia', name: '马来西亚', latency: '66 ms', point: { lat: 3.13, lng: 101.68 } },
  { id: 'thailand', name: '泰国', latency: '72 ms', point: { lat: 13.75, lng: 100.5 } },
  { id: 'us', name: '美国', latency: '186 ms', point: { lat: 37.77, lng: -122.42 } }
]

const routes: Route[] = [
  { from: hub, to: nodeLabels[1].point, color: 0x38bdf8, speed: 0.009, offset: 0.12 },
  { from: hub, to: nodeLabels[2].point, color: 0x60a5fa, speed: 0.008, offset: 0.42 },
  { from: hub, to: nodeLabels[3].point, color: 0x4ade80, speed: 0.0095, offset: 0.2 },
  { from: hub, to: nodeLabels[4].point, color: 0x38bdf8, speed: 0.0075, offset: 0.64 },
  { from: hub, to: nodeLabels[5].point, color: 0x60a5fa, speed: 0.0085, offset: 0.82 },
  { from: hub, to: nodeLabels[6].point, color: 0x38bdf8, speed: 0.0068, offset: 0.34 }
]

function setLabelRef(id: string, element: Element | ComponentPublicInstance | null) {
  if (element instanceof HTMLElement) {
    labelElements.set(id, element)
    return
  }
  labelElements.delete(id)
}

function createEarthTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  const oceanGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  oceanGradient.addColorStop(0, '#173a62')
  oceanGradient.addColorStop(0.45, '#0c2748')
  oceanGradient.addColorStop(1, '#04172d')
  ctx.fillStyle = oceanGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(148, 163, 132, 0.82)'
  drawLand(ctx, [
    [0.61, 0.32],
    [0.69, 0.25],
    [0.81, 0.29],
    [0.88, 0.42],
    [0.8, 0.54],
    [0.67, 0.51],
    [0.56, 0.42]
  ])
  drawLand(ctx, [
    [0.64, 0.53],
    [0.72, 0.54],
    [0.8, 0.6],
    [0.76, 0.72],
    [0.64, 0.73],
    [0.58, 0.63]
  ])
  drawLand(ctx, [
    [0.43, 0.33],
    [0.5, 0.27],
    [0.58, 0.32],
    [0.57, 0.45],
    [0.48, 0.48],
    [0.4, 0.42]
  ])
  drawLand(ctx, [
    [0.29, 0.34],
    [0.37, 0.29],
    [0.43, 0.39],
    [0.39, 0.52],
    [0.28, 0.55],
    [0.2, 0.45]
  ])
  drawLand(ctx, [
    [0.16, 0.52],
    [0.24, 0.55],
    [0.31, 0.68],
    [0.26, 0.82],
    [0.17, 0.75],
    [0.12, 0.62]
  ])

  ctx.fillStyle = 'rgba(255, 225, 151, 0.92)'
  for (let i = 0; i < 520; i += 1) {
    const x = canvas.width * (0.52 + Math.random() * 0.38)
    const y = canvas.height * (0.22 + Math.random() * 0.42)
    const radius = Math.random() * 1.7 + 0.45
    ctx.globalAlpha = Math.random() * 0.65 + 0.2
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function drawLand(ctx: CanvasRenderingContext2D, points: [number, number][]) {
  const { width, height } = ctx.canvas
  ctx.beginPath()
  points.forEach(([x, y], index) => {
    const px = x * width
    const py = y * height
    if (index === 0) {
      ctx.moveTo(px, py)
      return
    }
    ctx.lineTo(px, py)
  })
  ctx.closePath()
  ctx.fill()
}

function latLngToVector3(point: GeoPoint, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - point.lat)
  const theta = THREE.MathUtils.degToRad(point.lng + 180)
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
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
    opacity: 0.96,
    depthTest: false,
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
      depthTest: false,
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

function createStarField() {
  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []
  const colors: number[] = []

  for (let i = 0; i < 800; i += 1) {
    positions.push((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 12, -Math.random() * 9 - 3)
    const intensity = Math.random() * 0.45 + 0.45
    colors.push(0.55 * intensity, 0.75 * intensity, intensity)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    })
  )
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
      blending: THREE.AdditiveBlending
    })
  )
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
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

  globeGroup.rotation.y += 0.0014
  globeGroup.rotation.x = -0.22

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

function updateLabelPositions() {
  if (!containerRef.value || !camera) return

  const { clientWidth, clientHeight } = containerRef.value
  const activeCamera = camera
  const cameraPosition = activeCamera.position

  nodeObjects.forEach((object, id) => {
    const element = labelElements.get(id)
    if (!element) return

    const worldPosition = new THREE.Vector3()
    object.getWorldPosition(worldPosition)
    const normal = worldPosition.clone().normalize()
    const cameraDirection = cameraPosition.clone().sub(worldPosition).normalize()
    const isVisible = normal.dot(cameraDirection) > 0.08
    const projected = worldPosition.clone().project(activeCamera)
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
  camera.position.set(0.18, 0.1, 7.35)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const ambient = new THREE.AmbientLight(0x9fc5ff, 0.58)
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
  keyLight.position.set(-3.2, 2.4, 4.5)
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.65)
  rimLight.position.set(3.6, -1.2, 2.2)
  scene.add(ambient, keyLight, rimLight, createStarField())

  globeGroup = new THREE.Group()
  globeGroup.rotation.set(-0.22, 1.65, 0.08)
  scene.add(globeGroup)

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(2, 96, 96),
    new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.86,
      metalness: 0.02,
      emissive: new THREE.Color(0x082447),
      emissiveIntensity: 0.18
    })
  )

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.08, 96, 96),
    new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    })
  )

  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(2.012, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      wireframe: true,
      transparent: true,
      opacity: 0.045
    })
  )

  globeGroup.add(earth, atmosphere, wire)
  routes.forEach((route) => {
    const { line, particle } = createRoute(route)
    globeGroup?.add(line, particle)
  })
  nodeLabels.forEach((label) => {
    const color = label.id === 'hub' ? 0x2563eb : 0x60a5fa
    const node = createNode(label.point, color)
    nodeObjects.set(label.id, node)
    globeGroup?.add(node)
  })

  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(containerRef.value)
  frameId = requestAnimationFrame(animate)
}

onMounted(initScene)

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  routeLines = []
  routeParticles = []
  nodeObjects.clear()
  labelElements.clear()

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
})
</script>

<style scoped>
.globe-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 58% 40%, rgba(37, 99, 235, 0.22), transparent 33%),
    radial-gradient(circle at 35% 64%, rgba(14, 165, 233, 0.12), transparent 32%),
    #020817;
}

.globe-canvas {
  display: block;
  width: 100%;
  height: 100%;
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
  gap: 6px;
  padding: 5px 8px;
  overflow: hidden;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  color: #dbeafe;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: rgba(4, 15, 31, 0.76);
  border: 1px solid rgba(147, 197, 253, 0.46);
  border-radius: 6px;
  box-shadow:
    0 10px 22px rgba(2, 8, 23, 0.35),
    0 0 16px rgba(59, 130, 246, 0.14);
  opacity: 0;
  transition: opacity 180ms ease;
  will-change: transform, opacity;
}

.globe-node-label::after {
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 8px;
  height: 8px;
  content: '';
  background: rgba(4, 15, 31, 0.76);
  border-right: 1px solid rgba(147, 197, 253, 0.46);
  border-bottom: 1px solid rgba(147, 197, 253, 0.46);
  transform: translateX(-50%) rotate(45deg);
}

.globe-node-label span {
  flex: 0 0 auto;
  color: #93c5fd;
  font-size: 11px;
  font-weight: 700;
}

.globe-node-label-hub {
  color: #eff6ff;
  background: rgba(29, 78, 216, 0.82);
  border-color: rgba(191, 219, 254, 0.72);
  box-shadow:
    0 12px 28px rgba(30, 64, 175, 0.42),
    0 0 22px rgba(96, 165, 250, 0.42);
}

.globe-node-label-hub::after {
  background: rgba(29, 78, 216, 0.82);
  border-color: rgba(191, 219, 254, 0.72);
}

.globe-vignette {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(2, 8, 23, 0.58), transparent 22%, transparent 72%, rgba(2, 8, 23, 0.2)),
    linear-gradient(180deg, rgba(2, 8, 23, 0.24), transparent 38%, rgba(2, 8, 23, 0.34));
}
</style>
