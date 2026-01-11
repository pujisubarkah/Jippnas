<template>
  <div class="p-6">
    <div v-if="loading" class="text-center py-8">
      <p class="text-blue-600">Memuat data...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="sdg in sdgsData"
          :key="sdg.id"
          class="bg-white p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 flex flex-col items-center text-center"
          @click="navigateToSdg(sdg.id)"
        >
          <div class="flex flex-col items-center gap-2">
            <div class="relative">
              <!-- Menampilkan SVG dari base64 -->
              <div 
                v-if="sdg.icon_base64" 
                v-html="convertBase64ToSvg(sdg.icon_base64)" 
                class="w-16 h-16 rounded-lg shadow-md border-2 border-white overflow-hidden"
              />
              <!-- Fallback jika tidak ada icon -->
              <div 
                v-else 
                class="w-16 h-16 rounded-lg shadow-md border-2 border-white bg-gray-200 flex items-center justify-center"
              >
                <span class="text-2xl font-bold text-gray-400">{{ sdg.id }}</span>
              </div>
              <div class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {{ sdg.id }}
              </div>
            </div>
            <div class="flex-1 text-center">
              <h4 class="font-semibold text-blue-800 text-sm mb-1">{{ sdg.nama_id }}</h4>
            </div>
            <div class="w-full">
              <div class="w-full bg-blue-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" :style="{ width: calculateWidth(sdg.count) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sdgsData = ref([])
const loading = ref(true)
const error = ref(null)
const maxCount = ref(0)

// Function untuk navigasi ke halaman SDG detail
const navigateToSdg = (sdgId) => {
  navigateTo(`/sdgs/${sdgId}`)
}

// Function untuk convert base64 ke SVG
const convertBase64ToSvg = (base64String) => {
  if (!base64String) return ''
  
  try {
    // Decode base64 to string
    const decoded = atob(base64String)
    
    // Jika sudah SVG, return langsung
    if (decoded.includes('<svg')) {
      return decoded
    }
    
    // Jika masih base64 image, wrap dalam img tag
    return `<img src="data:image/png;base64,${base64String}" alt="SDG Icon" class="w-full h-full object-contain" />`
  } catch (e) {
    console.error('Error converting base64:', e)
    return ''
  }
}

// Function untuk calculate width bar
const calculateWidth = (count) => {
  if (!maxCount.value || !count) return '0%'
  const percentage = (count / maxCount.value) * 100
  return `${percentage}%`
}

// Fetch data dari API
const fetchSdgsData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch('/api/sdgs')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success && result.data) {
      // Filter hanya yang status true
      sdgsData.value = result.data.filter(item => item.status)
      
      // Calculate max count untuk progress bar
      if (sdgsData.value.length > 0) {
        maxCount.value = Math.max(...sdgsData.value.map(item => item.count || 0))
      }
    } else {
      throw new Error('Data tidak valid')
    }
  } catch (e) {
    console.error('Error fetching SDGs data:', e)
    error.value = 'Gagal memuat data SDGs. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSdgsData()
})
</script>
