<template>
  <div class="instansi-carousel">
    <h2 class="text-h4 text-center mb-6">Daftar Instansi</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">Memuat data instansi...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <v-alert type="error" class="mb-4">
        Gagal memuat data instansi: {{ error.message }}
      </v-alert>
      <v-btn color="primary" @click="fetchInstansi">Coba Lagi</v-btn>
    </div>

    <!-- Carousel -->
    <v-carousel
      v-else-if="logoSlides.length > 0"
      v-model="currentSlide"
      height="200"
      hide-delimiters
      show-arrows="always"
      class="rounded-lg"
    >
      <v-carousel-item
        v-for="(slide, slideIndex) in logoSlides"
        :key="slideIndex"
        :value="slideIndex"
      >
        <div class="logos-grid">
          <div
            v-for="(logo, logoIndex) in slide"
            :key="logoIndex"
            class="logo-item"
            @click="openInstansiDetail(logo)"
          >
            <v-img
              :src="logo.url"
              :alt="logo.nama"
              width="80"
              height="80"
              contain
              class="logo-image"
              @error="handleImageError(slideIndex, logoIndex)"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey lighten-2" size="20"></v-progress-circular>
                </div>
              </template>
            </v-img>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>

    <!-- No logos message -->
    <div v-else class="text-center py-8">
      <v-alert type="info">
        Tidak ada logo instansi yang tersedia saat ini.
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// Reactive states
const loading = ref(true)
const error = ref(null)
const instansi = ref([])
const logos = ref([])
const currentSlide = ref(0)

// Items per slide
const itemsPerSlide = 6

// Base URL for logos
const logoBaseUrl = 'https://jippnas.menpan.go.id/assets/img/instansi/'

// Computed property to chunk logos into slides
const logoSlides = computed(() => {
  const slides = []
  for (let i = 0; i < logos.value.length; i += itemsPerSlide) {
    slides.push(logos.value.slice(i, i + itemsPerSlide))
  }
  return slides
})

// Fetch instansi data
const fetchInstansi = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch('/api/instansi')
    
    if (response.success && response.data) {
      instansi.value = response.data
      
      // Filter and create logo objects
      logos.value = response.data
        .filter(item => item.id && item.is_active) // Only active instansi with ID
        .map(item => ({
          id: item.id,
          nama: item.nama,
          singkatan: item.singkatan,
          url: `${logoBaseUrl}${item.id}.png`,
          loaded: false
        }))
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching instansi:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

// Handle image load error
const handleImageError = (slideIndex, logoIndex) => {
  // Find the global index
  const globalIndex = slideIndex * itemsPerSlide + logoIndex
  // Remove logo from array if image fails to load
  if (globalIndex < logos.value.length) {
    logos.value.splice(globalIndex, 1)
  }
}

// Navigate to instansi detail page
const openInstansiDetail = (logo) => {
  // Navigate to instansi detail page without role
  router.push(`/instansi/${logo.id}`)
}

// Initialize on mount
onMounted(() => {
  fetchInstansi()
})

const router = useRouter()
</script>

<style scoped>
.instansi-carousel {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.logos-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 20px;
  justify-items: center;
  align-items: center;
}

.logo-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 120px;
  height: 120px;
}

.logo-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.logo-image {
  border-radius: 4px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .logos-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 16px;
  }
  
  .logo-item {
    width: 100px;
    height: 100px;
    padding: 8px;
  }
  
  .logo-image {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 600px) {
  .instansi-carousel {
    padding: 10px;
  }
  
  .logos-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 12px;
  }
  
  .logo-item {
    width: 80px;
    height: 80px;
    padding: 6px;
  }
  
  .logo-image {
    width: 50px;
    height: 50px;
  }
}
</style>