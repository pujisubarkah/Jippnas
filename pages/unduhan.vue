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
        <div
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

            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z"/>
                </svg>
                {{ download.size }}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m0 0l-2-2m2 2l2-2m6-6v6m0 0l2-2m-2 2l-2-2"/>
                </svg>
                {{ download.downloads }}
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

      <div v-if="hasMore" class="text-center mt-12">
        <button
          type="button"
          class="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center gap-3"
          @click="loadMoreDataUnduhan"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Muat Lebih Banyak
        </button>
      </div>

      <div v-if="displayedDownloads.length === 0 && searchQuery" class="text-center py-12">
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
const displayedCount = ref(5) // Show 5 initially

const downloads = ref([
  {
    id: 1,
    title: 'Laporan Hasil Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik Nasional Tahun 2023',
    description: 'Laporan komprehensif mengenai pemantauan dan evaluasi kinerja pelayanan publik nasional tahun 2023',
    image: 'storage/images/unduhan//y1ZZDkSAsqvCheTt.jpg',
    downloadUrl: 'storage/pdf/unduhan//4pQIhBNNmeT2da8k6agNQaBneTb5yBZq5FotJSle.pdf',
    size: '2.5 MB',
    downloads: '1.2K'
  },
  {
    id: 2,
    title: 'Buku Transformasi Administrasi Publik Menjawab Tantangan Era Disrupsi',
    description: 'Panduan lengkap transformasi administrasi publik di era digital dan disrupsi teknologi',
    image: 'storage/images/unduhan//sXgOJ6T58WvAt9El.jpg',
    downloadUrl: 'storage/pdf/unduhan//GFRbJV0rCBJKkht6fLs0omm5OO9bzYI3Nqdg2wxW.pdf',
    size: '5.1 MB',
    downloads: '856'
  },
  {
    id: 3,
    title: 'Peraturan Kepala LAN Nomor 7 Tahun 2023',
    description: 'Peraturan resmi tentang pengelolaan dan pengembangan aparatur sipil negara',
    image: 'storage/images/unduhan//s4M0BBTsS8RjFe17.jpg',
    downloadUrl: 'storage/pdf/unduhan//gS6lJMh5JNnJx9fzOZeXtGdZH4zZPstjhpFTQPRc.pdf',
    size: '1.8 MB',
    downloads: '2.1K'
  },
  {
    id: 4,
    title: 'Peraturan Menteri PANRB Nomor 89 Tahun 2020',
    description: 'Peraturan tentang sistem merit dalam pengelolaan pegawai negeri sipil',
    image: 'storage/images/unduhan//PiJvcdpPx0ybTWUg.jpg',
    downloadUrl: 'storage/pdf/unduhan//guUS5BQ1Dm4pjmPFdakX2JFJCjV8pbNdhDUuad2n.pdf',
    size: '3.2 MB',
    downloads: '1.8K'
  },
  {
    id: 5,
    title: 'PP Nomor 38 Tahun 2017',
    description: 'Peraturan Pemerintah tentang pengelolaan keuangan badan layanan umum',
    image: 'storage/images/unduhan//B4EmboMn30elxHma.jpg',
    downloadUrl: 'storage/pdf/unduhan//C1Ln2FZse662qwVRJ6PppibkLpPkvuw2iOMz7rdp.pdf',
    size: '2.9 MB',
    downloads: '3.4K'
  }
])

const filteredDownloads = computed(() => {
  if (!searchQuery.value) return downloads.value
  return downloads.value.filter(download =>
    download.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const displayedDownloads = computed(() => {
  return filteredDownloads.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredDownloads.value.length
})

const filterDownloads = () => {
  displayedCount.value = 5 // Reset to initial count when searching
}

const loadMoreDataUnduhan = () => {
  displayedCount.value += 5
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