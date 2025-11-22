<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="goBack" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Kembali
            </button>
            <div>
              <h1 class="text-2xl font-bold text-blue-800">Dashboard Pembelajaran</h1>
              <p class="text-gray-600">Selamat datang, {{ user?.name }}!</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm text-gray-600">Level</p>
              <p class="font-semibold text-blue-600">{{ userLevel }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Progress Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Materi Diikuti</p>
              <p class="text-2xl font-bold text-blue-600">{{ enrolledCourses.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Materi Selesai</p>
              <p class="text-2xl font-bold text-green-600">{{ completedCourses.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-yellow-100 rounded-xl">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Progress Keseluruhan</p>
              <p class="text-2xl font-bold text-yellow-600">{{ overallProgress }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Learning -->
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Sedang Dipelajari</h2>
        <div v-if="currentCourses.length > 0" class="space-y-6">
          <div v-for="course in currentCourses" :key="course.id" class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
              <img :src="course.img" alt="Course" class="w-full lg:w-32 h-24 object-cover rounded-xl" />
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-blue-800 mb-2">{{ course.title }}</h3>
                <p class="text-gray-600 mb-4">{{ course.description }}</p>
                <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm text-gray-600">Progress:</span>
                      <span class="font-medium text-blue-600">{{ course.progress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: course.progress + '%' }"></div>
                    </div>
                  </div>
                  <button
                    @click="continueLearning(course)"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Lanjut Belajar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-600 mb-2">Belum ada materi yang sedang dipelajari</h3>
          <p class="text-gray-500 mb-4">Mulai pelajaran pertama Anda untuk melihat progress di sini</p>
          <NuxtLink to="/course" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Jelajahi Materi
          </NuxtLink>
        </div>
      </div>

      <!-- Completed Courses -->
      <div v-if="completedCourses.length > 0" class="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Materi Selesai</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="course in completedCourses" :key="course.id" class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div class="flex items-start gap-4">
              <img :src="course.img" alt="Course" class="w-16 h-16 object-cover rounded-xl shrink-0" />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ course.title }}</h3>
                <p class="text-gray-600 text-sm mb-3">{{ course.description }}</p>
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm text-green-600 font-medium">Selesai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Pencapaian</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="achievement in achievements" :key="achievement.id" class="text-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            <div class="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" :class="achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'">
              <svg class="h-8 w-8" :class="achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'" fill="currentColor" viewBox="0 0 24 24">
                <path :d="achievement.icon"/>
              </svg>
            </div>
            <h3 class="font-medium text-gray-800 mb-1">{{ achievement.title }}</h3>
            <p class="text-sm text-gray-600">{{ achievement.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

// Redirect if not logged in (fallback)
const { isLoggedIn, user } = useAuth()

if (!isLoggedIn.value) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized - Please login first'
  })
}

const router = useRouter()

// Mock user level
const userLevel = ref('Pemula')

// Mock enrolled courses with progress
const enrolledCourses = ref([
  {
    id: 1,
    title: 'Digitalisasi Layanan Publik',
    description: 'Penerapan aplikasi dan sistem digital untuk mempermudah akses layanan publik',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    progress: 75,
    status: 'in_progress'
  },
  {
    id: 2,
    title: 'Sistem Antrean Online',
    description: 'Inovasi dalam pengelolaan antrean layanan publik secara digital',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    progress: 30,
    status: 'in_progress'
  }
])

// Computed properties
const currentCourses = computed(() => enrolledCourses.value.filter(course => course.status === 'in_progress'))
const completedCourses = computed(() => enrolledCourses.value.filter(course => course.status === 'completed'))

const overallProgress = computed(() => {
  if (enrolledCourses.value.length === 0) return 0
  const totalProgress = enrolledCourses.value.reduce((sum, course) => sum + course.progress, 0)
  return Math.round(totalProgress / enrolledCourses.value.length)
})

// Achievements
const achievements = ref([
  {
    id: 1,
    title: 'Pembelajar Pertama',
    description: 'Menyelesaikan materi pertama',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    unlocked: true
  },
  {
    id: 2,
    title: 'Konsisten',
    description: 'Belajar selama 7 hari berturut-turut',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    unlocked: false
  },
  {
    id: 3,
    title: 'Ahli Digital',
    description: 'Menyelesaikan 5 materi teknologi',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    unlocked: false
  },
  {
    id: 4,
    title: 'Mentor',
    description: 'Membantu 10 orang lain belajar',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    unlocked: false
  }
])

function goBack() {
  router.push('/')
}

function continueLearning(course) {
  // Navigate to the learning page for this course
  router.push(`/course/${course.id}/learn`)
}

// Set page title
useHead({
  title: 'Dashboard Pembelajaran - Jippnas',
  meta: [
    { name: 'description', content: 'Dashboard pembelajaran untuk melacak progress materi yang diikuti' }
  ]
})
</script>

<style scoped>
/* Additional styles if needed */
</style>