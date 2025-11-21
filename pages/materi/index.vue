<template>
  <section class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold text-blue-700 mb-6">Materi Pembelajaran</h1>
    <div class="flex flex-col md:flex-row md:items-center mb-6 gap-4">
      <input type="search" class="input input-bordered w-full md:w-1/3" placeholder="Cari materi..." v-model="search" />
      <select class="select select-bordered w-full md:w-1/4" v-model="filter">
        <option value="">Semua Kategori</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="materi in pagedMateri" :key="materi.id" @click="goToMateri(materi.id)" class="card bg-white shadow-md border border-blue-100 rounded-xl p-5 flex flex-col hover:bg-blue-50 transition-all cursor-pointer">
        <img :src="materi.img" alt="Gambar Materi" class="w-full h-40 object-cover rounded-lg mb-3 bg-blue-50" />
        <h2 class="text-xl font-semibold text-blue-800 mb-2">{{ materi.title }}</h2>
        <p class="text-blue-600 mb-2">{{ materi.category }}</p>
        <p class="text-gray-700 mb-4">{{ materi.description }}</p>
        <div class="flex items-center mb-2">
          <span class="text-xs text-gray-500 mr-2">Progress:</span>
          <progress class="progress progress-info w-32" :value="materi.progress" max="100"></progress>
          <span class="text-xs text-gray-500 ml-2">{{ materi.progress }}%</span>
        </div>
        <div class="flex items-center justify-between mt-auto">
          <span class="btn btn-primary rounded-full px-4 pointer-events-none">
            {{ materi.progress === 0 ? 'Mulai Belajar' : 'Lanjutkan' }}
          </span>
          <span class="text-xs text-gray-400">Mentor: {{ materi.mentor }}</span>
        </div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="flex justify-center mt-8 gap-2">
      <button class="btn btn-sm" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Sebelumnya</button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="btn btn-sm"
        :class="currentPage === page ? 'btn-info text-white' : 'btn-outline'"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Berikutnya</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const search = ref('');
const filter = ref('');
const categories = ['Administrasi', 'Kesehatan', 'Pendidikan', 'Transportasi', 'Teknologi Informasi'];
const materiList = [
  {
    id: 1,
    title: 'Digitalisasi Layanan Publik',
    category: 'Teknologi Informasi',
    description: 'Penerapan aplikasi dan sistem digital untuk mempermudah akses layanan publik, seperti e-Government dan layanan online.',
    progress: 0,
    mentor: 'Dinas Kominfo',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Sistem Antrean Online',
    category: 'Administrasi',
    description: 'Inovasi dalam pengelolaan antrean layanan publik secara digital untuk meningkatkan efisiensi dan kenyamanan masyarakat.',
    progress: 40,
    mentor: 'Dinas Kependudukan',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'Transparansi Data Publik',
    category: 'Teknologi Informasi',
    description: 'Pengembangan portal data terbuka untuk meningkatkan transparansi dan akuntabilitas layanan publik.',
    progress: 100,
    mentor: 'Bappeda',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    title: 'Layanan Kesehatan Digital',
    category: 'Kesehatan',
    description: 'Pemanfaatan telemedicine dan aplikasi kesehatan untuk memperluas jangkauan layanan kesehatan masyarakat.',
    progress: 20,
    mentor: 'Puskesmas Digital',
    img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    title: 'Inovasi Pendidikan Publik',
    category: 'Pendidikan',
    description: 'Penggunaan platform pembelajaran daring untuk meningkatkan kualitas pendidikan di sekolah negeri.',
    progress: 60,
    mentor: 'Dinas Pendidikan',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    title: 'Transportasi Terintegrasi',
    category: 'Transportasi',
    description: 'Integrasi sistem transportasi publik untuk memudahkan mobilitas masyarakat dan mengurangi kemacetan.',
    progress: 80,
    mentor: 'Dinas Perhubungan',
    img: 'https://images.unsplash.com/photo-1465101178521-c1a4c8a16d78?auto=format&fit=crop&w=400&q=80',
  },
];

const filteredMateri = computed(() => {
  let result = materiList;
  if (search.value) {
    result = result.filter(m => m.title.toLowerCase().includes(search.value.toLowerCase()));
  }
  if (filter.value) {
    result = result.filter(m => m.category === filter.value);
  }
  return result;
});

// Pagination
const currentPage = ref(1);
const perPage = 6;
const totalPages = computed(() => Math.ceil(filteredMateri.value.length / perPage));
const pagedMateri = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredMateri.value.slice(start, start + perPage);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function goToMateri(id) {
  navigateTo(`/materi/${id}`);
}
</script>

<style scoped>
.card {
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 8px 24px -8px rgba(30,64,175,0.15);
}
</style>
