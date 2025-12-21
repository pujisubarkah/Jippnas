<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Penghargaan</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/penghargaan/form">
          Tambah Penghargaan
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Penghargaan"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="penghargaanData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="100" height="100" contain></v-img>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn icon small color="primary" @click="editPenghargaan(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deletePenghargaan(item)" title="Delete">
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
import { ref } from 'vue'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')

const breadcrumbItems = [
  {
    title: 'Daftar Penghargaan',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const penghargaanData = ref([
  {
    no: 1,
    nama: 'TOP 99/2023',
    gambar: 'https://jippnas.menpan.go.id/storage/images/penghargaan/gambar/118/pTpVA3fx3zSCXNnRB9jg1W3Qj3kkBEiI7sQJIDez.png',
    keterangan: 'TOP 99/2023',
    status: 'Aktif',
    action: ''
  },
  {
    no: 2,
    nama: 'Top 99/2022',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Top 99/2022',
    status: 'Aktif',
    action: ''
  },
  {
    no: 3,
    nama: 'TOP 99/2021',
    gambar: 'https://jippnas.menpan.go.id/storage/1',
    keterangan: 'TOP 99/2021',
    status: 'Aktif',
    action: ''
  },
  {
    no: 4,
    nama: 'TOP 99/2020',
    gambar: 'https://jippnas.menpan.go.id/storage/',
    keterangan: '',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 5,
    nama: 'Top 99/2020',
    gambar: 'https://jippnas.menpan.go.id/storage/images/penghargaan/142/EmaKPydAbiGKbzsPTHt1b21bxrtWBFfuCfvx0GiU.png',
    keterangan: 'Top 99/2020',
    status: 'Aktif',
    action: ''
  },
  {
    no: 6,
    nama: 'Top 99/2019',
    gambar: 'https://jippnas.menpan.go.id/storage/',
    keterangan: '',
    status: 'Aktif',
    action: ''
  },
  {
    no: 7,
    nama: 'Top 99/2018',
    gambar: 'https://jippnas.menpan.go.id/storage/',
    keterangan: 'Top 99/2018',
    status: 'Aktif',
    action: ''
  },
  {
    no: 8,
    nama: 'Top 99/2017',
    gambar: 'https://jippnas.menpan.go.id/storage/',
    keterangan: 'Top 99/2017',
    status: 'Aktif',
    action: ''
  },
  {
    no: 9,
    nama: 'Top 99/2016',
    gambar: 'https://jippnas.menpan.go.id/storage/',
    keterangan: 'Top 99/2016',
    status: 'Aktif',
    action: ''
  },
  {
    no: 10,
    nama: 'Top 99/2015',
    gambar: 'https://jippnas.menpan.go.id/storage/',
    keterangan: 'Top 99/2015',
    status: 'Aktif',
    action: ''
  }
])

function editPenghargaan(item) {
  // Implementasi edit penghargaan
  alert('Edit: ' + item.nama)
}

function deletePenghargaan(item) {
  // Implementasi hapus penghargaan
  if (confirm('Yakin hapus penghargaan ' + item.nama + '?')) {
    penghargaanData.value = penghargaanData.value.filter(p => p.no !== item.no)
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>