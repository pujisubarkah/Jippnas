<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen Ide Inovasi</h1>
    <v-card>
      <v-card-header>
        <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal">
          Tambah Ide Inovasi
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
        <div class="d-flex justify-content-center mb-4">
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="Status"
            variant="outlined"
            class="mr-2"
            style="max-width: 200px;"
          ></v-select>
          <v-select
            v-model="kategoriFilter"
            :items="kategoriOptions"
            label="Pilih Kategori"
            variant="outlined"
            class="mr-2"
            style="max-width: 300px;"
          ></v-select>
          <v-select
            v-model="instansiFilter"
            :items="instansiOptions"
            label="Pilih Instansi"
            variant="outlined"
            style="max-width: 300px;"
          ></v-select>
        </div>
        <v-data-table
          :headers="headers"
          :items="inovasiData"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          :loading="loading"
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
            <div class="d-flex align-center" style="gap:8px;">
              <v-btn icon small color="info" @click="openInfo(item)" title="Info">
                <v-icon>mdi-information</v-icon>
              </v-btn>
              <v-btn v-if="!item.statusIde || item.statusIde !== 'submit diterima'" icon small color="success" @click="acceptSubmit(item)" title="Menerima Submit">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editItem(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteItem(item)" title="Delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah Ide Inovasi -->
    <v-dialog v-model="showModal" max-width="800px" persistent>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          Tambah Ide Inovasi Baru
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form @submit.prevent="saveIdeInovasi" class="space-y-4">
            <v-text-field
              v-model="form.tahun"
              label="Tahun"
              type="date"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.noRegistrasi"
              label="No Registrasi"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.judulInovasi"
              label="Judul Inovasi *"
              required
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.badge"
              label="Badge"
              variant="outlined"
            ></v-text-field>

            <v-select
              v-model="form.instansi"
              :items="instansiOptions"
              label="Instansi"
              variant="outlined"
            ></v-select>

            <v-text-field
              v-model="form.wilayah"
              label="Wilayah"
              variant="outlined"
            ></v-text-field>

            <v-select
              v-model="form.sdgs"
              :items="kategoriOptions"
              label="SDG's"
              multiple
              variant="outlined"
            ></v-select>

            <v-text-field
              v-model="form.namaInovator"
              label="Nama Inovator"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.namaPemangku"
              label="Nama Pemangku"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.publikasi"
              label="Publikasi"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.video"
              label="Video"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.status"
              label="Status"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.statusIde"
              label="Status Ide"
              variant="outlined"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal">Batal</v-btn>
          <v-btn color="primary" @click="saveIdeInovasi">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'sidebar'
})

const search = ref('')
const statusFilter = ref('')
const kategoriFilter = ref('')
const instansiFilter = ref('')
const loading = ref(false)

// Modal state
const showModal = ref(false)

// Form data
const form = ref({
  tahun: '',
  noRegistrasi: '',
  judulInovasi: '',
  badge: '',
  instansi: '',
  wilayah: '',
  sdgs: [],
  namaInovator: '',
  namaPemangku: '',
  publikasi: '',
  video: '',
  status: '',
  statusIde: ''
})

const breadcrumbItems = [
  {
    title: 'Daftar Ide Inovasi',
    disabled: true,
  },
]

const statusOptions = [
  { title: 'Status', value: '' },
  { title: 'Active', value: 'Active' },
  { title: 'Non Active', value: 'Non Active' }
]

const kategoriOptions = [
  { title: '-- Pilih Kategori --', value: '' },
  { title: 'Tanpa Kemiskinan', value: 'Tanpa Kemiskinan' },
  { title: 'Tanpa Kelaparan', value: 'Tanpa Kelaparan' },
  { title: 'Kehidupan Sehat dan Sejahtera', value: 'Kehidupan Sehat dan Sejahtera' },
  { title: 'Pendidikan Berkualitas', value: 'Pendidikan Berkualitas' },
  { title: 'Kesetaraan Gender', value: 'Kesetaraan Gender' },
  { title: 'Air Bersih dan Sanitasi Layak', value: 'Air Bersih dan Sanitasi Layak' },
  { title: 'Energi Bersih dan Terjangkau', value: 'Energi Bersih dan Terjangkau' },
  { title: 'Pekerjaan Layak dan Pertumbuhan Ekonomi', value: 'Pekerjaan Layak dan Pertumbuhan Ekonomi' },
  { title: 'Industri Inovasi dan Infrastruktur', value: 'Industri Inovasi dan Infrastruktur' },
  { title: 'Berkurangnya Kesenjangan', value: 'Berkurangnya Kesenjangan' },
  { title: 'Kota dan Permukiman yang Berkelanjutan', value: 'Kota dan Permukiman yang Berkelanjutan' },
  { title: 'Konsumsi dan Produksi yang Bertanggung Jawab', value: 'Konsumsi dan Produksi yang Bertanggung Jawab' },
  { title: 'Penanganan Perubahan Iklim', value: 'Penanganan Perubahan Iklim' },
  { title: 'Ekosistem Lautan', value: 'Ekosistem Lautan' },
  { title: 'Ekosistem Daratan', value: 'Ekosistem Daratan' },
  { title: 'Perdamaian Keadilan dan Kelembagaan yang Tangguh', value: 'Perdamaian Keadilan dan Kelembagaan yang Tangguh' },
  { title: 'Kemitraan untuk Mencapai Tujuan', value: 'Kemitraan untuk Mencapai Tujuan' }
]

const instansiOptions = [
  { title: '-- Pilih Instansi --', value: '' },
  { title: 'PT PLN (Persero)', value: 'PT PLN (Persero)' },
  // Tambahkan lainnya
]

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
  { title: 'Action', key: 'aksi', sortable: false }
]

const inovasiData = ref([
  {
    no: 1,
    tahun: '2025-10-01',
    noRegistrasi: '',
    judulInovasi: 'Tes ITSA LAGI',
    badge: "Berjalan dengan pengembangan'",
    instansi: 'itsa',
    wilayah: 'DKI JAKARTA',
    sdgs: ['Tanpa Kelaparan'],
    namaInovator: 'itsa',
    namaPemangku: 'Kementerian Dalam Negeri',
    publikasi: 'Publis',
    video: 'a',
    status: 'Belum Lengkap',
    statusIde: 'submit diterima'
  },
  // Tambahkan data lainnya
])

const getBadgeColor = (badge) => {
  switch (badge) {
    case 'Gold': return 'yellow'
    case 'Silver': return 'grey'
    case 'Bronze': return 'orange'
    default: return 'blue'
  }
}

const getStatusIdeColor = (statusIde) => {
  switch (statusIde) {
    case 'submit diterima': return 'green'
    case 'Draft': return 'grey'
    case 'Approved': return 'green'
    case 'Rejected': return 'red'
    default: return 'blue'
  }
}

const viewPublikasi = (item) => {
  console.log('View publikasi for', item.judulInovasi)
}

const viewVideo = (item) => {
  console.log('View video for', item.judulInovasi)
}

const openInfo = (item) => {
  console.log('Open info for', item.judulInovasi)
}

const acceptSubmit = (item) => {
  item.statusIde = 'Approved'
  toast.success('Submit diterima')
}

const editItem = (item) => {
  console.log('Edit item', item.judulInovasi)
}

const deleteItem = (item) => {
  console.log('Delete item', item.judulInovasi)
}

// Modal functions
const openAddModal = () => {
  form.value = {
    tahun: '',
    noRegistrasi: '',
    judulInovasi: '',
    badge: '',
    instansi: '',
    wilayah: '',
    sdgs: [],
    namaInovator: '',
    namaPemangku: '',
    publikasi: '',
    video: '',
    status: '',
    statusIde: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveIdeInovasi = () => {
  if (!form.value.judulInovasi.trim()) {
    toast.warning('Judul Inovasi harus diisi')
    return
  }

  const newNo = inovasiData.value.length + 1
  inovasiData.value.push({
    no: newNo,
    ...form.value
  })

  toast.success('Ide Inovasi berhasil ditambahkan')
  closeModal()
}

onMounted(() => {
  // Data already loaded
})
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>