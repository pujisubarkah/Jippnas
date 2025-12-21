<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen List Ide Inovasi</h1>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="inovasiData"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.badge="{ item }">
            <v-chip :color="getBadgeColor(item.badge)" dark>{{ item.badge }}</v-chip>
          </template>
          <template v-slot:item.sdgs="{ item }">
            <v-chip v-for="sdg in item.sdgs" :key="sdg" small color="blue" class="mr-1">{{ sdg }}</v-chip>
          </template>
          <template v-slot:item.publikasi="{ item }">
            <v-btn icon small color="primary" @click="viewPublikasi(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.video="{ item }">
            <v-btn icon small color="red" @click="viewVideo(item)">
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.statusIde="{ item }">
            <v-chip :color="getStatusIdeColor(item.statusIde)" dark>{{ item.statusIde }}</v-chip>
          </template>
          <template v-slot:item.aksi="{ item }">
            <v-btn icon small color="green" @click="acceptSubmit(item)" title="Menerima Submit">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn icon small color="blue" @click="editItem(item)" title="Edit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="deleteItem(item)" title="Trash">
              <v-icon>mdi-delete</v-icon>
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

const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Tahun', key: 'tahun', width: '80px' },
  { title: 'No Registrasi', key: 'noRegistrasi' },
  { title: 'Judul Inovasi', key: 'judulInovasi' },
  { title: 'Badge', key: 'badge' },
  { title: 'Instansi', key: 'instansi' },
  { title: 'Wilayah', key: 'wilayah' },
  { title: "SDG's", key: 'sdgs' },
  { title: 'Nama Inovator', key: 'namaInovator' },
  { title: 'Nama Pemangku', key: 'namaPemangku' },
  { title: 'Publikasi', key: 'publikasi' },
  { title: 'Video', key: 'video' },
  { title: 'Status', key: 'status' },
  { title: 'Status Ide', key: 'statusIde' },
  { title: 'Aksi', key: 'aksi', sortable: false }
]

const inovasiData = [
  {
    no: 1,
    tahun: 2023,
    noRegistrasi: 'REG-001',
    judulInovasi: 'Inovasi Teknologi Hijau',
    badge: 'Gold',
    instansi: 'Kementerian Lingkungan Hidup',
    wilayah: 'Jakarta',
    sdgs: ['SDG 7', 'SDG 13'],
    namaInovator: 'Ahmad Surya',
    namaPemangku: 'Budi Santoso',
    publikasi: 'Link Publikasi',
    video: 'Link Video',
    status: 'Approved',
    statusIde: 'Submitted'
  },
  {
    no: 2,
    tahun: 2024,
    noRegistrasi: 'REG-002',
    judulInovasi: 'Sistem Edukasi Digital',
    badge: 'Silver',
    instansi: 'Kementerian Pendidikan',
    wilayah: 'Bandung',
    sdgs: ['SDG 4'],
    namaInovator: 'Siti Aminah',
    namaPemangku: 'Rudi Hartono',
    publikasi: 'Link Publikasi',
    video: 'Link Video',
    status: 'Pending',
    statusIde: 'Draft'
  },
  // Tambahkan data dummy lainnya sesuai kebutuhan
]

const getBadgeColor = (badge) => {
  switch (badge) {
    case 'Gold': return 'yellow'
    case 'Silver': return 'grey'
    case 'Bronze': return 'orange'
    default: return 'blue'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'green'
    case 'Pending': return 'orange'
    case 'Rejected': return 'red'
    default: return 'blue'
  }
}

const viewPublikasi = (item) => {
  // Logika untuk melihat publikasi
  console.log('View publikasi for', item.judulInovasi)
}

const getStatusIdeColor = (statusIde) => {
  switch (statusIde) {
    case 'Submitted': return 'blue'
    case 'Draft': return 'grey'
    case 'Approved': return 'green'
    case 'Rejected': return 'red'
    default: return 'blue'
  }
}

const acceptSubmit = (item) => {
  // Logika untuk menerima submit
  console.log('Accept submit for', item.judulInovasi)
  item.statusIde = 'Approved'
}

const editItem = (item) => {
  // Logika untuk edit
  console.log('Edit item', item.judulInovasi)
}

const deleteItem = (item) => {
  // Logika untuk delete
  console.log('Delete item', item.judulInovasi)
}
</script>