<template>
  <div class="container mx-auto px-6 py-10">
    <h1 class="text-2xl font-bold mb-8">Inovasi Dekat Saya - Hub</h1>

    <!-- Survey Results -->
    <div v-if="loading" class="text-center py-12">
      <p>Loading survey results...</p>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-600">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <!-- Overview Dashboard -->
      <div class="mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white px-8 py-8 rounded-xl shadow-md border">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Total Instansi</h3>
          <p class="text-3xl font-bold text-blue-600">{{ surveyResponses.length }}</p>
        </div>
        <div class="bg-white px-8 py-8 rounded-xl shadow-md border">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Rata-rata Skor</h3>
          <p class="text-3xl font-bold text-green-600">{{ averageScore.toFixed(2) }}</p>
        </div>
        <div class="bg-white px-8 py-8 rounded-xl shadow-md border">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Status Terbaik</h3>
          <p class="text-3xl font-bold text-purple-600">{{ bestStatus }}</p>
        </div>
      </div>

      <!-- Grid of Small Radar Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="response in paginatedResponses" :key="response.responseId" class="bg-white px-8 py-8 rounded-xl shadow-md border hover:shadow-lg transition">
          <h3 class="text-lg font-semibold mb-4 text-center">{{ response.instansi }}</h3>
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
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600 mb-2">Total Skor: <span class="font-bold text-blue-600">{{ response.totalFinalScore.toFixed(2) }}</span></p>
            <p class="text-xs text-gray-500">{{ getStatusText(response.totalFinalScore) }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center mt-10 space-x-3">
        <button
          v-if="currentPage > 1"
          @click="prevPage"
          class="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md hover:shadow-lg transition"
        >
          Previous
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="page === currentPage ? 'px-4 py-3 bg-blue-700 text-white rounded-lg font-medium shadow-md' : 'px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition'"
        >
          {{ page }}
        </button>
        <button
          v-if="currentPage < totalPages"
          @click="nextPage"
          class="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md hover:shadow-lg transition">
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal for Full Radar Chart -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white px-10 py-10 rounded-xl max-w-2xl w-full mx-4" @click.stop>
        <div class="flex justify-between items-center mb-6">
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
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 mb-2">Total Skor: <span class="font-bold text-blue-600">{{ selectedResponse?.totalFinalScore.toFixed(2) }}</span></p>
          <p class="text-xs text-gray-500 mt-2">{{ getStatusText(selectedResponse?.totalFinalScore || 0) }}</p>
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
