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
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Judul</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Lokasi</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Kategori</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inovasi in filteredInovasis" :key="inovasi.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ inovasi.title }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">
                {{ inovasi.kabupaten }}, {{ inovasi.provinsi }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded"
                  :class="{
                    'bg-blue-100 text-blue-700': inovasi.category === 'teknologi',
                    'bg-green-100 text-green-700': inovasi.category === 'pendidikan',
                    'bg-amber-100 text-amber-700': inovasi.category === 'bisnis',
                    'bg-red-100 text-red-700': inovasi.category === 'lingkungan',
                    'bg-purple-100 text-purple-700': inovasi.category === 'lainnya'
                  }"
                >
                  {{ capitalize(inovasi.category) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(inovasi.date) }}</td>
              <td class="px-4 py-3">
                <button class="text-blue-600 hover:text-blue-800 mr-2" title="Edit">
                  <Edit class="w-4 h-4" />
                </button>
                <button class="text-red-600 hover:text-red-800" title="Hapus">
                  <Trash class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredInovasis.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
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
  // ... data dummy seperti di atas
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