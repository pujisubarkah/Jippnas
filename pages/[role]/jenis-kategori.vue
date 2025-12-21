<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Jenis Kategori</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/jenis_kategori/form">
          Tambah Jenis Kategori
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Jenis Kategori"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="jenisKategoriData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn icon small color="primary" @click="editJenisKategori(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="deleteJenisKategori(item)" title="Delete">
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
    title: 'Daftar Jenis Kategori',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const jenisKategoriData = ref([])

function editJenisKategori(item) {
  // Implementasi edit jenis kategori
  alert('Edit: ' + item.nama)
}

function deleteJenisKategori(item) {
  // Implementasi hapus jenis kategori
  if (confirm('Yakin hapus jenis kategori ' + item.nama + '?')) {
    jenisKategoriData.value = jenisKategoriData.value.filter(j => j.no !== item.no)
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>