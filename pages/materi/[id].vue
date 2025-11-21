<template>
  <section class="container mx-auto py-8 px-4">
    <NuxtLink to="/materi" class="inline-flex items-center text-blue-700 hover:text-blue-900 mb-6">
      <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali ke Materi
    </NuxtLink>
    <div v-if="materi" class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar Section as Tab Navigation -->
      <aside class="md:w-1/4 mb-8 md:mb-0">
        <div class="bg-white rounded-xl shadow-md border border-blue-100 p-6 sticky top-24">
          <h2 class="text-lg font-bold text-blue-700 mb-4">Section Materi</h2>
          <ul class="space-y-2">
            <li>
              <button @click="activeSection = 'materi'" :class="activeSection === 'materi' ? 'font-bold text-blue-800' : 'text-blue-700'" class="w-full flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-blue-50 transition">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12" /></svg>
                Video & Materi
              </button>
            </li>
            <li v-for="quiz in materi.quizzes" :key="quiz.id">
              <button @click="activeSection = `quiz-${quiz.id}`" :class="activeSection === `quiz-${quiz.id}` ? 'font-bold text-blue-800' : 'text-blue-700'" class="w-full flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-blue-50 transition">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                {{ quiz.title }}
              </button>
            </li>
          </ul>
        </div>
      </aside>
      <!-- Main Content: Tab Content -->
      <div class="md:w-2/3">
        <template v-if="activeSection === 'materi'">
          <img :src="materi.img" alt="Gambar Materi" class="w-full h-64 object-cover rounded-xl mb-6 bg-blue-50" />
          <h1 class="text-3xl font-bold text-blue-700 mb-4">{{ materi.title }}</h1>
          <p class="text-blue-600 mb-2">Kategori: {{ materi.category }}</p>
          <p class="text-gray-700 mb-6">{{ materi.descriptionLong }}</p>
          <div class="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg border border-blue-100 mb-6">
            <iframe
              :src="materi.video"
              title="Video Pembelajaran Dummy"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full"
            ></iframe>
          </div>
        </template>
        <template v-for="quiz in materi.quizzes" :key="quiz.id" v-if="activeSection === `quiz-${quiz.id}`">
          <div class="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-6">
            <h2 class="text-xl font-semibold text-blue-800 mb-2">{{ quiz.title }}</h2>
            <p class="text-gray-700">Kuis dummy untuk materi ini.</p>
          </div>
        </template>
        <div class="bg-white rounded-xl shadow-md border border-blue-100 p-6">
          <span class="text-xs text-gray-400">Mentor: {{ materi.mentor }}</span>
        </div>
      </div>
    </div>
    <div v-else class="bg-white rounded-xl shadow-md border border-blue-100 p-8 text-center text-blue-700">
      <h2 class="text-2xl font-bold mb-4">Materi tidak ditemukan</h2>
      <NuxtLink to="/materi" class="btn btn-info text-white">Kembali ke daftar materi</NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const id = Number(route.params.id);

const activeSection = ref('materi');

const materiData = [
  {
    id: 1,
    title: 'Digitalisasi Layanan Publik',
    category: 'Teknologi Informasi',
    description: 'Penerapan aplikasi dan sistem digital untuk mempermudah akses layanan publik, seperti e-Government dan layanan online.',
    descriptionLong: 'Materi ini membahas bagaimana digitalisasi dapat meningkatkan efisiensi, transparansi, dan aksesibilitas layanan publik. Termasuk studi kasus penerapan e-Government dan aplikasi layanan online di berbagai instansi.',
    mentor: 'Dinas Kominfo',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis Digitalisasi Dasar', link: '#' },
      { id: 2, title: 'Kuis Studi Kasus', link: '#' },
    ],
  },
  {
    id: 2,
    title: 'Sistem Antrean Online',
    category: 'Administrasi',
    description: 'Inovasi dalam pengelolaan antrean layanan publik secara digital untuk meningkatkan efisiensi dan kenyamanan masyarakat.',
    descriptionLong: 'Materi ini membahas solusi digital untuk pengelolaan antrean, manfaat bagi masyarakat, dan contoh implementasi di layanan kependudukan.',
    mentor: 'Dinas Kependudukan',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quizzes: [
      { id: 1, title: 'Kuis Antrean Online', link: '#' },
    ],
  },
  // ...materi lain bisa ditambah
];

const materi = materiData.find(m => m.id === id) || materiData[0];
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  width: 100%;
}
.aspect-w-16.aspect-h-9::before {
  content: "";
  display: block;
  padding-top: 56.25%;
}
.aspect-w-16.aspect-h-9 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
