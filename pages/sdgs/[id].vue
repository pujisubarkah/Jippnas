<template>
  <div class="bg-linear-to-br from-blue-50 to-blue-100 min-h-screen">
    <!-- Header Section with SDG Icon -->
    <section class="bg-linear-to-r from-blue-600 to-blue-700 shadow-lg">
      <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col items-center">
          <!-- SDG Icon -->
          <div
            v-if="!loading && sdgData?.icon_base64"
            v-html="convertBase64ToSvg(sdgData.icon_base64)"
            class="w-32 h-32 rounded-full bg-white p-4 shadow-xl mb-6"
          />
          <!-- Loading placeholder -->
          <div v-else class="flex items-center justify-center bg-white rounded-full p-4 shadow-xl mb-6" style="height: 128px; width: 128px;">
            <div v-if="loading" class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div v-else class="text-4xl font-bold text-gray-400">{{ sdgData?.id }}</div>
          </div>

          <!-- SDG Title -->
          <h2 v-if="sdgData" class="text-3xl font-bold text-white text-center drop-shadow-lg mb-2">
            SDG {{ sdgData.id }}
          </h2>
          <p class="text-xl text-blue-100 text-center drop-shadow">
            {{ sdgData?.nama_id }}
          </p>
          <input type="hidden" name="sdg_id" id="sdg_id" :value="sdgId">
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <div v-if="sdgData" class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Inovasi Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div class="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-lightbulb text-3xl text-white"></i>
                </div>
              </div>
              <div class="text-right">
                <h1 class="text-5xl font-extrabold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{{ sdgData.count || 0 }}</h1>
                <p class="text-gray-600 text-sm mt-1 font-semibold">Inovasi</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-blue-600 text-xs font-medium">
                <i class="fas fa-arrow-up mr-1"></i>
                <span>Terkait SDG</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-linear-to-r from-cyan-400 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div class="w-16 h-16 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-chart-line text-3xl text-white"></i>
                </div>
              </div>
              <div class="text-right">
                <h1 class="text-5xl font-extrabold bg-linear-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">{{ calculateProgress() }}%</h1>
                <p class="text-gray-600 text-sm mt-1 font-semibold">Progress</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-cyan-600 text-xs font-medium">
                <i class="fas fa-chart-bar mr-1"></i>
                <span>Dari Total Inovasi</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ranking Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-linear-to-r from-indigo-400 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div class="w-16 h-16 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-trophy text-3xl text-white"></i>
                </div>
              </div>
              <div class="text-right">
                <h1 class="text-5xl font-extrabold bg-linear-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{{ getRanking() }}</h1>
                <p class="text-gray-600 text-sm mt-1 font-semibold">Ranking</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-indigo-600 text-xs font-medium">
                <i class="fas fa-medal mr-1"></i>
                <span>Dari 17 SDG</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-linear-to-r from-green-400 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div class="shrink-0">
                <div class="w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-check-circle text-3xl text-white"></i>
                </div>
              </div>
              <div class="text-right">
                <p class="text-green-600 font-bold text-lg">Aktif</p>
                <p class="text-gray-600 text-sm mt-1 font-semibold">Status SDG</p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center text-green-600 text-xs font-medium">
                <i class="fas fa-check mr-1"></i>
                <span>Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content with Sidebar Layout -->
    <div v-if="sdgData" class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar: SDG Information -->
        <aside class="lg:w-80 shrink-0">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
            <div class="flex items-center mb-6">
              <div class="w-1 h-8 bg-linear-to-b from-blue-500 to-blue-700 rounded mr-4"></div>
              <h3 class="text-xl font-bold text-gray-800">Informasi SDG</h3>
            </div>

            <!-- SDG Details -->
            <div class="space-y-6">
              <!-- Nama Indonesia -->
              <div>
                <label class="block text-sm font-semibold text-blue-800 mb-2">Nama (Indonesia)</label>
                <p class="text-gray-700 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg">{{ sdgData.nama_id }}</p>
              </div>

              <!-- Nama English -->
              <div>
                <label class="block text-sm font-semibold text-blue-800 mb-2">Name (English)</label>
                <p class="text-gray-700 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg">{{ sdgData.nama_en }}</p>
              </div>

              <!-- SDG Number -->
              <div>
                <label class="block text-sm font-semibold text-blue-800 mb-2">Nomor SDG</label>
                <div class="flex items-center bg-blue-50 p-3 rounded-lg">
                  <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                    {{ sdgData.id }}
                  </div>
                  <span class="text-gray-700 font-medium">Sustainable Development Goal {{ sdgData.id }}</span>
                </div>
              </div>

              <!-- Icon Preview -->
              <div>
                <label class="block text-sm font-semibold text-blue-800 mb-2">Icon SDG</label>
                <div class="bg-blue-50 p-4 rounded-lg flex justify-center">
                  <div
                    v-if="sdgData.icon_base64"
                    v-html="convertBase64ToSvg(sdgData.icon_base64)"
                    class="w-20 h-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content: Inovasi List -->
        <main class="flex-1">
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="w-1 h-8 bg-linear-to-b from-blue-500 to-blue-700 rounded mr-4"></div>
                <h3 class="text-xl font-bold text-gray-800">Inovasi Terkait SDG {{ sdgData.id }}</h3>
              </div>
              <div class="text-sm text-gray-600">
                Total: {{ sdgData.count || 0 }} inovasi
              </div>
            </div>

            <!-- Inovasi List Placeholder -->
            <div v-if="!inovasiList || inovasiList.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">🔍</div>
              <h4 class="text-xl font-semibold text-gray-700 mb-2">Belum Ada Inovasi</h4>
              <p class="text-gray-500">Saat ini belum ada inovasi yang terkait dengan SDG {{ sdgData.id }}</p>
            </div>

            <!-- Inovasi Cards -->
            <div v-else class="space-y-4">
              <div
                v-for="inovasi in inovasiList"
                :key="inovasi.id"
                class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div class="flex items-start gap-4">
                  <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <i class="fas fa-lightbulb text-2xl text-blue-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-1">{{ inovasi.nama }}</h4>
                    <p class="text-gray-600 text-sm mb-2">{{ inovasi.deskripsi }}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                      <span><i class="fas fa-building mr-1"></i>{{ inovasi.instansi }}</span>
                      <span><i class="fas fa-user mr-1"></i>{{ inovasi.inovator }}</span>
                      <span><i class="fas fa-calendar mr-1"></i>{{ inovasi.tahun }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="inovasiList && inovasiList.length > 0" class="mt-8 flex justify-center">
              <div class="flex items-center gap-2">
                <button class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" :disabled="currentPage === 1">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="px-4 py-2 bg-blue-600 text-white rounded-lg">{{ currentPage }}</span>
                <button class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" :disabled="currentPage === totalPages">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-blue-600">Memuat data SDG...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="text-red-600 text-6xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h1>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </NuxtLink>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!sdgData" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">SDG Tidak Ditemukan</h1>
        <p class="text-gray-600 mb-4">SDG dengan ID {{ $route.params.id }} tidak tersedia.</p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const sdgData = ref(null)
const loading = ref(true)
const error = ref(null)
const allSdgsData = ref([])
const inovasiList = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

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

// Function untuk calculate progress
const calculateProgress = () => {
  if (!allSdgsData.value.length || !sdgData.value) return 0

  const maxCount = Math.max(...allSdgsData.value.map(item => item.count || 0))
  if (!maxCount) return 0

  return Math.round((sdgData.value.count / maxCount) * 100)
}

// Function untuk get ranking
const getRanking = () => {
  if (!allSdgsData.value.length || !sdgData.value) return '-'

  // Sort SDGs by count descending
  const sortedSdgs = [...allSdgsData.value].sort((a, b) => (b.count || 0) - (a.count || 0))

  // Find ranking of current SDG
  const ranking = sortedSdgs.findIndex(sdg => sdg.id === sdgData.value.id) + 1

  return ranking
}

// Fetch data SDG berdasarkan ID
const fetchSdgData = async () => {
  try {
    loading.value = true
    error.value = null

    // Fetch all SDGs data
    const response = await fetch('/api/sdgs')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      allSdgsData.value = result.data.filter(item => item.status)

      // Find specific SDG by ID
      const sdgId = parseInt(route.params.id)
      sdgData.value = allSdgsData.value.find(sdg => sdg.id === sdgId)

      if (!sdgData.value) {
        error.value = `SDG dengan ID ${sdgId} tidak ditemukan.`
      }
    } else {
      throw new Error('Data tidak valid')
    }
  } catch (e) {
    console.error('Error fetching SDG data:', e)
    error.value = 'Gagal memuat data SDG. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSdgData()
})

// Set page meta
useHead({
  title: computed(() => sdgData.value ? `SDG ${sdgData.value.id} - ${sdgData.value.nama_id}` : 'SDG Detail'),
  meta: [
    {
      name: 'description',
      content: computed(() => sdgData.value ? `Detail Sustainable Development Goals ${sdgData.value.id}: ${sdgData.value.nama_id}` : 'Detail SDG')
    }
  ]
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeIn 0.5s ease-out;
}
</style>