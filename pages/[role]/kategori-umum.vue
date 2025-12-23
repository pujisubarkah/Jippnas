<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Kategori</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/kategori/form">
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
          :items="kategoriData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.gambar="{ item }">
            <v-img :src="item.gambar" width="50" height="50" contain></v-img>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Aktif' ? 'green' : 'red'" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="primary" @click="editKategori(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteKategori(item)" title="Delete">
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
    title: 'Daftar Kategori',
    disabled: true,
  },
]

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Nama', key: 'nama' },
  { title: 'Gambar', key: 'gambar', width: '60px' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Tahun', key: 'tahun', width: '60px' },
  { title: 'Jenis', key: 'jenis', width: '50px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '100px' }
]

const kategoriData = ref([
  {
    no: 1,
    nama: 'Tata kelola penyelenggaraan pelayanan publik yang efektif efisien dan berkinerja tinggi',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tata kelola pemerintahan, meliputi salah satu atau lebih unsur partisipasi, akuntabilitas, transparansi, efektivitas dan efisiensi penyelenggaraan pemerintahan, kualitas regulasi, penegakan hukum, ketertiban sosial, dan kontrol terhadap korupsi dalam p',
    tahun: '2018',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 2,
    nama: 'Tata Kelola Pemerintahan',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tata Kelola Pemerintahan',
    tahun: '2021',
    jenis: '0',
    status: 'Aktif',
    action: ''
  },
  {
    no: 3,
    nama: 'Tata kelola pemerintahan',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tata kelola pemerintahan, meliputi salah satu atau lebih unsur partisipasi, akuntabilitas, transparansi, efektivitas dan efisiensi penyelenggaraan pemerintahan, kualitas regulasi, penegakan hukum, ketertiban sosial, dan kontrol terhadap korupsi dalam p',
    tahun: '2016',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 4,
    nama: 'Tata kelola Pemerintahan',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tata kelola Pemerintahan',
    tahun: '2019',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 5,
    nama: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Perdamaian, Keadilan dan Kelembagaan yang Tangguh',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Perdamaian, Keadilan dan Kelembagaan yang Tangguh',
    tahun: '',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 6,
    nama: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Perdamaian, Keadilan dan Kelembagaan yang Tangguh',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Perdamaian, Keadilan dan Kelembagaan yang Tangguh',
    tahun: '',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 7,
    nama: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Perdamaian, Keadilan dan Kelembagaan yang Tangguh',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Perdamaian, Keadilan dan Kelembagaan yang Tangguh',
    tahun: '',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 8,
    nama: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Berkurangnya Kesenjangan, Kemitraan untuk Mencapai Tujuan',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Berkurangnya Kesenjangan, Kemitraan untuk Mencapai Tujuan',
    tahun: '',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 9,
    nama: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Berkurangnya Kesenjangan, Kemitraan untuk Mencapai Tujuan',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Berkurangnya Kesenjangan, Kemitraan untuk Mencapai Tujuan',
    tahun: '',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  },
  {
    no: 10,
    nama: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Berkurangnya Kesenjangan, Kemitraan untuk Mencapai Tujuan',
    gambar: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    keterangan: 'Tanpa Kemiskinan, Tanpa Kelaparan, Pekerjaan Layak dan Pertumbuhan Ekonomi, Berkurangnya Kesenjangan, Kemitraan untuk Mencapai Tujuan',
    tahun: '',
    jenis: '0',
    status: 'Tidak Aktif',
    action: ''
  }
])

function editKategori(item) {
  // Implementasi edit kategori
  alert('Edit: ' + item.nama)
}

function deleteKategori(item) {
  // Implementasi hapus kategori
  if (confirm('Yakin hapus kategori ' + item.nama + '?')) {
    kategoriData.value = kategoriData.value.filter(k => k.no !== item.no)
  }
}
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>