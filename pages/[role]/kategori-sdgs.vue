<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Kategori SDG's</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addKategori">
          Tambah Kategori
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Kategori"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="kategoriList"
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
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editKategori(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteKategori(item)" title="Trash">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon small color="blue" @click="viewKategori(item)" title="View">
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
    title: 'Manajemen Kategori SDG\'s',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '150px' }
]

const kategoriList = ref([
  {
    no: 1,
    nama: "SDG 1",
    keterangan: "Deskripsi singkat SDG 1",
    gambar: "https://via.placeholder.com/100",
    status: "Aktif",
    aksi: ''
  },
  {
    no: 2,
    nama: "SDG 2",
    keterangan: "Deskripsi singkat SDG 2",
    gambar: "https://via.placeholder.com/100",
    status: "Nonaktif",
    aksi: ''
  }
])

function addKategori() {
  // Implementasi tambah kategori
  alert('Tambah Kategori baru')
}

function editKategori(item) {
  // Implementasi edit kategori
  alert('Edit: ' + item.nama)
}

function deleteKategori(item) {
  // Implementasi hapus kategori
  if (confirm('Yakin hapus kategori ' + item.nama + '?')) {
    kategoriList.value = kategoriList.value.filter(k => k.no !== item.no)
  }
}

function viewKategori(item) {
  // Implementasi view kategori
  alert('View: ' + item.nama)
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>