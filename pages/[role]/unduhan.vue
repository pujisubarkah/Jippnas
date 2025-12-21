<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Unduhan</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" href="https://jippnas.menpan.go.id/dashboard/unduhan/form">
          Tambah Unduhan
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Cari Unduhan"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="unduhanData"
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
            <v-btn icon small color="primary" @click="editItem(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="deleteItem(item)" title="Trash">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon small color="blue" @click="viewItem(item)" title="View">
              <v-icon>mdi-eye</v-icon>
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

const search = ref('')

const breadcrumbItems = [
  {
    title: 'Daftar Unduhan',
    disabled: true,
  },
]

const headers = [
  { title: 'No.', key: 'no', width: '50px' },
  { title: 'Judul', key: 'judul' },
  { title: 'Gambar', key: 'gambar', width: '120px' },
  { title: 'Deskripsi', key: 'deskripsi' },
  { title: 'File', key: 'file', width: '100px' },
  { title: 'Status', key: 'status', width: '80px' },
  { title: 'Action', key: 'action', sortable: false, width: '150px' }
]

const unduhanData = [
  {
    no: 1,
    judul: 'PP Nomor 38 Tahun 2017',
    gambar: 'https://jippnas.menpan.go.id/storage/images/unduhan//B4EmboMn30elxHma.jpg',
    deskripsi: 'Peraturan Pemerintah Nomor 38 Tahun 2017 tentang Inovasi Daerah',
    file: 'Tersedia',
    status: 'Aktif',
    action: '',
    pdfUrl: 'https://jippnas.menpan.go.id/storage/pdf/unduhan//C1Ln2FZse662qwVRJ6PppibkLpPkvuw2iOMz7rdp.pdf'
  },
  {
    no: 2,
    judul: 'Peraturan Menteri PANRB Nomor 89 Tahun 2020',
    gambar: 'https://jippnas.menpan.go.id/storage/images/unduhan//PiJvcdpPx0ybTWUg.jpg',
    deskripsi: 'Peraturan Menteri PANRB Nomor 89 Tahun 2020 tentang Penyelenggaraan Jaringan Inovasi Pelayanan Publik',
    file: 'Tersedia',
    status: 'Aktif',
    action: '',
    pdfUrl: 'https://jippnas.menpan.go.id/storage/pdf/unduhan//guUS5BQ1Dm4pjmPFdakX2JFJCjV8pbNdhDUuad2n.pdf'
  },
  {
    no: 3,
    judul: 'Peraturan Kepala LAN Nomor 7 Tahun 2023',
    gambar: 'https://jippnas.menpan.go.id/storage/images/unduhan//s4M0BBTsS8RjFe17.jpg',
    deskripsi: 'Peraturan Kepala LAN Nomor 7 Tahun 2023 tentang Laboratorium Inovasi',
    file: 'Tersedia',
    status: 'Aktif',
    action: '',
    pdfUrl: 'https://jippnas.menpan.go.id/storage/pdf/unduhan//gS6lJMh5JNnJx9fzOZeXtGdZH4zZPstjhpFTQPRc.pdf'
  },
  {
    no: 4,
    judul: 'Laporan Hasil Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik Nasional Tahun 2023',
    gambar: 'https://jippnas.menpan.go.id/storage/images/unduhan//y1ZZDkSAsqvCheTt.jpg',
    deskripsi: 'Diterbitkan oleh Kementerian PANRB',
    file: 'Tersedia',
    status: 'Aktif',
    action: '',
    pdfUrl: 'https://jippnas.menpan.go.id/storage/pdf/unduhan//4pQIhBNNmeT2da8k6agNQaBneTb5yBZq5FotJSle.pdf'
  },
  {
    no: 5,
    judul: 'Laporan Evaluasi Pembinaan Inovasi Pelayanan Publik 2024',
    gambar: 'https://jippnas.menpan.go.id/storage/images/unduhan//NdXiPfnxOaxFEud2.jpg',
    deskripsi: 'Laporan Evaluasi Pembinaan Inovasi Pelayanan Publik 2024',
    file: 'Tersedia',
    status: 'Aktif',
    action: '',
    pdfUrl: 'https://jippnas.menpan.go.id/storage/pdf/unduhan//mRyPpNoQwH0Efqx86tumpVKiIvfkDstH1FdgTcha.pdf'
  },
  {
    no: 6,
    judul: 'Buku Transformasi Administrasi Publik Menjawab Tantangan Era Disrupsi',
    gambar: 'https://jippnas.menpan.go.id/storage/images/unduhan//sXgOJ6T58WvAt9El.jpg',
    deskripsi: 'Diterbitkan oleh LAN RI',
    file: 'Tersedia',
    status: 'Aktif',
    action: '',
    pdfUrl: 'https://jippnas.menpan.go.id/storage/pdf/unduhan//GFRbJV0rCBJKkht6fLs0omm5OO9bzYI3Nqdg2wxW.pdf'
  }
]

const editItem = (item) => {
  console.log('Edit item', item.judul)
}

const deleteItem = (item) => {
  console.log('Delete item', item.judul)
}

const viewItem = (item) => {
  window.open(item.pdfUrl, '_blank')
}
</script>