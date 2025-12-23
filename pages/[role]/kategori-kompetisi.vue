<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Kompetisi</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/kompetisi/form">
          Tambah Kompetisi
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Kompetisi"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="kompetisiData"
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
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editKompetisi(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteKompetisi(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon small color="blue" @click="viewKompetisi(item)" title="View">
                <v-icon>mdi-eye</v-icon>
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
    title: 'Daftar Kompetisi',
    disabled: true,
  },
]

const headers = [
  { title: 'No.', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '150px' }
]

const kompetisiData = ref([
  {
    no: 1,
    nama: 'Umum',
    keterangan: '',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 2,
    nama: 'Tes - penghargaan kategori inovator',
    keterangan: 'penghargaan kategori inovator',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 3,
    nama: 'Tes - Pembina',
    keterangan: 'pembina inovasi',
    gambar: 'https://jippnas.menpan.go.id/storage/images/kompetisi//QGaBnnmiJS8hzdxo.jpg',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 4,
    nama: 'Replikasi',
    keterangan: '',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 5,
    nama: 'PKRI',
    keterangan: 'Test PKRI',
    gambar: 'https://jippnas.menpan.go.id/storage/images/kompetisi//054sEgQVycgRbgjc.jpg',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 6,
    nama: 'OAPSI',
    keterangan: 'outstanding',
    gambar: 'https://jippnas.menpan.go.id/storage/images/kompetisi//8NkXWZrwp15HkpDO.jpg',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 7,
    nama: 'Khusus',
    keterangan: '',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 8,
    nama: 'Keberlanjutan',
    keterangan: 'memastikan keberlanjutaninovasi',
    gambar: 'https://jippnas.menpan.go.id/storage/images/kompetisi//Xi0c82ajdhEWEzTY.jpg',
    status: 'Aktif',
    action: ''
  }
])

function editKompetisi(item) {
  // Implementasi edit kompetisi
  alert('Edit: ' + item.nama)
}

function deleteKompetisi(item) {
  // Implementasi hapus kompetisi
  if (confirm('Yakin hapus kompetisi ' + item.nama + '?')) {
    kompetisiData.value = kompetisiData.value.filter(k => k.no !== item.no)
  }
}

function viewKompetisi(item) {
  // Implementasi view kompetisi
  alert('View: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>