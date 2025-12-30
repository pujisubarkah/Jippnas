<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="myList">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Daftar Unduhan</h2>
        <p class="text-gray-600 text-lg">Unduh berbagai dokumen, laporan, dan peraturan terkait inovasi pelayanan publik</p>

        <form class="mt-6" @submit.prevent>
          <div class="max-w-md">
            <input
              type="text"
              v-model="searchQuery"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Masukkan Judul Unduhan"
              @input="filterDownloads"
            />
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="contentUnduhan">
        <div v-if="loading" class="col-span-full text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Memuat unduhan...</p>
        </div>
        <div v-else-if="error" class="col-span-full text-center py-12">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error memuat unduhan</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        </div>
        <div
          v-else
          v-for="download in displayedDownloads"
          :key="download.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
        >
          <div class="p-6">
            <div class="flex justify-center mb-4">
              <div class="relative">
                <img
                  :src="download.image"
                  :alt="download.title"
                  class="w-full h-64 object-cover rounded-xl border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute top-3 right-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                    </svg>
                    PDF
                  </span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-blue-600 font-bold text-lg leading-tight mb-2 line-clamp-3">{{ download.title }}</h4>
              <p class="text-gray-600 text-sm">{{ download.description }}</p>
            </div>

            <div v-if="download.status" class="flex items-center justify-center mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" :class="download.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ download.status }}
              </span>
            </div>

            <a
              :href="download.downloadUrl"
              class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 w-full group"
              target="_blank"
            >
              <svg class="w-5 h-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download
            </a>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && totalPages > 1" class="flex justify-center mt-12">
        <nav class="flex items-center space-x-1">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <template v-for="page in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="page">
            <button
              @click="changePage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium border',
                page === currentPage
                  ? 'text-blue-600 bg-blue-50 border-blue-500'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </template>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>

      <div v-if="displayedDownloads.length === 0 && searchQuery && !loading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5M12 7v3"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada file ditemukan</h3>
        <p class="mt-1 text-sm text-gray-500">Coba kata kunci lain.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const loading = ref(true)
const error = ref(null)

const downloads = ref([])

const fetchDownloads = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/unduhan')
    if (response.success) {
      downloads.value = response.data.map(item => ({
        id: item.id,
        title: item.judul,
        description: item.deskripsi,
        image: item.gambar,
        downloadUrl: item.pdf_url,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))
    } else {
      error.value = 'Failed to fetch downloads'
    }
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = err.message || 'Error fetching downloads'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDownloads()
})

const filteredDownloads = computed(() => {
  if (!searchQuery.value) return downloads.value
  return downloads.value.filter(download =>
    download.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    download.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredDownloads.value.length / itemsPerPage))

const displayedDownloads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDownloads.value.slice(start, end)
})

const filterDownloads = () => {
  currentPage.value = 1 // Reset to first page when searching
}

const changePage = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
/* Custom animations for smooth transitions */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Line clamp utilities */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Loading animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.group:hover svg {
  animation: bounce 0.6s ease-in-out;
}
</style>