<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <button @click="goBack" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Daftar Materi
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Header Image -->
      <div class="relative mb-8">
        <img :src="materi.img" alt="Gambar Materi" class="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg" />
        <div class="absolute top-6 left-6">
          <span class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-lg">
            {{ materi.category }}
          </span>
        </div>
        <div class="absolute top-6 right-6">
          <button
            @click="toggleBookmark"
            class="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <svg class="h-6 w-6" :class="isBookmarked ? 'text-red-500 fill-current' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Title and Mentor -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-blue-800 mb-4">{{ materi.title }}</h1>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p class="text-gray-600 flex items-center gap-2 text-lg">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Mentor: {{ materi.mentor }}
          </p>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span class="text-sm text-gray-600">4.8 (120 ulasan)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Tentang Materi Ini</h2>
        <p class="text-gray-700 leading-relaxed text-lg">{{ materi.descriptionLong }}</p>
      </div>

      <!-- Materi Information -->
      <div class="bg-blue-50 rounded-2xl p-6 sm:p-8 mb-8">
        <h2 class="text-2xl font-semibold text-blue-800 mb-6">Informasi Materi</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Kategori</p>
              <p class="text-sm text-gray-600">{{ materi.category }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Tipe Materi</p>
              <p class="text-sm text-gray-600">Materi Pembelajaran</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Durasi</p>
              <p class="text-sm text-gray-600">± 2-3 jam</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Sertifikat</p>
              <p class="text-sm text-gray-600">Tersedia</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Objectives -->
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Yang Akan Dipelajari</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="objective in learningObjectives" :key="objective" class="flex items-start gap-3">
            <svg class="h-5 w-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-700">{{ objective }}</p>
          </div>
        </div>
      </div>

      <!-- Course Content Preview -->
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Konten Materi</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">Video Pembelajaran</h3>
              <p class="text-sm text-gray-600">Durasi: 45 menit</p>
            </div>
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <div v-for="quiz in materi.quizzes" :key="quiz.id" class="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">{{ quiz.title }}</h3>
              <p class="text-sm text-gray-600">Kuis interaktif</p>
            </div>
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="enrollInMateri"
            class="flex-1 bg-blue-600 text-white py-4 px-8 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Ikuti Materi Ini
          </button>
          <button
            @click="shareMateri"
            class="flex-1 sm:flex-none border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-semibold text-lg flex items-center justify-center gap-3"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
            Bagikan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const materiId = route.params.id;

// Mock data - in real app, this would come from an API
const materiData = [
  {
    id: 1,
    title: 'Digitalisasi Layanan Publik',
    category: 'Teknologi Informasi',
    description: 'Penerapan aplikasi dan sistem digital untuk mempermudah akses layanan publik, seperti e-Government dan layanan online.',
    descriptionLong: 'Materi ini membahas bagaimana digitalisasi dapat meningkatkan efisiensi, transparansi, dan aksesibilitas layanan publik. Termasuk studi kasus penerapan e-Government dan aplikasi layanan online di berbagai instansi. Anda akan belajar tentang konsep dasar digitalisasi, implementasi teknologi informasi dalam pelayanan publik, serta studi kasus dari berbagai instansi pemerintah.',
    mentor: 'Dinas Kominfo',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis Digitalisasi Dasar' },
      { id: 2, title: 'Kuis Studi Kasus' },
    ],
  },
  {
    id: 2,
    title: 'Sistem Antrean Online',
    category: 'Administrasi',
    description: 'Inovasi dalam pengelolaan antrean layanan publik secara digital untuk meningkatkan efisiensi dan kenyamanan masyarakat.',
    descriptionLong: 'Materi ini membahas solusi digital untuk pengelolaan antrean, manfaat bagi masyarakat, dan contoh implementasi di layanan kependudukan. Pelajari cara mengimplementasikan sistem antrean elektronik, integrasi dengan aplikasi mobile, dan analisis data untuk optimasi layanan.',
    mentor: 'Dinas Kependudukan',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis Antrean Online' },
    ],
  },
  {
    id: 3,
    title: 'Transparansi Data Publik',
    category: 'Teknologi Informasi',
    description: 'Pengembangan portal data terbuka untuk meningkatkan transparansi dan akuntabilitas layanan publik.',
    descriptionLong: 'Materi ini mencakup konsep open data, teknik visualisasi data, keamanan data publik, dan implementasi portal data terintegrasi. Anda akan belajar cara mengembangkan portal data terbuka yang meningkatkan transparansi dan akuntabilitas layanan publik.',
    mentor: 'Bappeda',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis Open Data' },
      { id: 2, title: 'Kuis Visualisasi Data' },
    ],
  },
  {
    id: 4,
    title: 'Layanan Kesehatan Digital',
    category: 'Kesehatan',
    description: 'Pemanfaatan telemedicine dan aplikasi kesehatan untuk memperluas jangkauan layanan kesehatan masyarakat.',
    descriptionLong: 'Pelajari implementasi sistem kesehatan digital, integrasi data kesehatan, dan penerapan AI dalam diagnosis medis. Materi ini akan membahas telemedicine dan aplikasi kesehatan untuk memperluas jangkauan layanan kesehatan masyarakat.',
    mentor: 'Puskesmas Digital',
    img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis Telemedicine' },
    ],
  },
  {
    id: 5,
    title: 'Inovasi Pendidikan Publik',
    category: 'Pendidikan',
    description: 'Penggunaan platform pembelajaran daring untuk meningkatkan kualitas pendidikan di sekolah negeri.',
    descriptionLong: 'Materi mencakup pengembangan kurikulum digital, implementasi e-learning, dan evaluasi pembelajaran berbasis teknologi. Anda akan belajar tentang penggunaan platform pembelajaran daring untuk meningkatkan kualitas pendidikan di sekolah negeri.',
    mentor: 'Dinas Pendidikan',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis E-Learning' },
      { id: 2, title: 'Kuis Kurikulum Digital' },
    ],
  },
  {
    id: 6,
    title: 'Transportasi Terintegrasi',
    category: 'Transportasi',
    description: 'Integrasi sistem transportasi publik untuk memudahkan mobilitas masyarakat dan mengurangi kemacetan.',
    descriptionLong: 'Pelajari perencanaan sistem transportasi cerdas, implementasi IoT dalam transportasi, dan analisis data lalu lintas. Materi ini membahas integrasi sistem transportasi publik untuk memudahkan mobilitas masyarakat dan mengurangi kemacetan.',
    mentor: 'Dinas Perhubungan',
    img: 'https://images.unsplash.com/photo-1465101178521-c1a4c8a16d78?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis Transportasi Cerdas' },
    ],
  },
];

const materi = materiData.find(m => m.id == materiId);

if (!materi) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Materi tidak ditemukan'
  });
}

const isBookmarked = ref(false);

const learningObjectives = [
  'Memahami konsep dasar digitalisasi layanan publik',
  'Mengimplementasikan teknologi informasi dalam pelayanan',
  'Menganalisis studi kasus implementasi e-Government',
  'Merancang solusi digital untuk permasalahan publik',
  'Mengevaluasi dampak digitalisasi terhadap masyarakat',
  'Mengembangkan strategi implementasi teknologi baru'
];

function goBack() {
  router.push('/materi');
}

function toggleBookmark() {
  isBookmarked.value = !isBookmarked.value;
  // In real app, this would save to user's bookmarks
}

function enrollInMateri() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn.value) {
    // Redirect to login if not logged in
    alert('Silakan login terlebih dahulu untuk mengikuti materi ini.');
    // In a real app, you might want to show login modal or redirect to login page
    // For now, we'll just show an alert
    return;
  }

  // If logged in, redirect to learning page
  alert(`Berhasil mendaftar materi: ${materi.title}\n\nAnda akan diarahkan ke halaman pembelajaran.`);
  router.push(`/materi/${materiId}/learn`);
}

function shareMateri() {
  if (navigator.share) {
    navigator.share({
      title: materi.title,
      text: `Pelajari ${materi.title} di platform inovasi publik`,
      url: window.location.href,
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href);
    alert('Link berhasil disalin ke clipboard!');
  }
}

// Set page title
useHead({
  title: `${materi.title} - Materi Pembelajaran`,
  meta: [
    { name: 'description', content: materi.descriptionLong }
  ]
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
