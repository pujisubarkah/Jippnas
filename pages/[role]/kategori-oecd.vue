<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Kategori OECD</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/oecd/form">
          Tambah OECD
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Nama OECD"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="oecdData"
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
            <v-btn icon small color="primary" @click="editOecd(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="deleteOecd(item)" title="Delete">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
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
    title: 'Daftar Kategori OECD',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const oecdData = ref([
  {
    no: 1,
    nama: 'testing - kategori gender responsive',
    keterangan: 'gender',
    gambar: 'https://jippnas.menpan.go.id/storage/images/oecd//X4RUML50fX9ISm5i.jpg',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 2,
    nama: 'testing - coba Kategori OECD 5',
    keterangan: 'lingkungan hidup, gender, inkulusif',
    gambar: 'https://jippnas.menpan.go.id/storage/images/oecd/6/MvuZwZ120C3iUjAW.jpg',
    status: 'Aktif',
    action: ''
  },
  {
    no: 3,
    nama: 'testing',
    keterangan: 'https://drive.google.com/drive/folders/1Te6b_YX1iN5BzHoDCCAP9uBpSWESzSnh',
    gambar: 'https://jippnas.menpan.go.id/storage/images/oecd//QI1bOHl8bhyQXR2E.jpg',
    status: 'Aktif',
    action: ''
  },
  {
    no: 4,
    nama: 'tes',
    keterangan: 'jippnas.menpan.go.id',
    gambar: 'https://jippnas.menpan.go.id/storage/images/oecd//eygOxNuARpLYfeww.jpg',
    status: 'Aktif',
    action: ''
  },
  {
    no: 5,
    nama: 'tes',
    keterangan: 'https://jippnas.menpan.go.id/dashboard/oecd/form',
    gambar: 'https://jippnas.menpan.go.id/storage/images/oecd//6NF5Zhync44gA5aK.jpg',
    status: 'Aktif',
    action: ''
  },
  {
    no: 6,
    nama: 'Birth',
    keterangan: 'Yyy',
    gambar: 'https://jippnas.menpan.go.id/storage/images/oecd//SR4lzwKNDoEvseKB.jpg',
    status: 'Aktif',
    action: ''
  }
])

function editOecd(item) {
  // Implementasi edit oecd
  alert('Edit: ' + item.nama)
}

function deleteOecd(item) {
  // Implementasi hapus oecd
  if (confirm('Yakin hapus oecd ' + item.nama + '?')) {
    oecdData.value = oecdData.value.filter(o => o.no !== item.no)
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>