<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 rounded-3xl mb-8 shadow-xl">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-4xl font-bold flex items-center gap-3 mb-2">
            <NewspaperIcon class="w-10 h-10" />
            Kelola Berita
          </h1>
          <p class="text-white/80 text-lg">Publikasikan update terkini untuk warga & stakeholder.</p>
        </div>
        <button 
          @click="openModal()"
          class="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 btn-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        >
          <PlusIcon class="w-6 h-6" />
          Tambah Berita
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="beritas.length === 0" 
      class="bg-linear-to-br from-base-100 to-base-200 rounded-3xl border border-base-300 p-16 text-center shadow-lg"
    >
      <div class="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="https://picsum.photos/300/300?random=empty" 
          alt="No news yet"
          class="w-full h-full object-cover"
        />
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum ada berita</h3>
      <p class="text-gray-600 max-w-md mx-auto mb-6">
        Mulai bagikan informasi penting dengan menekan tombol 
        <span class="font-medium text-primary">"Tambah Berita"</span>.
      </p>
      <button 
        @click="openModal()" 
        class="btn btn-outline btn-lg gap-2 hover:btn-primary transition-all duration-300"
      >
        <PlusIcon class="w-5 h-5" /> Buat Berita Pertama
      </button>
    </div>

    <!-- Daftar Berita -->
    <div 
      v-if="beritas.length > 0"
      class="mb-6"
    >
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">
          Berita Terbaru ({{ beritas.length }} total)
        </h3>
        <span class="text-sm text-gray-500">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>
      </div>
    </div>
    
    <div 
      v-if="beritas.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="berita in paginatedBeritas"
        :key="berita.id"
        class="card bg-base-100 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden border border-base-200 hover:border-primary/20"
      >
        <figure class="h-48 overflow-hidden">
          <img 
            :src="`https://picsum.photos/400/300?random=${berita.id}`" 
            :alt="berita.title"
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </figure>
        <div class="card-body p-5">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span 
              :class="categoryBadgeClass(berita.category)" 
              class="badge text-xs font-medium gap-1"
            >
              <component :is="categoryIcon(berita.category)" class="w-3 h-3" />
              {{ categoryLabel(berita.category) }}
            </span>
            <time class="text-xs text-gray-500">
              {{ formatDate(berita.date) }}
            </time>
          </div>
          <h3 class="card-title text-lg font-bold text-gray-800 line-clamp-2 mb-2">
            {{ berita.title }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {{ berita.content }}
          </p>
          <div class="card-actions justify-between mt-auto pt-3 border-t border-base-200">
            <button
              v-if="berita.link"
              @click="openLink(berita.link)"
              class="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary/10"
            >
              Baca Selengkapnya
              <ExternalLinkIcon class="w-3 h-3" />
            </button>
            <div class="flex gap-1">
              <button 
                @click="editBerita(berita)" 
                class="btn btn-ghost btn-square btn-sm text-gray-500 hover:text-primary hover:bg-base-200"
                aria-label="Edit"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button 
                @click="deleteBerita(berita.id)" 
                class="btn btn-ghost btn-square btn-sm text-error hover:text-error hover:bg-error/10"
                aria-label="Hapus"
              >
                <Trash2Icon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <div class="join">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage <= 1"
          class="join-item btn btn-outline"
        >
          «
        </button>
        
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="goToPage(page)"
          :class="['join-item btn', page === currentPage ? 'btn-active' : 'btn-outline']"
        >
          {{ page }}
        </button>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="join-item btn btn-outline"
        >
          »
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
      @click="closeModal"
    >
      <div
        class="bg-linear-to-br from-white via-gray-50 to-blue-50 rounded-3xl shadow-2xl w-full max-w-2xl mx-4 p-8 relative max-h-[90vh] overflow-y-auto border border-white/20 backdrop-blur-xl ring-1 ring-black/5"
        @click.stop
      >
        <button
          @click="closeModal"
          class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon class="w-6 h-6" />
        </button>
        <form @submit.prevent="submitBerita" class="space-y-6">

        <!-- Cover Image Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer" @click="triggerFileInput">
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload">
            <div v-if="!beritaForm.coverImage" class="text-gray-500">
              <ImageIcon class="w-8 h-8 mx-auto mb-2" />
              <p>Click to upload cover image</p>
              <p class="text-xs">Recommended: 1200x600px</p>
            </div>
            <div v-else class="relative">
              <img :src="beritaForm.coverImage" alt="Cover" class="w-full h-32 object-cover rounded-lg" />
              <button @click.stop="beritaForm.coverImage = ''" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                <XIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <input
            v-model="beritaForm.title"
            type="text"
            placeholder="Judul Berita..."
            class="w-full text-3xl font-bold border-none outline-none bg-transparent placeholder-gray-300 focus:placeholder-gray-400"
            required
          />
        </div>

        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <UserIcon class="w-4 h-4" />
            <span>Admin</span>
          </div>
          <div class="flex items-center gap-2">
            <CalendarIcon class="w-4 h-4" />
            <input
              v-model="beritaForm.date"
              type="date"
              class="border-none outline-none bg-transparent"
              required
            />
          </div>
          <div class="flex items-center gap-2">
            <TagIcon class="w-4 h-4" />
            <select 
              v-model="beritaForm.category" 
              class="border-none outline-none bg-transparent"
              required
            >
              <option value="pendidikan">Pendidikan</option>
              <option value="teknologi">Teknologi</option>
              <option value="bisnis">Bisnis</option>
              <option value="hiburan">Hiburan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <textarea
            v-model="beritaForm.content"
            placeholder="Tulis isi berita di sini... Gunakan paragraf yang jelas dan bahasa yang mudah dipahami."
            rows="12"
            class="w-full text-lg leading-relaxed border-none outline-none bg-transparent placeholder-gray-300 focus:placeholder-gray-400 resize-none"
            required
          ></textarea>
        </div>

        <!-- Link -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-2">
            <LinkIcon class="w-4 h-4 text-gray-500" />
            <label class="text-sm font-medium text-gray-700">Link Eksternal (Opsional)</label>
          </div>
          <input
            v-model="beritaForm.link"
            type="url"
            placeholder="https://berita.resmi.go.id/..."
            class="w-full border-none outline-none bg-transparent placeholder-gray-300 focus:placeholder-gray-400"
          />
        </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed
} from 'vue'
import {
  PlusIcon,
  NewspaperIcon,
  ExternalLinkIcon,
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  GraduationCapIcon,
  CpuIcon,
  BriefcaseIcon,
  MusicIcon,
  MoreHorizontalIcon,
  ImageIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  LinkIcon
} from 'lucide-vue-next'

definePageMeta({ layout: 'sidebar' })

// === Reactive State ===
const showModal = ref(false)
const editingBerita = ref(null)
const fileInput = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(6)
const beritaForm = ref({
  id: null,
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  category: 'pendidikan',
  link: '',
  coverImage: ''
})

const beritas = ref([
  {
    id: 1,
    title: 'Peluncuran Portal Layanan Terpadu',
    content: 'Pemerintah Kota meluncurkan portal layanan terpadu yang memungkinkan warga mengurus 50+ jenis izin secara online dalam satu platform.',
    date: '2025-11-20',
    category: 'teknologi',
    link: 'https://example.com/berita1'
  },
  {
    id: 2,
    title: 'Program Beasiswa untuk Siswa Berprestasi',
    content: 'Dinas Pendidikan membuka pendaftaran beasiswa bagi siswa SMP/SMA berprestasi dengan keterbatasan ekonomi.',
    date: '2025-11-18',
    category: 'pendidikan',
    link: ''
  },
  {
    id: 3,
    title: 'Workshop Digital Marketing untuk UMKM',
    content: 'Dinas Koperasi menyelenggarakan workshop digital marketing gratis untuk membantu UMKM go digital dan meningkatkan penjualan online.',
    date: '2025-11-15',
    category: 'bisnis',
    link: 'https://workshop.digital.go.id'
  },
  {
    id: 4,
    title: 'Konser Musik Nusantara',
    content: 'Dinas Kebudayaan menggelar konser musik nusantara featuring artis lokal untuk mempromosikan budaya daerah.',
    date: '2025-11-12',
    category: 'hiburan',
    link: ''
  },
  {
    id: 5,
    title: 'Pelatihan Coding untuk Pemula',
    content: 'Komunitas programmer lokal mengadakan pelatihan coding gratis untuk pemula yang ingin belajar programming.',
    date: '2025-11-10',
    category: 'teknologi',
    link: 'https://coding.bootcamp.id'
  },
  {
    id: 6,
    title: 'Seminar Pendidikan Inklusif',
    content: 'Dinas Pendidikan mengadakan seminar tentang pendidikan inklusif untuk meningkatkan pemahaman masyarakat tentang pendidikan untuk semua.',
    date: '2025-11-08',
    category: 'pendidikan',
    link: ''
  },
  {
    id: 7,
    title: 'Pameran Produk Lokal',
    content: 'Pemerintah kota menggelar pameran produk lokal untuk mendukung UMKM dan meningkatkan ekonomi kreatif daerah.',
    date: '2025-11-05',
    category: 'bisnis',
    link: 'https://pameran.lokal.go.id'
  },
  {
    id: 8,
    title: 'Festival Film Dokumenter',
    content: 'Festival film dokumenter tahunan yang menampilkan karya sineas lokal tentang isu-isu sosial dan budaya.',
    date: '2025-11-03',
    category: 'hiburan',
    link: ''
  }
])

// === Computed ===
const paginatedBeritas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return beritas.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(beritas.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// === Methods ===
function openModal(berita = null) {
  editingBerita.value = berita
  if (berita) {
    beritaForm.value = { ...berita }
  } else {
    beritaForm.value = {
      id: null,
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      category: 'pendidikan',
      link: '',
      coverImage: ''
    }
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingBerita.value = null
}

function editBerita(berita) {
  openModal(berita)
}

function saveDraft() {
  // For now, just close modal. In real app, save to draft storage
  alert('Draft saved! (Feature coming soon)')
  closeModal()
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      beritaForm.value.coverImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function deleteBerita(id) {
  if (confirm('Yakin ingin menghapus berita ini? Tindakan tidak bisa dibatalkan.')) {
    beritas.value = beritas.value.filter(b => b.id !== id)
    // Reset to page 1 if current page exceeds total pages
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = 1
    }
  }
}

function openLink(url) {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// === Helpers ===
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function categoryLabel(cat) {
  return { 
    pendidikan: 'Pendidikan', 
    teknologi: 'Teknologi', 
    bisnis: 'Bisnis',
    hiburan: 'Hiburan',
    lainnya: 'Lainnya'
  }[cat] || cat
}

function categoryBadgeClass(cat) {
  return { 
    pendidikan: 'badge-primary',
    teknologi: 'badge-secondary',
    bisnis: 'badge-accent',
    hiburan: 'badge-neutral',
    lainnya: 'badge-outline'
  }[cat] || 'badge-outline'
}

function categoryIcon(cat) {
  return { 
    pendidikan: GraduationCapIcon, 
    teknologi: CpuIcon, 
    bisnis: BriefcaseIcon,
    hiburan: MusicIcon,
    lainnya: MoreHorizontalIcon
  }[cat] || MoreHorizontalIcon
}
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>