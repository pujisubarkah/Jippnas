<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-6 py-10" id="myList">
      <div class="my-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Daftar Model Inovasi</h2>

        <form class="my-6" @submit.prevent>
          <div class="form-group">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="Masukkan Judul Model Inovasi"
              @input="filterModels"
            />
          </div>
        </form>
      </div>

      <div class="space-y-8" id="contentModel">
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Memuat model inovasi...</p>
        </div>
        <div v-else-if="error" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error memuat model</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        </div>
        <div
          v-else
          v-for="model in displayedModels"
          :key="model.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div class="flex flex-col lg:flex-row gap-8 px-10 py-10">
            <div class="lg:w-1/3 shrink-0">
              <img
                :src="model.image"
                :alt="model.title"
                class="w-full h-64 lg:h-80 object-cover rounded-xl border border-gray-200"
              />
            </div>
            <div class="lg:w-2/3 flex flex-col">
              <h2 class="text-2xl font-bold text-blue-600 mb-4">{{ model.title }}</h2>
              <hr class="border-blue-200 mb-6" />
              <div class="text-gray-700 leading-relaxed mb-8 grow overflow-hidden" style="max-height: 200px; overflow-y: auto;">
                <div v-html="model.description"></div>
              </div>
              <div class="flex justify-center lg:justify-start">
                <a
                  :href="model.downloadUrl"
                  class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  target="_blank"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>Download Model</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && totalPages > 1" class="flex justify-center mt-16">
        <nav class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-5 py-3 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-l-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            Previous
          </button>
          
          <template v-for="page in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="page">
            <button
              @click="changePage(page)"
              :class="[
                'px-4 py-3 text-sm font-semibold border shadow-sm transition-colors',
                page === currentPage
                  ? 'text-white bg-blue-600 border-blue-600'
                  : 'text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100'
              ]"
            >
              {{ page }}
            </button>
          </template>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-5 py-3 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            Next
          </button>
        </nav>
      </div>

      <div v-if="displayedModels.length === 0 && searchQuery && !loading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5M12 7v3"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada model ditemukan</h3>
        <p class="mt-1 text-sm text-gray-500">Coba kata kunci lain.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const loading = ref(true)
const error = ref(null)

const models = ref([])

const fetchModels = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/master-inovasi')
    if (response.success) {
      models.value = response.data.map(model => ({
        id: model.id,
        title: model.judul,
        image: model.gambar,
        description: model.keterangan,
        downloadUrl: model.file === 'Tersedia' ? `/api/download/model/${model.id}` : '#',
        created_at: model.created_at,
        updated_at: model.updated_at
      }))
    } else {
      error.value = 'Failed to fetch models'
    }
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = err.message || 'Error fetching models'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchModels()
})

const filteredModels = computed(() => {
  if (!searchQuery.value) return models.value
  return models.value.filter(model =>
    model.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredModels.value.length / itemsPerPage))

const displayedModels = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredModels.value.slice(start, end)
})

const filterModels = () => {
  currentPage.value = 1 // Reset to first page when searching
}

const changePage = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.btn-blue {
  background-color: #2563eb;
  color: white;
}

.btn-blue:hover {
  background-color: #1d4ed8;
}
</style>