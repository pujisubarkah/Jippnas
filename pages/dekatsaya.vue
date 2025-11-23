<template>
  <section class="w-full px-2 sm:px-4 md:px-6 py-6 md:py-8">
    <!-- Background decorative elements -->
    <div class="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl -z-10"></div>
    <div class="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>

    <div class="bg-linear-to-br from-white/95 via-blue-50/30 to-cyan-50/40 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-200/50 p-4 md:p-8">
      <!-- Header -->
      <div class="text-center mb-6 md:mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="bg-linear-to-r from-blue-500 to-cyan-500 p-3 md:p-4 rounded-2xl shadow-lg mr-3 md:mr-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              PETA INOVASI
            </h1>
            <div class="h-0.5 w-16 md:w-20 bg-linear-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-full mx-auto mt-2"></div>
          </div>
        </div>

        <div class="max-w-3xl mx-auto mt-4">
          <p class="text-gray-700 text-sm sm:text-base px-1">
            💡 <span class="font-semibold">Temukan inovasi-inovasi terdepan</span> dari seluruh Indonesia!
          </p>
          <div class="mt-2 bg-blue-50/60 rounded-lg p-3 border border-blue-200/50">
            <p class="text-gray-800 text-xs sm:text-sm">
              🔍 <span class="text-blue-600 font-medium">Eksplorasi:</span> Klik pada wilayah untuk melihat detail inovasi.
              <br className="hidden sm:inline" /> Gunakan <strong>scroll</strong> untuk zoom dan <strong>drag</strong> untuk navigasi peta.
            </p>
          </div>
        </div>
      </div>

      <!-- Peta - Full Width -->
      <div class="relative overflow-hidden rounded-2xl shadow-lg border border-blue-200/50 bg-linear-to-b from-blue-50/40 to-cyan-50/30 mb-8">
        <!-- Zoom Controls -->
        <div class="absolute z-20 top-4 left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-2 border border-blue-200/40">
          <button
            class="w-9 h-9 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-bold shadow transition hover:scale-105"
            @click="zoomIn"
            aria-label="Perbesar"
          >
            +
          </button>
          <button
            class="w-9 h-9 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-bold shadow transition hover:scale-105"
            @click="zoomOut"
            aria-label="Perkecil"
          >
            −
          </button>
          <button
            class="w-9 h-9 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold shadow transition hover:scale-105"
            @click="resetView"
            aria-label="Reset peta"
          >
            ↺
          </button>
        </div>

        <svg
          ref="svgRef"
          viewBox="0 0 1000 600"
          class="w-full h-auto max-h-[70vh] min-h-[50vh] select-none"
          preserveAspectRatio="xMidYMid meet"
          :style="{ cursor: dragging ? 'grabbing' : 'grab' }"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mousemove="handleMouseMove"
          @wheel="handleWheel"
          role="img"
          aria-label="Peta inovasi di seluruh provinsi Indonesia"
        >
          <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`">
            <defs>
              <radialGradient id="prov-hover-gradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stop-color="#B3E5FC" />
                <stop offset="100%" stop-color="#00B8D9" />
              </radialGradient>
              <linearGradient id="no-data-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f8fafc" />
                <stop offset="100%" stop-color="#e2e8f0" />
              </linearGradient>
            </defs>

            <path
              v-for="prov in provinsi"
              :key="prov.id"
              :d="cleanPath(prov.svg_path)"
              :fill="hovered?.id === prov.id ? 'url(#prov-hover-gradient)' : getColor(prov.jumlahInovasi || 0)"
              stroke="#1E3A8A"
              stroke-width="0.5"
              stroke-opacity="0.3"
              @mouseenter="handlePathMouseEnter(prov, $event)"
              @mouseleave="handleMouseLeave"
              class="cursor-pointer transition-all duration-200 ease-in-out"
            />
          </g>

          <!-- Tooltip -->
          <foreignObject
            v-if="showTooltip && hovered"
            :x="tooltipPos.x + 10"
            :y="tooltipPos.y - 60"
            width="240"
            height="100"
            class="pointer-events-none"
          >
            <div class="bg-white border border-gray-800 rounded-lg p-3 shadow-lg text-sm font-medium">
              <div class="flex items-center mb-1">
                <div
                  class="w-3.5 h-3.5 rounded-full mr-2 border border-gray-700"
                  :style="{ backgroundColor: getColor(hovered.jumlahInovasi || 0) }"
                />
                <span class="font-bold text-gray-900">{{ hovered.nama }}</span>
              </div>
              <div class="text-gray-800">
                💡 <span class="font-bold text-blue-800">{{ (hovered.jumlahInovasi || 0).toLocaleString('id-ID') }} Inovasi</span>
              </div>
              <div :class="`mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                (hovered.jumlahInovasi || 0) === 0 ? 'bg-gray-100 text-gray-600' :
                (hovered.jumlahInovasi || 0) <= 10 ? 'bg-green-100 text-green-800' :
                (hovered.jumlahInovasi || 0) <= 50 ? 'bg-yellow-100 text-yellow-800' :
                (hovered.jumlahInovasi || 0) <= 100 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`">
                {{ (hovered.jumlahInovasi || 0) === 0 ? '📊 Belum ada inovasi' :
                   (hovered.jumlahInovasi || 0) <= 10 ? '🟢 Inovasi Terbatas' :
                   (hovered.jumlahInovasi || 0) <= 50 ? '🟡 Inovasi Moderat' :
                   (hovered.jumlahInovasi || 0) <= 100 ? '🟠 Inovasi Aktif' : '🔴 Pusat Inovasi' }}
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>

      <!-- Legenda - Full Width di Bawah Peta -->
      <div class="w-full bg-linear-to-br from-white/90 via-blue-50/40 to-cyan-50/30 backdrop-blur-sm rounded-2xl shadow-md border border-blue-200/50 p-4 md:p-5">
        <div class="text-center mb-3">
          <h2 class="font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-lg md:text-xl">
            LEGENDA
          </h2>
          <div class="h-0.5 w-12 bg-linear-to-r from-blue-400 to-cyan-400 rounded mx-auto mt-1"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
          <div
            v-for="(scale, idx) in colorScale"
            :key="idx"
            class="flex items-center gap-3 p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
          >
            <div
              class="w-5 h-5 rounded shadow-sm border border-white"
              :style="{ background: scale.gradient }"
            />
            <span class="text-sm text-gray-700">{{ scale.label }}</span>
          </div>
          <div class="flex items-center gap-3 p-2 rounded-lg bg-white/50">
            <div
              class="w-5 h-5 rounded shadow-sm border border-gray-300"
              style="background: linear-gradient(135deg, #f8fafc, #e2e8f0)"
            />
            <span class="text-sm text-gray-500">Belum ada data</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Provinsi {
  id: number
  nama: string | null
  svg_path: string | null
  id_provinsi: number | null
  created_at: string | null
  jumlahInovasi?: number
}

const colorScale = [
  { max: 10, color: "#E1F5FE", label: "1–10 inovasi", gradient: "linear-gradient(135deg, #E1F5FE, #B3E5FC)" },
  { max: 50, color: "#4FC3F7", label: "11–50 inovasi", gradient: "linear-gradient(135deg, #4FC3F7, #29B6F6)" },
  { max: 100, color: "#0288D1", label: "51–100 inovasi", gradient: "linear-gradient(135deg, #0288D1, #0277BD)" },
  { max: 200, color: "#01579B", label: "101–200 inovasi", gradient: "linear-gradient(135deg, #01579B, #003c71)" },
  { max: Infinity, color: "#1A237E", label: "200+ inovasi", gradient: "linear-gradient(135deg, #1A237E, #0D47A1)" },
]

// Reactive state
const provinsi = ref<Provinsi[]>([])
const hovered = ref<Provinsi | null>(null)
const tooltipPos = ref({ x: 0, y: 0 })
const showTooltip = ref(false)
const zoom = ref(1)
const pan = ref({ x: 0, y: 0 })
const dragging = ref(false)
const dragStart = ref<{ x: number; y: number } | null>(null)
const svgRef = ref<SVGElement>()

// Fetch data
try {
  const response = await $fetch('/api/provinsi')
  if (response && response.success && Array.isArray(response.data)) {
    provinsi.value = response.data.map((prov: any) => ({
      id: prov.id,
      nama: prov.nama || '',
      svg_path: prov.svg_path || '',
      id_provinsi: prov.id_provinsi || 0,
      created_at: prov.created_at || '',
      jumlahInovasi: Math.floor(Math.random() * 300) // Temporary: random data for demo - represents innovation count
    }))
  }
} catch (error) {
  console.error('Failed to fetch provinces:', error)
  provinsi.value = []
}

// Helper functions
const getColor = (innovationCount: number): string => {
  if (innovationCount === 0) return "url(#no-data-gradient)"
  for (const c of colorScale) {
    if (innovationCount <= c.max) return c.color
  }
  return colorScale[colorScale.length - 1]?.color || "#1A237E"
}

const cleanPath = (path: string | null | undefined): string => {
  return path ? path.replace(/^"|"$/g, "") : ""
}

// Event handlers
const handleMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return
  dragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  if (svgRef.value) svgRef.value.style.cursor = 'grabbing'
}

const handleMouseUp = () => {
  dragging.value = false
  dragStart.value = null
  if (svgRef.value) svgRef.value.style.cursor = 'grab'
}

const handleMouseMove = (e: MouseEvent) => {
  if (!dragging.value || !dragStart.value) return
  pan.value = {
    x: pan.value.x + (e.clientX - dragStart.value.x),
    y: pan.value.y + (e.clientY - dragStart.value.y),
  }
  dragStart.value = { x: e.clientX, y: e.clientY }
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.max(0.5, Math.min(3, zoom.value + delta))
}

const handlePathMouseEnter = (prov: Provinsi, e: MouseEvent) => {
  const svg = svgRef.value as SVGSVGElement
  if (!svg) return
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())
  tooltipPos.value = { x: svgP.x, y: svgP.y }
  hovered.value = prov
  showTooltip.value = true
}

const handleMouseLeave = () => {
  hovered.value = null
  showTooltip.value = false
}

// Zoom controls
const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.2, 3)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.2, 0.5)
}

const resetView = () => {
  zoom.value = 1
  pan.value = { x: 0, y: 0 }
}
</script>