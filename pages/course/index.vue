<template>
  <section class="container mx-auto py-8 px-6">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-primary mb-3">Course Pembelajaran</h1>
      <p class="text-gray-600 text-lg">Jelajahi berbagai course inovasi pelayanan publik untuk meningkatkan kompetensi Anda</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="flex flex-col sm:flex-row sm:items-center mb-8 gap-4">
      <input 
        type="search" 
        class="w-full sm:w-1/2 lg:w-1/3 text-base bg-white rounded-full shadow-md border-2 border-gray-300 focus:border-primary transition-all" 
        style="padding: 0.875rem 1.5rem; outline: none;"
        placeholder="🔍 Cari course..." 
        v-model="search" 
      />
      <select 
        class="w-full sm:w-1/3 lg:w-1/4 text-base bg-white rounded-full shadow-md border-2 border-gray-300 focus:border-primary transition-all" 
        style="padding: 0.875rem 1.5rem; outline: none;"
        v-model="filter"
      >
        <option value="">Semua Kategori</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Course Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="materi in pagedMateri" 
        :key="materi.id" 
        @click="goToCourse(materi.id)" 
        class="card bg-white shadow-lg border border-gray-200 rounded-xl flex flex-col hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <img 
          :src="materi.img" 
          alt="Gambar Course" 
          class="w-full h-48 object-cover" 
        />
        <div style="padding: 2rem;">
          <h2 class="text-xl font-bold text-primary line-clamp-2" style="margin-bottom: 0.75rem; line-height: 1.4;">
            {{ materi.title }}
          </h2>
          <p class="text-sm font-semibold text-amber-600" style="margin-bottom: 1rem;">
            {{ materi.category }}
          </p>
          <p class="text-gray-700 text-sm line-clamp-3" style="margin-bottom: 1.5rem; line-height: 1.6;">
            {{ materi.description }}
          </p>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto" style="padding-top: 1rem; border-top: 1px solid #e5e7eb;">
            <button class="btn rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300" style="background-color: #1976d2; color: white; border: none;">
              Pelajari Course
            </button>
            <span class="text-xs text-gray-500">
              <i class="fas fa-user-circle" style="margin-right: 0.25rem;"></i>
              {{ materi.mentor }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex flex-wrap justify-center mt-10 gap-2">
      <button 
        class="btn btn-sm border-2" 
        style="padding: 0.5rem 1rem; border-color: #1976d2; color: #1976d2; background: white;"
        :disabled="currentPage === 1" 
        @click="goToPage(currentPage - 1)"
      >
        Sebelumnya
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="btn btn-sm"
        :style="currentPage === page ? 'background-color: #1976d2; color: white; border: none;' : 'border: 2px solid #1976d2; color: #1976d2; background: white;'"
        style="padding: 0.5rem 1rem;"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button 
        class="btn btn-sm border-2" 
        style="padding: 0.5rem 1rem; border-color: #1976d2; color: #1976d2; background: white;"
        :disabled="currentPage === totalPages" 
        @click="goToPage(currentPage + 1)"
      >
        Berikutnya
      </button>
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
    mentor: 'Dinas Kominfo',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Sistem Antrean Online',
    category: 'Administrasi',
    description: 'Inovasi dalam pengelolaan antrean layanan publik secara digital untuk meningkatkan efisiensi dan kenyamanan masyarakat.',
    mentor: 'Dinas Kependudukan',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'Transparansi Data Publik',
    category: 'Teknologi Informasi',
    description: 'Pengembangan portal data terbuka untuk meningkatkan transparansi dan akuntabilitas layanan publik.',
    mentor: 'Bappeda',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    title: 'Layanan Kesehatan Digital',
    category: 'Kesehatan',
    description: 'Pemanfaatan telemedicine dan aplikasi kesehatan untuk memperluas jangkauan layanan kesehatan masyarakat.',
    mentor: 'Puskesmas Digital',
    img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    title: 'Inovasi Pendidikan Publik',
    category: 'Pendidikan',
    description: 'Penggunaan platform pembelajaran daring untuk meningkatkan kualitas pendidikan di sekolah negeri.',
    mentor: 'Dinas Pendidikan',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    title: 'Transportasi Terintegrasi',
    category: 'Transportasi',
    description: 'Integrasi sistem transportasi publik untuk memudahkan mobilitas masyarakat dan mengurangi kemacetan.',
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

function goToCourse(id) {
  navigateTo(`/course/${id}`);
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 20px 40px -12px rgba(25, 118, 210, 0.25);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input:focus, .select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}
</style>
