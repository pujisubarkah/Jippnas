<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Inovasi Dekat Saya - Hub</h1>

    <!-- Survey Results -->
    <div v-if="loading" class="text-center py-8">
      <p>Loading survey results...</p>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-600">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <!-- Overview Dashboard -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg shadow border">
          <h3 class="text-lg font-semibold text-gray-700">Total Instansi</h3>
          <p class="text-2xl font-bold text-blue-600">{{ surveyResponses.length }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow border">
          <h3 class="text-lg font-semibold text-gray-700">Rata-rata Skor</h3>
          <p class="text-2xl font-bold text-green-600">{{ averageScore.toFixed(2) }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow border">
          <h3 class="text-lg font-semibold text-gray-700">Status Terbaik</h3>
          <p class="text-2xl font-bold text-purple-600">{{ bestStatus }}</p>
        </div>
      </div>

      <!-- Grid of Small Radar Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="response in paginatedResponses" :key="response.responseId" class="bg-white p-4 rounded-lg shadow border hover:shadow-lg transition">
          <h3 class="text-lg font-semibold mb-2 text-center">{{ response.instansi }}</h3>
          <div class="w-full cursor-pointer" @click="openModal(response)">
            <ClientOnly>
              <apexchart
                type="radar"
                height="250"
                :options="getChartOptions(response.aspectScores)"
                :series="getChartSeries(response.aspectScores)"
              />
            </ClientOnly>
          </div>
          <div class="mt-2 text-center">
            <p class="text-sm text-gray-600">Total Skor: <span class="font-bold text-blue-600">{{ response.totalFinalScore.toFixed(2) }}</span></p>
            <p class="text-xs text-gray-500">{{ getStatusText(response.totalFinalScore) }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center mt-6 space-x-2">
        <button
          v-if="currentPage > 1"
          @click="prevPage"
          class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="page === currentPage ? 'px-3 py-2 bg-blue-700 text-white rounded' : 'px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'"
        >
          {{ page }}
        </button>
        <button
          v-if="currentPage < totalPages"
          @click="nextPage"
          class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal for Full Radar Chart -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white p-6 rounded-lg max-w-2xl w-full mx-4" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ selectedResponse?.instansi }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="w-full">
          <ClientOnly>
            <apexchart
              type="radar"
              height="400"
              :options="getChartOptions(selectedResponse?.aspectScores || [])"
              :series="getChartSeries(selectedResponse?.aspectScores || [])"
            />
          </ClientOnly>
        </div>
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">Total Skor: <span class="font-bold text-blue-600">{{ selectedResponse?.totalFinalScore.toFixed(2) }}</span></p>
          <p class="text-xs text-gray-500 mt-1">{{ getStatusText(selectedResponse?.totalFinalScore || 0) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const surveyResponses = ref([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const selectedResponse = ref(null)
const currentPage = ref(1)
const itemsPerPage = 9 // Adjusted for grid layout

// Fetch data from API
const { data, pending, error: fetchError } = await useFetch('/api/aspect-responses')

if (fetchError.value) {
  error.value = 'Failed to load survey results'
  loading.value = false
} else if (data.value && data.value.success) {
  surveyResponses.value = data.value.data
  loading.value = false
} else {
  error.value = 'No data available'
  loading.value = false
}

// Computed for overview
const averageScore = computed(() => {
  if (surveyResponses.value.length === 0) return 0
  const sum = surveyResponses.value.reduce((acc, response) => acc + response.totalFinalScore, 0)
  return sum / surveyResponses.value.length
})

const bestStatus = computed(() => {
  if (surveyResponses.value.length === 0) return 'N/A'
  const maxScore = Math.max(...surveyResponses.value.map(r => r.totalFinalScore))
  return getStatusText(maxScore)
})

// Pagination
const totalPages = computed(() => Math.ceil(surveyResponses.value.length / itemsPerPage))

const paginatedResponses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return surveyResponses.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

// Pagination functions
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Modal functions
const openModal = (response) => {
  selectedResponse.value = response
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedResponse.value = null
}

// Chart configuration functions
const getChartSeries = (aspectScores) => [{
  name: 'Skor',
  data: aspectScores.map(aspect => aspect.finalScore)
}]

const getChartOptions = (aspectScores) => ({
  chart: {
    type: 'radar',
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: aspectScores.map(aspect => aspect.aspectName)
  },
  yaxis: {
    show: true,
    min: 0,
    max: 10,
    tickAmount: 5,
    labels: {
      formatter: (val) => val.toFixed(1)
    }
  },
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.3
  },
  markers: {
    size: 4
  },
  colors: ['#1976D2'],
  dataLabels: {
    enabled: false // Disabled for smaller charts
  },
  tooltip: {
    y: {
      formatter: (val) => val.toFixed(2) + ' poin'
    }
  }
})

// Helper functions
const getStatusText = (score) => {
  if (score >= 8) return 'Baik'
  if (score >= 6) return 'Cukup'
  return 'Perlu Perbaikan'
}
</script>

<style scoped>
/* Tambahkan styling jika diperlukan */
</style>
