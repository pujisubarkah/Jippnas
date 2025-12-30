<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="myList">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Daftar Buku Inovasi</h2>
        <h3 class="text-blue-600 text-lg font-medium mb-6">Berikut Daftar Buku Terpublikasi untuk Umum</h3>

        <form class="mb-8" @submit.prevent>
          <div class="max-w-md">
            <input
              type="text"
              v-model="searchQuery"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Masukkan Judul Buku"
              @input="filterBooks"
            />
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="contentBuku">
        <div v-if="loading" class="col-span-full text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Memuat buku...</p>
        </div>
        <div v-else-if="error" class="col-span-full text-center py-12">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error memuat buku</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        </div>
        <div
          v-else
          v-for="book in displayedBooks"
          :key="book.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          <div class="p-6">
            <div class="flex justify-center mb-4">
              <img
                :src="book.image"
                :alt="book.title"
                class="w-full h-64 object-cover rounded-xl border border-gray-200 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div class="text-center mb-4">
              <h4 class="text-blue-600 font-bold text-lg leading-tight">{{ book.title }}</h4>
              <p class="text-gray-600 text-sm mt-2 line-clamp-3">{{ book.sinopsis }}</p>
            </div>

            <div class="flex justify-center">
              <a
                :href="book.downloadUrl"
                class="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 w-full"
                target="_blank"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download
              </a>
            </div>
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

      <div v-if="displayedBooks.length === 0 && searchQuery && !loading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5M12 7v3"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada buku ditemukan</h3>
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

const books = ref([])

const fetchBooks = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/buku-inovasi')
    if (response.success) {
      books.value = response.data.map(book => ({
        id: book.id,
        title: book.judul,
        image: book.gambar,
        downloadUrl: book.file === 'File Tersedia' ? `/api/download/buku/${book.id}` : '#',
        sinopsis: book.sinopsis,
        uploaded_by: book.uploaded_by,
        created_at: book.created_at,
        updated_at: book.updated_at
      }))
    } else {
      error.value = 'Failed to fetch books'
    }
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = err.message || 'Error fetching books'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBooks()
})

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value
  return books.value.filter(book =>
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage))

const displayedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBooks.value.slice(start, end)
})

const filterBooks = () => {
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

/* Line clamp for synopsis */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>