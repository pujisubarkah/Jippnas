<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Wilayah</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/wilayah/form">
          Tambah Wilayah
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Wilayah"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="wilayahData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="blue" @click="logWilayah(item)" title="Log">
                <v-icon>mdi-card-account-details</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editWilayah(item)" title="Edit">
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
    title: 'Daftar Wilayah',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Jenis', key: 'jenis', width: '80px' },
  { title: 'Ibukota', key: 'ibukota', width: '100px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const wilayahData = ref([
  {
    no: 1,
    id: '96',
    nama: 'PAPUA BARAT DAYA',
    jenis: '',
    ibukota: '',
    action: ''
  },
  {
    no: 2,
    id: '95',
    nama: 'PAPUA PEGUNUNGAN',
    jenis: '',
    ibukota: '',
    action: ''
  },
  {
    no: 3,
    id: '94',
    nama: 'PAPUA TENGAH',
    jenis: '',
    ibukota: '',
    action: ''
  },
  {
    no: 4,
    id: '93',
    nama: 'PAPUA SELATAN',
    jenis: '',
    ibukota: '',
    action: ''
  },
  {
    no: 5,
    id: '92.71',
    nama: 'KOTA SORONG',
    jenis: 'Pemkot',
    ibukota: 'Sorong',
    action: ''
  },
  {
    no: 6,
    id: '92.12',
    nama: 'KAB. PEGUNUNGAN ARFAK',
    jenis: 'Pemkab',
    ibukota: 'Anggi',
    action: ''
  },
  {
    no: 7,
    id: '92.11',
    nama: 'KAB. MANOKWARI SELATAN',
    jenis: 'Pemkab',
    ibukota: 'Ransiki',
    action: ''
  },
  {
    no: 8,
    id: '92.10',
    nama: 'KAB. MAYBRAT',
    jenis: 'Pemkab',
    ibukota: 'Kumurkek',
    action: ''
  },
  {
    no: 9,
    id: '92.09',
    nama: 'KAB. TAMBRAUW',
    jenis: 'Pemkab',
    ibukota: 'Fef',
    action: ''
  },
  {
    no: 10,
    id: '92.08',
    nama: 'KAB. KAIMANA',
    jenis: 'Pemkab',
    ibukota: 'Kaimana',
    action: ''
  }
])

function logWilayah(item) {
  // Implementasi log wilayah
  alert('Log: ' + item.nama)
}

function editWilayah(item) {
  // Implementasi edit wilayah
  alert('Edit: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>