<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Inovasi {{ userInstansi }}</h1>

    <!-- Action Buttons -->
    <v-card class="mb-6" v-if="isAdmin">
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="me-2" :to="`/${role}/inovasi/forms`">
          <v-icon left>mdi-plus</v-icon>
          Tambah Inovasi
        </v-btn>
        <v-btn color="secondary" :to="`/${role}/inovasi/form`">
          <v-icon left>mdi-plus-multiple</v-icon>
          Tambah Sekaligus
        </v-btn>
      </v-card-header>
    </v-card>

    <v-card class="mb-6" v-else>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" :to="`/${role}/inovasi/forms`">
          <v-icon left>mdi-plus</v-icon>
          Tambah Inovasi Baru
        </v-btn>
      </v-card-header>
    </v-card>

    <!-- Breadcrumb -->
    <v-card class="mb-6">
      <v-card-text>
        <v-breadcrumbs :items="breadcrumbItems" divider=">"></v-breadcrumbs>
      </v-card-text>
    </v-card>

    <!-- Info Instansi untuk User -->
    <v-alert v-if="!isAdmin && userInstansi" type="info" variant="tonal" class="mb-6">
      <strong>Menampilkan inovasi untuk:</strong> {{ userInstansi }}
    </v-alert>

    <!-- Filters -->
    <v-card class="mb-6">
      <v-card-header>
        <v-card-title>Filter Pencarian</v-card-title>
      </v-card-header>
      <v-card-text>
        <v-form @submit.prevent="searchInnovations">
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="searchQuery"
                label="Cari Judul"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="categoryFilter"
                :items="categoryOptions"
                label="Pilih Kategori"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3" v-if="isAdmin">
              <v-select
                v-model="institutionFilter"
                :items="institutionOptions"
                label="Pilih Instansi"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn type="submit" color="primary" prepend-icon="mdi-filter">
                Terapkan Filter
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card>
      <v-card-header>
        <v-card-title>Daftar Inovasi</v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="exportData" title="Export Data">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="innovations"
          :loading="loading"
          :items-per-page="10"
          :search="searchQuery"
          class="elevation-1"
        >
          <template v-slot:item.no="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex">
              <v-btn icon small color="info" @click="viewLog(item)" title="Log">
                <v-icon>mdi-history</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="viewInnovation(item)" title="Detail">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon small color="warning" @click="editInnovation(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteInnovation(item)" title="Trash">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sidebar'
})

import { ref, onMounted, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRoute } from 'vue-router'

const { user } = useAuth()
const route = useRoute()
const role = computed(() => route.params.role || 'user')

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const institutionFilter = ref('')
const loading = ref(false)
const userInstansi = ref('')
const isAdmin = computed(() => user.value?.id_peran === 2)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { title: 'Dashboard', href: `/${role.value}/dashboard` },
  { title: 'Inovasi', disabled: true }
])

// Options for filters
const statusOptions = [
  { title: 'Status', value: '' },
  { title: 'Lengkap', value: 'Lengkap' },
  { title: 'Belum Lengkap', value: 'Belum Lengkap' }
]

const categoryOptions = [
  { title: '-- Pilih Kategori --', value: '' },
  { title: 'Tanpa Kemiskinan', value: 'Tanpa Kemiskinan' },
  // Add more categories as needed
]

const institutionOptions = [
  { title: '-- Pilih Instansi --', value: '' },
  { title: 'PT PLN (Persero)', value: 'PT PLN (Persero)' },
  // Add more institutions as needed
]

// Table headers
const headers = [
  { title: 'No', key: 'no', align: 'start', sortable: false },
  { title: 'Tahun', key: 'tahun' },
  { title: 'No Registrasi', key: 'noRegistrasi' },
  { title: 'Judul Inovasi', key: 'judul' },
  { title: 'Jenis Inovasi', key: 'jenis' },
  { title: 'Institusi', key: 'institusi' },
  { title: 'UPP', key: 'upp' },
  { title: 'Wilayah', key: 'wilayah' },
  { title: 'SDGs', key: 'sdgs' },
  { title: 'Penghargaan', key: 'penghargaan' },
  { title: 'Tahun Implementasi', key: 'tahunImplementasi' },
  { title: 'Nama Inovator', key: 'namaInnovator' },
  { title: 'Nama Pemangku', key: 'namaPemangku' },
  { title: 'Video', key: 'video' },
  { title: 'Jumlah Replikasi', key: 'jumlahReplikasi' },
  { title: 'Alasan Keberlanjutan', key: 'alasanKeberlanjutan' },
  { title: 'Keberlanjutan', key: 'keberlanjutan' },
  { title: 'Status', key: 'status' },
  { title: 'Last Update', key: 'lastUpdate' },
  { title: 'Aksi', key: 'actions', sortable: false }
]

// Sample innovations data (replace with actual data fetching)
const innovations = ref([
  {
    id: 1,
    no: 1,
    tahun: '2023',
    noRegistrasi: '609805',
    judul: 'Tes ITSA LAGI',
    jenis: 'Digital',
    institusi: 'PT PLN (Persero)',
    upp: 'Unit TI',
    wilayah: 'Jakarta',
    sdgs: 'SDG 9',
    penghargaan: 'Tidak Ada',
    tahunImplementasi: '2023',
    namaInnovator: 'John Doe',
    namaPemangku: 'Jane Smith',
    video: 'https://example.com/video',
    jumlahReplikasi: 5,
    alasanKeberlanjutan: 'Efisien',
    keberlanjutan: 'Ya',
    status: 'Belum Lengkap',
    lastUpdate: '2023-12-01'
  },
  // Add more sample data
])

// Methods
const searchInnovations = () => {
  // Implement search logic
  console.log('Searching with filters:', {
    searchQuery: searchQuery.value,
    statusFilter: statusFilter.value,
    categoryFilter: categoryFilter.value,
    institutionFilter: institutionFilter.value
  })
}

const viewLog = (item) => {
  // Navigate to log view
  console.log('Viewing log for innovation:', item)
}

const viewInnovation = (item) => {
  // Navigate to detail view
  navigateTo(`/${role.value}/list-inovasi/${item.id}`)
}

const editInnovation = (item) => {
  // Navigate to edit form
  console.log('Editing innovation:', item)
}

const deleteInnovation = (item) => {
  // Confirm and delete
  console.log('Deleting innovation:', item)
}

const exportData = () => {
  // Implement export logic
  console.log('Exporting data')
}

onMounted(() => {
  // Ambil data user dari localStorage
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      userInstansi.value = parsedUser.nm_instansi || 'Tidak Diketahui'
      
      // Jika bukan admin, set filter instansi otomatis
      if (!isAdmin.value) {
        institutionFilter.value = userInstansi.value
      }
    }
  }
  
  // Fetch data inovasi
  fetchInnovations()
})

const fetchInnovations = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // const response = await $fetch('/api/master-inovasi', {
    //   params: {
    //     instansi: !isAdmin.value ? userInstansi.value : institutionFilter.value,
    //     search: searchQuery.value,
    //     status: statusFilter.value,
    //     category: categoryFilter.value
    //   }
    // })
    // innovations.value = response.data
    
    console.log('Fetching innovations for instansi:', userInstansi.value)
  } catch (error) {
    console.error('Error fetching innovations:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* No additional styles needed for standard layout */
</style>