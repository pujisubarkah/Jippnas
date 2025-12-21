<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen UPP</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/upp/form">
          Tambah UPP
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Judul"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="uppData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="blue" @click="logUpp(item)" title="Log">
                <v-icon>mdi-card-account-details</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editUpp(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
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
    title: 'Daftar UPP',
    disabled: true,
  },
]

const headers = [
  { title: 'No.', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const uppData = ref([
  {
    no: 1,
    nama: 'UPTD TPA Sampah Manggar Dinas Kebersihan Pertamanan dan Pemakaman',
    keterangan: 'Pemerintah Kota balikpapan - UPTD TPA Sampah Manggar Dinas Kebersihan Pertamanan dan Pemakaman',
    action: ''
  },
  {
    no: 2,
    nama: 'UPTD SPF SDN Pancuran 1',
    keterangan: 'Pemerintah Kabupaten bondowoso - UPTD SPF SDN Pancuran 1',
    action: ''
  },
  {
    no: 3,
    nama: 'UPTD SMP Negeri 4 Bumijawa',
    keterangan: 'Pemerintah Kabupaten tegal - UPTD SMP Negeri 4 Bumijawa',
    action: ''
  },
  {
    no: 4,
    nama: 'UPTD SMP Negeri 3',
    keterangan: 'Pemerintah Kabupaten tuban - UPTD SMP Negeri 3',
    action: ''
  },
  {
    no: 5,
    nama: 'UPTD SMK Negeri 3 Wonosari',
    keterangan: 'Pemerintah Kabupaten Purbalingga - UPTD SMK Negeri 3 Wonosari',
    action: ''
  },
  {
    no: 6,
    nama: 'UPTD SMK Negeri 3 Wonosari',
    keterangan: 'Pemerintah Kabupaten gunungkidul - UPTD SMK Negeri 3 Wonosari',
    action: ''
  },
  {
    no: 7,
    nama: 'UPTD Sistem Penanggulangan Gawat Darurat Terpadu Dinas Kesehatan',
    keterangan: 'Pemerintah Kabupaten Bangka - UPTD Sistem Penanggulangan Gawat Darurat Terpadu Dinas Kesehatan',
    action: ''
  },
  {
    no: 8,
    nama: 'UPTD Rumah Susun Sederhana Sewa',
    keterangan: 'Pemerintah Kota Cimahi - UPTD Rumah Susun Sederhana Sewa',
    action: ''
  },
  {
    no: 9,
    nama: 'UPTD Rumah Sakit Mata Bali Mandara - Dinas Kesehatan',
    keterangan: 'Pemerintah Provinsi Bali - UPTD Rumah Sakit Mata Bali Mandara - Dinas Kesehatan',
    action: ''
  },
  {
    no: 10,
    nama: 'UPTD Rumah Sakit Khusus Mata Masyarakat Dinas Kesehatan',
    keterangan: 'Pemerintah Provinsi Sumatera selatan - UPTD Rumah Sakit Khusus Mata Masyarakat Dinas Kesehatan',
    action: ''
  }
])

function logUpp(item) {
  // Implementasi log upp
  alert('Log: ' + item.nama)
}

function editUpp(item) {
  // Implementasi edit upp
  alert('Edit: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>