<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-blue-800 mb-4">Halaman Pembelajaran</h1>
      <p class="text-gray-600 mb-4">Materi ID: {{ materiId }}</p>
      <p class="text-gray-600 mb-8">Materi Title: {{ materi?.title || 'Loading...' }}</p>

      <button @click="goBack" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Kembali ke Detail Materi
      </button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const materiId = route.params.id

// Mock data - in real app, this would come from an API
const materiData = [
  {
    id: 1,
    title: 'Digitalisasi Layanan Publik',
    category: 'Teknologi Informasi',
    mentor: 'Dinas Kominfo',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Sistem Antrean Online',
    category: 'Administrasi',
    mentor: 'Dinas Kependudukan',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
]

const materi = materiData.find(m => m.id == materiId)

if (!materi) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Materi tidak ditemukan'
  })
}

// Module data
const modules = ref([
  {
    id: 1,
    title: 'Pengenalan Digitalisasi',
    type: 'video',
    completed: true,
    unlocked: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Pelajari konsep dasar digitalisasi layanan publik dan pentingnya transformasi digital di era modern.'
  },
  {
    id: 2,
    title: 'Konsep Dasar e-Government',
    type: 'text',
    completed: true,
    unlocked: true,
    content: `
      <h3>Apa itu e-Government?</h3>
      <p>e-Government atau electronic government adalah penggunaan teknologi informasi dan komunikasi untuk memberikan layanan pemerintah kepada masyarakat. Tujuan utamanya adalah meningkatkan efisiensi, transparansi, dan aksesibilitas layanan publik.</p>

      <h3>Manfaat e-Government:</h3>
      <ul>
        <li>Mengurangi birokrasi dan waktu pelayanan</li>
        <li>Meningkatkan transparansi dan akuntabilitas</li>
        <li>Memudahkan akses layanan 24/7</li>
        <li>Mengurangi biaya operasional</li>
        <li>Meningkatkan kepuasan masyarakat</li>
      </ul>

      <h3>Komponen Utama:</h3>
      <ol>
        <li>Infrastruktur teknologi</li>
        <li>Portal layanan online</li>
        <li>Sistem database terintegrasi</li>
        <li>Keamanan data dan privasi</li>
        <li>Pendidikan dan literasi digital</li>
      </ol>
    `
  },
  {
    id: 3,
    title: 'Studi Kasus Implementasi',
    type: 'video',
    completed: false,
    unlocked: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Pelajari berbagai studi kasus implementasi e-Government di Indonesia dan negara lain.'
  },
  {
    id: 4,
    title: 'Kuis Akhir',
    type: 'quiz',
    completed: false,
    unlocked: false,
    questions: [
      {
        question: 'Apa tujuan utama e-Government?',
        options: [
          'Meningkatkan pendapatan pemerintah',
          'Mengurangi birokrasi dan meningkatkan efisiensi layanan',
          'Mengganti semua pegawai dengan komputer',
          'Membuat pemerintah lebih kuat'
        ],
        correctAnswer: 1
      },
      {
        question: 'Manakah yang bukan komponen e-Government?',
        options: [
          'Portal layanan online',
          'Sistem database terintegrasi',
          'Keamanan data',
          'Membuang semua dokumen fisik'
        ],
        correctAnswer: 3
      }
    ]
  }
])

const currentModuleIndex = ref(0)
const quizAnswers = ref([])
const quizCompleted = ref(false)
const quizScore = ref(0)

const currentModule = computed(() => currentModuleIndex.value + 1)
const totalModules = computed(() => modules.value.length)
const currentModuleData = computed(() => modules.value[currentModuleIndex.value])
const courseProgress = computed(() => {
  const completedModules = modules.value.filter(m => m.completed).length
  return Math.round((completedModules / modules.value.length) * 100)
})
const canProceed = computed(() => {
  if (currentModuleData.value.type === 'quiz' && !quizCompleted.value) {
    return false
  }
  return true
})

function selectModule(index) {
  if (modules.value[index].unlocked) {
    currentModuleIndex.value = index
    quizCompleted.value = false
    quizAnswers.value = []
  }
}

function previousModule() {
  if (currentModuleIndex.value > 0) {
    currentModuleIndex.value--
    quizCompleted.value = false
    quizAnswers.value = []
  }
}

function nextModule() {
  if (currentModuleIndex.value < modules.value.length - 1) {
    // Mark current module as completed
    modules.value[currentModuleIndex.value].completed = true

    // Unlock next module
    if (currentModuleIndex.value + 1 < modules.value.length) {
      modules.value[currentModuleIndex.value + 1].unlocked = true
    }

    currentModuleIndex.value++
    quizCompleted.value = false
    quizAnswers.value = []
  } else {
    // Course completed
    completeCourse()
  }
}

function submitQuiz() {
  quizScore.value = 0
  currentModuleData.value.questions.forEach((question, index) => {
    if (quizAnswers.value[index] == question.correctAnswer) {
      quizScore.value++
    }
  })
  quizCompleted.value = true

  // Mark quiz as completed
  modules.value[currentModuleIndex.value].completed = true

  // Unlock next module if passed
  if (quizScore.value >= currentModuleData.value.questions.length * 0.7) {
    if (currentModuleIndex.value + 1 < modules.value.length) {
      modules.value[currentModuleIndex.value + 1].unlocked = true
    }
  }
}

function completeCourse() {
  // Mark all modules as completed
  modules.value.forEach(module => {
    module.completed = true
  })

  // Redirect to dashboard or show completion modal
  alert('Selamat! Anda telah menyelesaikan materi ini.')
  router.push('/dashboard')
}

function goBack() {
  router.push(`/materi/${materiId}`)
}

// Set page title
useHead({
  title: `Belajar - ${materi.title}`,
  meta: [
    { name: 'description', content: `Halaman pembelajaran untuk materi ${materi.title}` }
  ]
})
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose h3 {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600;    /* font-semibold */
  color: #1f2937;      /* text-gray-800 */
  margin-bottom: 0.75rem; /* mb-3 */
  margin-top: 1.5rem;      /* mt-6 */
}

.prose p {
  margin-bottom: 1rem; /* mb-4 */
  line-height: 1.625;  /* leading-relaxed */
}

.prose ul, .prose ol {
  margin-bottom: 1rem; /* mb-4 */
  padding-left: 1.5rem; /* pl-6 */
}

.prose li {
  margin-bottom: 0.5rem; /* mb-2 */
}

.prose ul li {
  list-style-type: disc;
}

.prose ol li {
  list-style-type: decimal;
}
</style>