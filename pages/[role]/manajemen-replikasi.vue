<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Replikasi Inovasi</h1>

    <!-- Search and Filter Section -->
    <v-card class="mb-6">
      <v-card-text>
        <v-form @submit.prevent="searchReplications">
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="searchQuery"
                label="Cari Judul"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Filter Status"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Replication Cards -->
    <div class="space-y-4">
      <v-card
        v-for="replication in paginatedReplications"
        :key="replication.id"
        class="mb-4"
        :class="getStatusClass(replication.status)"
      >
        <!-- Card Header with Dates -->
        <v-card-text class="bg-grey-lighten-4">
          <v-row>
            <v-col cols="12" md="4">
              <div>
                <strong>Tanggal Pengajuan:</strong> {{ formatDate(replication.tanggalPengajuan) }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div>
                <strong>Tanggal Implementasi:</strong> {{ replication.tanggalImplementasi ? formatDate(replication.tanggalImplementasi) : '-' }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div>
                <strong>Tanggal Persetujuan:</strong> {{ replication.tanggalPersetujuan ? formatDate(replication.tanggalPersetujuan) : '-' }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Card Body with Details -->
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <strong>Judul Replikasi Inovasi:</strong><br>
                {{ replication.judulReplikasi }}
              </div>
              <div class="mb-4">
                <strong>Instansi Replikator Inovasi:</strong><br>
                {{ replication.instansiReplikator }}
              </div>
              <div class="mb-4">
                <strong>UPP Replikator Inovasi:</strong><br>
                {{ replication.uppReplikator }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <strong>Judul Inovasi:</strong><br>
                {{ replication.judulInovasi }}
              </div>
              <div class="mb-4">
                <strong>Instansi Pemilik Inovasi:</strong><br>
                {{ replication.instansiPemilik }}
              </div>
              <div class="mb-4">
                <strong>UPP Pemilik Inovasi:</strong><br>
                {{ replication.uppPemilik }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Card Actions -->
        <v-card-actions class="bg-grey-lighten-4">
          <v-row class="w-full">
            <v-col cols="12" md="6">
              <v-btn
                v-if="replication.status === 'implemen'"
                color="success"
                size="small"
                prepend-icon="mdi-play"
              >
                Tahap Implementasi
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" class="text-right">
              <v-btn
                v-if="replication.kesepakatanUrl"
                :href="replication.kesepakatanUrl"
                color="primary"
                size="small"
                class="mr-2"
                prepend-icon="mdi-download"
              >
                Unduh Kesepakatan
              </v-btn>
              <v-btn
                v-if="replication.persetujuanUrl"
                :href="replication.persetujuanUrl"
                color="secondary"
                size="small"
                class="mr-2"
                prepend-icon="mdi-download"
              >
                Unduh Persetujuan
              </v-btn>
              <v-btn
                v-if="replication.status === 'menunggu'"
                :href="replication.konfirmUrl"
                color="success"
                size="small"
                prepend-icon="mdi-check"
              >
                Setujui
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>

    <!-- Pagination -->
    <div class="mt-6 text-center">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        color="primary"
      ></v-pagination>

      <div class="mt-4 text-grey-darken-1">
        Menampilkan {{ startItem }} sampai {{ endItem }} dari {{ totalItems }} hasil
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sidebar'
})

import { ref, onMounted, computed } from 'vue'

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Sample replications data based on the HTML structure
const replications = ref([
  {
    id: 1,
    tanggalPengajuan: '2024-01-15',
    tanggalImplementasi: '2024-02-01',
    tanggalPersetujuan: '2024-01-20',
    judulReplikasi: 'Payment Point Drive Thru PBB-P2',
    instansiReplikator: 'Pemerintah Kabupaten Jember',
    uppReplikator: 'UPP Jember',
    judulInovasi: 'Payment Point Drive Thru PBB-P2',
    instansiPemilik: 'Pemerintah Kabupaten Banyuwangi',
    uppPemilik: 'UPP Banyuwangi',
    status: 'implemen',
    kesepakatanUrl: '/files/kesepakatan-1.pdf',
    persetujuanUrl: '/files/persetujuan-1.pdf',
    konfirmUrl: '/konfirm/1',
    dataString: 'replication-data-1'
  },
  {
    id: 2,
    tanggalPengajuan: '2024-02-10',
    tanggalImplementasi: '',
    tanggalPersetujuan: '2024-02-15',
    judulReplikasi: 'Sistem Informasi Jabatan',
    instansiReplikator: 'Pemerintah Provinsi Jambi',
    uppReplikator: 'UPP Jambi',
    judulInovasi: 'Sistem Informasi Jabatan Provinsi Riau',
    instansiPemilik: 'Pemerintah Provinsi Riau',
    uppPemilik: 'UPP Riau',
    status: 'menunggu',
    kesepakatanUrl: '',
    persetujuanUrl: '/files/persetujuan-2.pdf',
    konfirmUrl: '/konfirm/2',
    dataString: 'replication-data-2'
  },
  {
    id: 3,
    tanggalPengajuan: '2024-03-05',
    tanggalImplementasi: '2024-03-20',
    tanggalPersetujuan: '2024-03-10',
    judulReplikasi: 'BARIS DITEBAS',
    instansiReplikator: 'Pemerintah Provinsi Bali',
    uppReplikator: 'UPP Bali',
    judulInovasi: 'BARIS DITEBAS',
    instansiPemilik: 'Kementerian Sosial',
    uppPemilik: 'UPP Kementerian Sosial',
    status: 'disetujui',
    kesepakatanUrl: '/files/kesepakatan-3.pdf',
    persetujuanUrl: '/files/persetujuan-3.pdf',
    konfirmUrl: '',
    dataString: 'replication-data-3'
  },
  {
    id: 4,
    tanggalPengajuan: '2024-04-01',
    tanggalImplementasi: '',
    tanggalPersetujuan: '',
    judulReplikasi: 'E-Government Platform',
    instansiReplikator: 'Pemerintah Kota Surabaya',
    uppReplikator: 'UPP Surabaya',
    judulInovasi: 'Smart City Platform',
    instansiPemilik: 'Pemerintah Kota Jakarta',
    uppPemilik: 'UPP Jakarta',
    status: 'tolak',
    kesepakatanUrl: '',
    persetujuanUrl: '',
    konfirmUrl: '',
    dataString: 'replication-data-4'
  }
])

// Computed properties for pagination
const filteredReplications = computed(() => {
  let filtered = replications.value

  if (searchQuery.value) {
    filtered = filtered.filter(replication =>
      replication.judulReplikasi.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      replication.judulInovasi.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(replication => replication.status === statusFilter.value)
  }

  return filtered
})

const totalItems = computed(() => filteredReplications.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginatedReplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredReplications.value.slice(start, end)
})

const startItem = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, totalItems.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Options for status filter
const statusOptions = [
  { title: 'Semua Status', value: '' },
  { title: 'Menunggu', value: 'menunggu' },
  { title: 'Disetujui', value: 'disetujui' },
  { title: 'Implementasi', value: 'implemen' },
  { title: 'Ditolak', value: 'tolak' }
]

// Methods
const searchReplications = () => {
  currentPage.value = 1 // Reset to first page when searching
}

const getStatusClass = (status) => {
  switch (status) {
    case 'menunggu':
      return 'border-l-4 border-warning'
    case 'disetujui':
      return 'border-l-4 border-success'
    case 'implemen':
      return 'border-l-4 border-info'
    case 'tolak':
      return 'border-l-4 border-error'
    default:
      return ''
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  // Any initialization logic here
})
</script>

<style scoped>
/* Status border colors using Vuetify color classes */
.border-l-4 {
  border-left-width: 4px !important;
}

.border-warning {
  border-left-color: rgb(var(--v-theme-warning)) !important;
}

.border-success {
  border-left-color: rgb(var(--v-theme-success)) !important;
}

.border-info {
  border-left-color: rgb(var(--v-theme-info)) !important;
}

.border-error {
  border-left-color: rgb(var(--v-theme-error)) !important;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.w-full {
  width: 100%;
}

.text-right {
  text-align: right;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>