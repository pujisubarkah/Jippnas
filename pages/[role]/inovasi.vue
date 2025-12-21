<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-blue-700">Manajemen Inovasi</h2>

    <!-- Filter & Tombol -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Filter Provinsi</label>
        <select
          v-model="selectedProvinsi"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Semua Provinsi</option>
          <option v-for="prov in provinces" :key="prov" :value="prov">
            {{ prov }}
          </option>
        </select>
      </div>
      <button
        @click="showInovasiModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Tambah Inovasi Baru
      </button>
    </div>

    <!-- Chart Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-semibold mb-2">Distribusi Kategori</h3>
        <div class="h-64">
          <Pie :data="chartData" :options="chartOptions" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-semibold mb-2">Inovasi per Provinsi</h3>
        <div class="h-64">
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>
    </div>

    <!-- Daftar Inovasi -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <h3 class="px-6 py-4 text-lg font-semibold border-b">Daftar Inovasi</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">No</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tahun</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">No Registrasi</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Judul Inovasi</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Badge</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Instansi</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Wilayah</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">SDG's</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama Inovator</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama Pemangku</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Publikasi</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Video</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(inovasi, index) in filteredInovasis" :key="inovasi.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-600">{{ index + 1 }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ inovasi.year || '2023' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ inovasi.registrationNumber || 'REG-001' }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ inovasi.title }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                  {{ inovasi.badge || 'Inovasi' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ inovasi.instansi || 'Instansi A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ inovasi.wilayah || inovasi.provinsi }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ inovasi.sdgs || 'SDG 3' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ inovasi.innovator || 'Nama Inovator' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ inovasi.pemangku || 'Nama Pemangku' }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">
                <a v-if="inovasi.publikasi" :href="inovasi.publikasi" target="_blank" class="text-blue-600 hover:underline">Link</a>
                <span v-else>-</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">
                <a v-if="inovasi.video" :href="inovasi.video" target="_blank" class="text-blue-600 hover:underline">Video</a>
                <span v-else>-</span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded"
                  :class="{
                    'bg-green-100 text-green-700': inovasi.status === 'approved',
                    'bg-yellow-100 text-yellow-700': inovasi.status === 'pending',
                    'bg-red-100 text-red-700': inovasi.status === 'rejected'
                  }"
                >
                  {{ inovasi.status || 'Pending' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredInovasis.length === 0">
              <td colspan="13" class="px-4 py-6 text-center text-gray-500">
                Tidak ada inovasi ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah Inovasi -->
    <transition name="modal">
      <div v-if="showInovasiModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" @click="showInovasiModal = false">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" @click.stop>
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="showInovasiModal = false">&times;</button>
          <h3 class="text-lg font-semibold mb-4">Tambah Inovasi Baru</h3>
          <form @submit.prevent="submitInovasi" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Judul Inovasi</label>
              <input v-model="inovasiForm.title" type="text" required class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea v-model="inovasiForm.description" required rows="3" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Kabupaten/Kota</label>
                <input v-model="inovasiForm.kabupaten" type="text" required class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Provinsi</label>
                <input v-model="inovasiForm.provinsi" type="text" required class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tanggal</label>
              <input v-model="inovasiForm.date" type="date" required class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kategori</label>
              <select v-model="inovasiForm.category" required class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="teknologi">Teknologi</option>
                <option value="pendidikan">Pendidikan</option>
                <option value="bisnis">Bisnis</option>
                <option value="lingkungan">Lingkungan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="showInovasiModal = false" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Batal</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import { Edit, Trash } from 'lucide-vue-next'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

definePageMeta({ layout: 'sidebar' })

// State
const showInovasiModal = ref(false)
const selectedProvinsi = ref('')

const inovasiForm = ref({
  title: '',
  description: '',
  kabupaten: '',
  provinsi: '',
  date: new Date().toISOString().split('T')[0],
  category: 'teknologi'
})

const inovasis = ref([
  {
    id: 1,
    year: 2023,
    registrationNumber: 'REG-001',
    title: 'Inovasi Teknologi Pertanian',
    badge: 'Inovasi',
    instansi: 'Dinas Pertanian',
    wilayah: 'Jawa Timur',
    sdgs: 'SDG 2',
    innovator: 'Ahmad Surya',
    pemangku: 'Budi Santoso',
    publikasi: 'https://example.com/pub1',
    video: 'https://example.com/video1',
    status: 'approved',
    provinsi: 'Jawa Timur',
    kabupaten: 'Malang',
    category: 'teknologi',
    date: '2023-05-15'
  },
  {
    id: 2,
    year: 2024,
    registrationNumber: 'REG-002',
    title: 'Sistem Pendidikan Online',
    badge: 'Inovasi',
    instansi: 'Dinas Pendidikan',
    wilayah: 'DKI Jakarta',
    sdgs: 'SDG 4',
    innovator: 'Siti Aminah',
    pemangku: 'Rudi Hartono',
    publikasi: '',
    video: 'https://example.com/video2',
    status: 'pending',
    provinsi: 'DKI Jakarta',
    kabupaten: 'Jakarta Pusat',
    category: 'pendidikan',
    date: '2024-03-20'
  },
  {
    id: 3,
    year: 2023,
    registrationNumber: 'REG-003',
    title: 'Bisnis Ramah Lingkungan',
    badge: 'Inovasi',
    instansi: 'Kementerian Lingkungan',
    wilayah: 'Jawa Barat',
    sdgs: 'SDG 13',
    innovator: 'Dewi Lestari',
    pemangku: 'Agus Wijaya',
    publikasi: 'https://example.com/pub3',
    video: '',
    status: 'rejected',
    provinsi: 'Jawa Barat',
    kabupaten: 'Bandung',
    category: 'bisnis',
    date: '2023-08-10'
  }
])

// Computed
const provinces = computed(() => [...new Set(inovasis.value.map(i => i.provinsi))])
const filteredInovasis = computed(() => {
  return selectedProvinsi.value
    ? inovasis.value.filter(i => i.provinsi === selectedProvinsi.value)
    : inovasis.value
})

const chartData = computed(() => ({
  labels: ['Teknologi', 'Pendidikan', 'Bisnis', 'Lingkungan', 'Lainnya'],
  datasets: [{
    data: ['teknologi', 'pendidikan', 'bisnis', 'lingkungan', 'lainnya'].map(cat =>
      filteredInovasis.value.filter(i => i.category === cat).length
    ),
    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    borderColor: ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed'],
    borderWidth: 1
  }]
}))

const barData = computed(() => ({
  labels: provinces.value,
  datasets: [{
    label: 'Jumlah Inovasi',
    data: provinces.value.map(prov =>
      filteredInovasis.value.filter(i => i.provinsi === prov).length
    ),
    backgroundColor: '#3b82f6'
  }]
}))

const chartOptions = { responsive: true, maintainAspectRatio: false }
const barOptions = { responsive: true, maintainAspectRatio: false }

// Helpers
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID')

// Methods
function submitInovasi() {
  inovasis.value.push({
    id: Date.now(),
    ...inovasiForm.value
  })
  inovasiForm.value = {
    title: '',
    description: '',
    kabupaten: '',
    provinsi: '',
    date: new Date().toISOString().split('T')[0],
    category: 'teknologi'
  }
  showInovasiModal.value = false
  alert('✅ Inovasi berhasil ditambahkan!')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>