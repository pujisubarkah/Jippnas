<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
    <!-- Hero Section -->
    <div class="bg-linear-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <div class="flex justify-center mb-6">
            <div class="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Hal Yang Sering Ditanyakan</h1>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">Temukan jawaban untuk pertanyaan umum tentang JIPPNAS dan inovasi pelayanan publik</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Search Section -->
      <div class="mb-12">
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              class="w-full pl-12 pr-4 py-4 border-0 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm text-lg placeholder-gray-500"
              placeholder="Cari pertanyaan..."
              @input="filterFaqs"
            />
          </div>
        </div>
      </div>

      <!-- FAQ List -->
      <div class="space-y-6" id="contentFaq">
        <div
          v-for="(faq, index) in displayedFaqs"
          :key="faq.id"
          class="group"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200">
            <button
              @click="toggleFaq(faq.id)"
              class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
              :aria-expanded="faq.isOpen"
            >
              <div class="flex items-center space-x-4">
                <div class="shrink-0 w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getFaqIcon(faq.id)"/>
                  </svg>
                </div>
                <span class="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">{{ faq.question }}</span>
              </div>
              <div class="shrink-0 ml-4">
                <svg
                  class="w-6 h-6 text-blue-600 transform transition-all duration-300 group-hover:scale-110"
                  :class="{ 'rotate-180': faq.isOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>

            <div
              v-show="faq.isOpen"
              class="px-8 pb-6 border-t border-gray-100 bg-linear-to-r from-gray-50 to-blue-50/30"
              :class="{ 'animate-slide-down': faq.isOpen }"
            >
              <div class="pt-6">
                <div class="flex items-start space-x-4">
                  <div class="shrink-0 w-8 h-8 bg-linear-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-gray-700 leading-relaxed text-base whitespace-pre-line">{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="text-center mt-12">
        <button
          type="button"
          class="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3"
          @click="loadMoreDataFaq"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Muat Lebih Banyak
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="displayedFaqs.length === 0 && searchQuery" class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5M12 7v3"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Tidak ada FAQ ditemukan</h3>
          <p class="text-gray-600">Coba kata kunci lain atau periksa ejaan Anda.</p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="mt-16 bg-white rounded-2xl shadow-lg p-8">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Butuh Bantuan Lebih Lanjut?</h3>
          <p class="text-gray-600 mb-6">Jika pertanyaan Anda tidak terjawab di sini, jangan ragu untuk menghubungi tim kami.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kontak"
              class="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Hubungi Kami
            </a>
            <a
              href="/"
              class="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold inline-flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>

      <!-- Innovation Stats Section -->
      <div class="mt-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold mb-2">Statistik Inovasi JIPPNas</h3>
          <p class="text-blue-100">Data terkini perkembangan inovasi pelayanan publik di Indonesia</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold mb-2">500+</div>
            <div class="text-blue-100">Inovasi Terdaftar</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold mb-2">34</div>
            <div class="text-blue-100">Provinsi Terlibat</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold mb-2">1000+</div>
            <div class="text-blue-100">Pengguna Aktif</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const displayedCount = ref(5) // Show 5 initially

const faqs = ref([
  {
    id: 1,
    question: 'apa saja jenis inovasi yang ditampilkan pada JIPPNas?',
    answer: 'Jaringan Inovasi Pelayanan Publik Nasional (JIPPNas) adalah website yang menyediakan informasi terkait praktik baik inovasi pelayanan publik. tujuannya adalah antara lain agar informasi inovasi yang disampaikan dapat memberikan pengaruh positif kepada kinerja pemerintah, untuk mempelajari dan direplikasi sehingga menumbuhkan model inovasi pelayanan publik baru dan kendala dalam memberikan pelayanan publik yang tidak merata dapat diperbaiki. Mimpi besarnya adalah JIPPNas menjadi knowledge management system yang menyampaikan segala sesuatu yang menciptakan siklus perbaikan dan peningkatan kualitas pelayanan publik melalui penyebarluasan praktik baik inovasi pelayanan publik yang terarah. 5 tahun pertama tujuan JIPPNas tercapai yaitu mejududkan JIPPNas sebagai direktori praktik terbaik inovasi pelayanan publik. hal ini karena telah dilakukan serangkaian program yang menyatukan dan menyediakan informasi praktik baik inovasi pelayanan publik yang bersumber dari para pemangku pekentingan JIPPNas yaitu Kompetisi inovasi pelayanan publik (KIPP) yang bersumber dari Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (KemenPANRB), Innovative government award bersumber Kementerian Dalam Negeri (Kemendagri), dan Inovasi Inoland bersumber dari Lembaga Administrasi Negara (LAN).',
    isOpen: false
  },
  {
    id: 2,
    question: 'Apa pengertian inovasi pelayanan publik?',
    answer: 'Inovasi adalah terobosan gagasan kreatif, orisinil/adaptasi, bermanfaat buat publik. Inovasi pelayanan publik merupakan penerapan ide-ide baru dalam proses, produk, atau prosedur yang dapat meningkatkan efisiensi, efektivitas, dan kualitas pelayanan kepada masyarakat.',
    isOpen: false
  },
  {
    id: 3,
    question: 'Kenapa inovasi tidak ada foto atau gambarnya?',
    answer: 'Inovasi tidak muncul foto atau gambarnya dikarenakan inovator tidak mengunggah foto atau gambar di halaman inovasinya. Untuk meningkatkan kualitas tampilan inovasi, disarankan untuk melengkapi dokumentasi dengan foto atau gambar yang relevan.',
    isOpen: false
  },
  {
    id: 4,
    question: 'Bagaimana cara mengikuti kompetisi inovasi?',
    answer: 'Untuk mengikuti kompetisi inovasi pelayanan publik (KIPP), Anda dapat mendaftar melalui website resmi KemenPANRB. Persiapkan proposal inovasi, dokumentasi lengkap, dan pastikan inovasi Anda memenuhi kriteria penilaian yang ditentukan.',
    isOpen: false
  },
  {
    id: 5,
    question: 'Apa manfaat mengikuti program inovasi di JIPPNas?',
    answer: 'Manfaat mengikuti program inovasi di JIPPNas antara lain: mendapatkan pengakuan nasional, berbagi pengetahuan dengan inovator lainnya, meningkatkan kompetensi, mendapatkan kesempatan replikasi inovasi, dan berkontribusi dalam peningkatan kualitas pelayanan publik di Indonesia.',
    isOpen: false
  },
  {
    id: 6,
    question: 'Siapa saja yang bisa mengakses JIPPNas?',
    answer: 'JIPPNas dapat diakses oleh semua pihak yang tertarik dengan inovasi pelayanan publik, termasuk aparatur sipil negara, akademisi, praktisi, masyarakat umum, dan stakeholder terkait. Platform ini terbuka untuk semua orang yang ingin belajar dan berkontribusi dalam pengembangan inovasi.',
    isOpen: false
  },
  {
    id: 7,
    question: 'Bagaimana cara mengajukan inovasi baru?',
    answer: 'Untuk mengajukan inovasi baru, Anda dapat mendaftar melalui portal KIPP di website KemenPANRB. Siapkan proposal yang lengkap dengan deskripsi inovasi, dampak yang diharapkan, dan dokumentasi pendukung.',
    isOpen: false
  },
  {
    id: 8,
    question: 'Apa kriteria penilaian inovasi?',
    answer: 'Kriteria penilaian inovasi meliputi: kebaruan (novelty), manfaat (benefit), dampak (impact), keberlanjutan (sustainability), dan kemudahan replikasi (replicability). Inovasi dinilai oleh tim juri yang kompeten di bidangnya.',
    isOpen: false
  }
])

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value
  return faqs.value.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const displayedFaqs = computed(() => {
  return filteredFaqs.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredFaqs.value.length
})

const filterFaqs = () => {
  displayedCount.value = 5 // Reset to initial count when searching
}

const toggleFaq = (faqId) => {
  const faq = faqs.value.find(f => f.id === faqId)
  if (faq) {
    faq.isOpen = !faq.isOpen
  }
}

const loadMoreDataFaq = () => {
  displayedCount.value += 5
}

const getFaqIcon = (id) => {
  const icons = {
    1: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Default/question icon
    6: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', // Users icon
    7: 'M12 6v6m0 0v6m0-6h6m-6 0H6', // Plus circle icon
    8: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' // Star icon
  }
  return icons[id] || icons[1]
}
</script>

<style scoped>
/* Hero background pattern */
.bg-linear-to-br {
  background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.05) 1px, transparent 0);
  background-size: 20px 20px;
}
.bg-gradient-to-br {
  background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.05) 1px, transparent 0);
  background-size: 20px 20px;
}

/* Fade in animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Slide down animation */
@keyframes slide-down {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.4s ease-out;
}

/* Rotate animation for chevron */
.rotate-180 {
  transform: rotate(180deg);
}

/* Stagger animation for FAQ items */
.group:nth-child(1) { animation-delay: 0ms; }
.group:nth-child(2) { animation-delay: 100ms; }
.group:nth-child(3) { animation-delay: 200ms; }
.group:nth-child(4) { animation-delay: 300ms; }
.group:nth-child(5) { animation-delay: 400ms; }

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>