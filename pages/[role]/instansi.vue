<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Instansi</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/instansi/form">
          Tambah Instansi
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Instansi"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="instansiData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.statusHub="{ item }">
            <v-chip :color="item.statusHub === 'Memiliki Hub' ? 'green' : 'red'" dark>{{ item.statusHub }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="blue" @click="logInstansi(item)" title="Log">
                <v-icon>mdi-card-account-details</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editInstansi(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="green" @click="statusHubInstansi(item)" title="Status Hub">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')

const breadcrumbItems = [
  {
    title: 'Daftar Instansi',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Singkatan', key: 'singkatan', width: '100px' },
  { title: 'Alamat', key: 'alamat' },
  { title: 'Telp', key: 'telp', width: '80px' },
  { title: 'Status Hub', key: 'statusHub', width: '100px' },
  { title: 'Action', key: 'action', sortable: false, width: '150px' }
]

const instansiData = ref([
  {
    no: 1,
    nama: 'PT Telkom Indonesia (Persero) Tbk',
    singkatan: 'Telkom',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 2,
    nama: 'PT Taspen (Persero)',
    singkatan: 'Taspen',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 3,
    nama: 'PT PLN (Persero)',
    singkatan: 'PLN',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 4,
    nama: 'PT Pelabuhan Indonesia III (Persero)',
    singkatan: 'Pelindo III',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 5,
    nama: 'PT Pelabuhan Indonesia II (Persero)',
    singkatan: 'Pelindo II',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 6,
    nama: 'PT Pelabuhan Indonesia I (Persero)',
    singkatan: 'Pelindo I',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 7,
    nama: 'PT Angkasa Pura I (Persero)',
    singkatan: 'Angkasa Pura I',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 8,
    nama: 'Perseroan Terbatas Jamkrida Bali Mandara',
    singkatan: 'Jamkrida Bali',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 9,
    nama: 'Perpustakaan Nasional Republik Indonesia',
    singkatan: 'Perpusnas',
    alamat: '',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  },
  {
    no: 10,
    nama: 'PemerintahKabupaten Toba Samosir',
    singkatan: 'PEMKAB TOBA SAMOSIR',
    alamat: 'JL. Negara No.11, Lubuk Pakam',
    telp: '',
    statusHub: 'Belum Memiliki Hub',
    action: ''
  }
])

function logInstansi(item) {
  // Implementasi log instansi
  alert('Log: ' + item.nama)
}

function editInstansi(item) {
  // Implementasi edit instansi
  alert('Edit: ' + item.nama)
}

function statusHubInstansi(item) {
  // Implementasi ubah status hub instansi
  alert('Status Hub: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>