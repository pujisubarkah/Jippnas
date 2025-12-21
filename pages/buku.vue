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
        <div
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

      <div v-if="hasMore" class="text-center mt-12">
        <button
          type="button"
          class="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          @click="loadMoreDataBuku"
        >
          Muat Lebih Banyak
        </button>
      </div>

      <div v-if="displayedBooks.length === 0 && searchQuery" class="text-center py-12">
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
const displayedCount = ref(5) // Show 5 initially

const books = ref([
  {
    id: 1,
    title: 'Top KIPP Tahun 2023',
    image: 'storage/images/buku//TusZOGArhtiEvQJc.jpg',
    downloadUrl: 'storage/pdf/buku//tQAGjXvZFGYjnaZTo56ambjHNCgKbSkjtIxHF1z7.pdf'
  },
  {
    id: 2,
    title: 'Top KIPP Tahun 2022',
    image: 'storage/images/buku//IIAy8b2xy3H9Y66e.jpg',
    downloadUrl: 'storage/pdf/buku//MZn0GnkPWpoqhE9rWrnyTfvbnmvrOQoJUsceoLCX.pdf'
  },
  {
    id: 3,
    title: 'Top KIPP Tahun 2021',
    image: 'storage/images/buku//BHK1rfSZKmpWxCkT.jpg',
    downloadUrl: 'storage/pdf/buku//yXMgfymsQA5WUpnkoWWOaOKsu08eiEfw2wck1Dlv.pdf'
  },
  {
    id: 4,
    title: 'Top 99 Tahun 2020',
    image: 'storage/images/buku//sBh2Bp6ABSVd3NdS.jpg',
    downloadUrl: 'storage/pdf/buku//lPVYODoFsEmARGxInz1mwdB2dYdKMmnDi3Q7W3CF.pdf'
  },
  {
    id: 5,
    title: 'Top Kelompok Khusus 2020',
    image: 'storage/images/buku//cpM3X4KJpidpbgNg.jpg',
    downloadUrl: 'storage/pdf/buku//5EpA6uKoZuuecMJoArNCl7ye7DUHsMovPGNT3vfv.pdf'
  }
])

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value
  return books.value.filter(book =>
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const displayedBooks = computed(() => {
  return filteredBooks.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredBooks.value.length
})

const filterBooks = () => {
  displayedCount.value = 5 // Reset to initial count when searching
}

const loadMoreDataBuku = () => {
  displayedCount.value += 5
}
</script>

<style scoped>
/* Custom animations for smooth transitions */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>