<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen List Inovasi</h1>

    <!-- Action Buttons -->
    <v-card class="mb-6">
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="me-2" to="/dashboard/inovasi/forms">
          <v-icon left>mdi-plus</v-icon>
          Tambah Inovasi
        </v-btn>
        <v-btn color="secondary" to="/dashboard/inovasi/form">
          <v-icon left>mdi-plus-multiple</v-icon>
          Tambah Sekaligus
        </v-btn>
      </v-card-header>
    </v-card>

    <!-- Breadcrumb -->
    <v-card class="mb-6">
      <v-card-text>
        <v-breadcrumbs :items="breadcrumbItems" divider=">"></v-breadcrumbs>
      </v-card-text>
    </v-card>

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
            <v-col cols="12" md="3">
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
          <template v-slot:item.actions="{ item }">
            <v-btn icon small color="primary" @click="viewInnovation(item)" title="Lihat Detail">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon small color="warning" @click="editInnovation(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click="deleteInnovation(item)" title="Hapus">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
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

import { ref, onMounted } from 'vue'

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const institutionFilter = ref('')
const loading = ref(false)

// Breadcrumb items
const breadcrumbItems = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Inovasi', href: '/dashboard/inovasi' },
  { title: 'Daftar Inovasi', disabled: true }
]

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
  { title: 'No Registrasi', key: 'noRegistrasi', align: 'start' },
  { title: 'Judul Inovasi', key: 'judul' },
  { title: 'Jenis Inovasi', key: 'jenis' },
  { title: 'Institusi', key: 'institusi' },
  { title: 'Instansi', key: 'instansi' },
  { title: 'Wilayah', key: 'wilayah' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Sample innovations data (replace with actual data fetching)
const innovations = ref([
  {
    noRegistrasi: '609805',
    judul: 'Tes ITSA LAGI',
    jenis: 'Digital',
    institusi: 'Provinsi',
    instansi: 'itsa',
    wilayah: 'DKI JAKARTA',
    status: 'Belum Lengkap'
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

const viewInnovation = (item) => {
  // Navigate to detail view
  console.log('Viewing innovation:', item)
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
  // Fetch data on mount
})
</script>

<style scoped>
/* No additional styles needed for standard layout */
</style>