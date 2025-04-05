<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'

const canvasRef = ref<HTMLCanvasElement>()
const mouseX = ref(0)
const mouseY = ref(0)
const isHovered = ref(false)
const windStrength = ref(0)
const targetWindStrength = ref(0)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let khipuGroup: THREE.Group
let animationFrameId: number
let composer: EffectComposer
let bokehPass: BokehPass
let bloomPass: UnrealBloomPass
let initialFOVAnimation = true
let startTime: number | null = null
const ANIMATION_DURATION = 5000

let lastTime = 0
const targetFPS = 60
const frameTime = 1000 / targetFPS

const PHYSICS_STEP = 1000 / 30
let lastPhysicsTime = 0

const createKhipuStrings = () => {
  const stringColors = [
    '#00BB00', '#8B4513', '#654321', '#800020', '#4A4A4A',
    '#704214', '#00BB00', '#9bc4e2', '#8B0000', '#483C32',
    '#654321', '#4B0082', '#701C1C'
  ]

  const strings: THREE.Object3D[] = []
  const stringCount = 12

  const mainCordMaterial = new THREE.MeshStandardMaterial({ 
    color: '#f0ead6',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#654321',
    emissiveIntensity: 0.2
  })

  const mainCordGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8)
  const mainCord = new THREE.Mesh(mainCordGeometry, mainCordMaterial)
  mainCord.rotation.z = Math.PI / 2
  mainCord.position.y = 1
  strings.push(mainCord)

  for (let i = 0; i < stringCount; i++) {
    const length = 2 + Math.random() * 1
    const geometry = new THREE.CylinderGeometry(0.025, 0.025, length, 8)
    
    const material = new THREE.MeshStandardMaterial({ 
      color: stringColors[i % stringColors.length],
      metalness: 0.5,
      roughness: 0.5,
      emissive: stringColors[i % stringColors.length],
      emissiveIntensity: 0.3
    })
    
    const string = new THREE.Mesh(geometry, material)
    const xPos = (i - stringCount/2) * 0.3
    string.position.x = xPos
    string.position.y = 1 - length/2
    string.rotation.x = Math.random() * 0.1
    string.rotation.z = Math.random() * 0.1
    strings.push(string)

    if (Math.random() > 0.5) {
      const subCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < subCount; j++) {
        const subLength = 0.5 + Math.random() * 0.5
        const subGeometry = new THREE.CylinderGeometry(0.01, 0.01, subLength, 6)
        const parentColor = new THREE.Color(stringColors[i % stringColors.length])
        parentColor.multiplyScalar(1.5)
        
        const subMaterial = new THREE.MeshStandardMaterial({
          color: parentColor,
          metalness: 0.5,
          roughness: 0.5,
          emissive: parentColor,
          emissiveIntensity: 0.2
        })
        
        const subString = new THREE.Mesh(subGeometry, subMaterial)
        const yOffset = -length/4 - j * 0.3
        subString.position.set(xPos + 0.1, 1 + yOffset, 0.1)
        subString.rotation.z = Math.PI/4
        strings.push(subString)
      }
    }
  }

  return strings
}

const handleMouseMove = (event: MouseEvent) => {
  const target = event.target as HTMLCanvasElement
  const rect = target.getBoundingClientRect()
  mouseX.value = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouseY.value = -((event.clientY - rect.top) / rect.height) * 2 + 1
}

const handleHover = (entering: boolean) => {
  isHovered.value = entering
  targetWindStrength.value = entering ? 0.5 : 0
}

const easeOutQuart = (x: number): number => {
  return 1 - Math.pow(1 - x, 4)
}

const animate = (currentTime: number) => {
  if (document.hidden) {
    animationFrameId = requestAnimationFrame(animate)
    return
  }
  
  if (currentTime - lastTime < frameTime) {
    animationFrameId = requestAnimationFrame(animate)
    return
  }
  
  lastTime = currentTime

  if (initialFOVAnimation && camera) {
    if (!startTime) startTime = Date.now()
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
    camera.fov = 1 + (19 * easeOutQuart(progress))
    camera.updateProjectionMatrix()
    if (progress === 1) initialFOVAnimation = false
  }

  if (khipuGroup) {
    khipuGroup.rotation.y += 0.0005
    khipuGroup.rotation.x += 0.0009
    windStrength.value += (targetWindStrength.value - windStrength.value) * 0.1

    khipuGroup.children.forEach((string, i) => {
      if (i === 0) return

      const time = Date.now() * 0.001
      const stringX = string.position.x / 2
      const dx = mouseX.value - stringX
      const dy = mouseY.value - string.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const windFalloff = 1 / (1 + distance * 2)
      const windAngle = Math.atan2(dy, dx)
      const windForce = windStrength.value * windFalloff
      const naturalMovement = Math.sin(time + i) * 0.1

      string.rotation.z = Math.sin(windAngle) * windForce * 0.5 + naturalMovement
      string.rotation.x = Math.cos(windAngle) * windForce * 0.3
      string.rotation.y = Math.sin(time * 0.5) * windForce * 0.2

      string.userData.momentum = string.userData.momentum || { x: 0, y: 0, z: 0 }
      string.userData.momentum.z += (Math.sin(windAngle) * windForce * 0.5 - string.userData.momentum.z) * 0.1
      string.userData.momentum.x += (Math.cos(windAngle) * windForce * 0.3 - string.userData.momentum.x) * 0.1
      
      string.rotation.z += string.userData.momentum.z
      string.rotation.x += string.userData.momentum.x
      
      string.userData.momentum.z *= 0.95
      string.userData.momentum.x *= 0.95
    })
  }

  const time = Date.now() * 0.0001
  const radius = 0.2
  
  if (camera) {
    camera.position.x = Math.sin(time) * radius
    camera.position.z = 5 + Math.cos(time) * radius
    camera.lookAt(0, 0, 0)
  }

  controls?.update()
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
    composer?.render()
  }

  if (currentTime - lastPhysicsTime > PHYSICS_STEP) {
    lastPhysicsTime = currentTime
  }

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  console.log('KhipuBackground mounted, canvas:', canvasRef.value)
  if (!canvasRef.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color('#FFFFFF')
  
  camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 2, 5)
  camera.lookAt(0, 0, 0)
  
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  })
  
  renderer.setClearColor(0xffffff, 1)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  // Initialize controls before creating the scene content
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enabled = false
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = true
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.target.set(0, 0, 0)
  
  // Create and add khipu
  khipuGroup = new THREE.Group()
  console.log('Creating khipu strings...')
  const strings = createKhipuStrings()
  strings.forEach(string => khipuGroup.add(string))
  scene.add(khipuGroup)
  console.log('Khipu group added to scene with', strings.length, 'strings')

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 2.0)
  scene.add(hemisphereLight)

  // Set up post-processing
  composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.6,
    0.1,
    0.9
  )
  composer.addPass(bloomPass)
  
  bokehPass = new BokehPass(scene, camera, {
    focus: 2.0,
    aperture: 0.02,
    maxblur: 0.009
  })
  composer.addPass(bokehPass)

  // Start animation
  console.log('Starting animation...')
  animate(0)
  initialFOVAnimation = true
  
  const updateSize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    
    renderer.setSize(width, height)
    composer.setSize(width, height)
  }
  
  window.addEventListener('resize', updateSize)
  updateSize()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (composer) {
    composer.passes.forEach(pass => {
      if (pass.dispose) pass.dispose()
    })
    composer.dispose()
  }
  
  if (scene) {
    scene.traverse(object => {
      if ((object as THREE.Mesh).geometry) {
        (object as THREE.Mesh).geometry.dispose()
      }
      if ((object as THREE.Mesh).material) {
        const material = (object as THREE.Mesh).material
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose())
        } else {
          material.dispose()
        }
      }
    })
  }
  
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<template>
  <canvas 
    ref="canvasRef"
    class="khipu-container"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
    @mousemove="handleMouseMove"
  />
</template>

<style scoped>
.khipu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: all;
  display: block;
  cursor: pointer;
  overflow: hidden;
  touch-action: none;
  opacity: .55;
  filter: blur(25px) saturate(350%);
  backdrop-filter: blur(1.5px);
}
</style> 