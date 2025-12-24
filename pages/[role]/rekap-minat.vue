<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manajemen List Minat Replikasi Inovasi</h1>

    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <div class="d-flex gap-2">
          <v-btn color="primary" size="small" @click="exportData('copy')">
            <v-icon left>mdi-content-copy</v-icon>
            Copy
          </v-btn>
          <v-btn color="primary" size="small" @click="exportData('csv')">
            <v-icon left>mdi-file-delimited</v-icon>
            CSV
          </v-btn>
          <v-btn color="primary" size="small" @click="exportData('excel')">
            <v-icon left>mdi-file-excel</v-icon>
            Excel
          </v-btn>
          <v-btn color="primary" size="small" @click="exportData('pdf')">
            <v-icon left>mdi-file-pdf-box</v-icon>
            PDF
          </v-btn>
          <v-btn color="primary" size="small" @click="exportData('print')">
            <v-icon left>mdi-printer</v-icon>
            Print
          </v-btn>
        </div>
      </v-card-header>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="minatData"
          :loading="loading"
          :items-per-page="10"
          class="elevation-1"
          :search="searchQuery"
        >
          <template v-slot:item.verifikasi="{ item }">
            <v-chip
              :color="getVerificationColor(item.verifikasi)"
              dark
              small
            >
              {{ item.verifikasi === 'V' ? 'Verified' : item.verifikasi === 'X' ? 'TIDAK VALID' : 'Belum diverifikasi' }}
            </v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <div class="d-flex">
              <v-btn
                v-if="!item.verifikasi || item.verifikasi === ' '"
                icon
                small
                color="error"
                @click="openVerificationModal(item)"
                title="Info"
              >
                <v-icon>mdi-information</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Verification Modal -->
    <v-dialog v-model="showVerificationModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-red-600 font-bold">
          Verifikasi Minat Replikasi
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitVerification">
            <v-radio-group v-model="verificationForm.verify" inline>
              <v-radio label="Ya" value="1"></v-radio>
              <v-radio label="Tidak" value="0"></v-radio>
            </v-radio-group>

            <v-text-field
              v-model="verificationForm.verifKet"
              label="Keterangan"
              placeholder="Masukkan keterangan"
              variant="outlined"
              class="mt-4"
            ></v-text-field>

            <div class="text-center mt-4">
              <v-btn color="secondary" class="mr-2" @click="resetVerificationForm">
                Reset
              </v-btn>
              <v-btn color="error" type="submit">
                Submit
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Info Modal -->
    <v-dialog v-model="showInfoModal" max-width="1200px">
      <v-card>
        <v-card-title>Perbandingan Inovasi</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="compareHeaders"
            :items="compareData"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sidebar'
})

import { ref, computed, onMounted } from 'vue'

// Reactive data
const searchQuery = ref('')
const loading = ref(false)
const showVerificationModal = ref(false)
const showInfoModal = ref(false)

// Form data for verification
const verificationForm = ref({
  id: '',
  verify: '',
  verifKet: ''
})

// Table headers
const headers = [
  { title: 'No', key: 'no', align: 'start', sortable: false },
  { title: 'Nama Replikator', key: 'namaReplikator' },
  { title: 'Email Replikator', key: 'emailReplikator' },
  { title: 'Status Replikator', key: 'statusReplikator' },
  { title: 'Kode NRI', key: 'kodeNRI' },
  { title: 'Judul Inovasi Diminati', key: 'judulInovasiDiminati' },
  { title: 'Instansi Pemilik Inovasi', key: 'instansiPemilikInovasi' },
  { title: 'UPP Pemilik Inovasi', key: 'uppPemilikInovasi' },
  { title: 'Penghargaan Inovasi', key: 'penghargaanInovasi' },
  { title: 'Kontak Replikator', key: 'kontakReplikator' },
  { title: 'Instansi Replikator inovasi', key: 'instansiReplikator' },
  { title: 'UPP Peminat', key: 'uppPeminat' },
  { title: 'Verifikasi', key: 'verifikasi' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Keterangan Tambahan', key: 'keteranganTambahan' },
  { title: 'Action', key: 'action', sortable: false }
]

// Compare table headers
const compareHeaders = [
  { title: 'Kode NRI', key: 'kodeNRI', width: '150px' },
  { title: 'Judul', key: 'judul' }
]

// Sample data based on the HTML
const minatData = ref([
  {
    no: 1,
    namaReplikator: 'Super Admin',
    emailReplikator: 'super_admin@jippnas.go.id',
    statusReplikator: 'instansi',
    kodeNRI: '316717',
    judulInovasiDiminati: 'Pengembangan Klinik Konsultasi Agribisnis',
    instansiPemilikInovasi: 'Pemerintah Kabupaten gunungkidul',
    uppPemilikInovasi: 'Badan Pelaksana Penyuluhan dan Ketahanan (BP2KP)',
    penghargaanInovasi: 'Top 35/2016',
    kontakReplikator: '',
    instansiReplikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    uppPeminat: 'Direktorat Pelayanan Publik',
    verifikasi: ' ',
    keterangan: 'Belum diverifikasi',
    keteranganTambahan: ''
  },
  {
    no: 2,
    namaReplikator: 'tugas resty',
    emailReplikator: 'tugasresty@gmail.com',
    statusReplikator: 'instansi',
    kodeNRI: '519966',
    judulInovasiDiminati: 'Prolanis – One Stop Service Pengelolaan Hipertensi dan Diabetes Melitus di Puskesmas Talagabodas Kota Bandung',
    instansiPemilikInovasi: 'Pemerintah Kota Bandung',
    uppPemilikInovasi: 'Dinas Kesehatan - RSUD Blambangan',
    penghargaanInovasi: 'Top 99/2015',
    kontakReplikator: '',
    instansiReplikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    uppPeminat: 'Deputi Pelayanan Publik',
    verifikasi: 'V',
    keterangan: 'Verified',
    keteranganTambahan: 'akan dijadwalkan untuk FGD'
  },
  {
    no: 3,
    namaReplikator: 'Super Admin',
    emailReplikator: 'super_admin@jippnas.go.id',
    statusReplikator: 'instansi',
    kodeNRI: '603114',
    judulInovasiDiminati: 'Media Center Kreatif (Layanan Informasi dan Pengaduan Berbasis Kasih Sayang)',
    instansiPemilikInovasi: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    uppPemilikInovasi: 'Biro Hukum dan KIP',
    penghargaanInovasi: 'Top 99/2016',
    kontakReplikator: '',
    instansiReplikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    uppPeminat: 'Direktorat Pelayanan Publik',
    verifikasi: ' ',
    keterangan: 'Belum diverifikasi',
    keteranganTambahan: ''
  },
  {
    no: 4,
    namaReplikator: 'upp menpan',
    emailReplikator: '',
    statusReplikator: 'instansi',
    kodeNRI: '519966',
    judulInovasiDiminati: 'Prolanis – One Stop Service Pengelolaan Hipertensi dan Diabetes Melitus di Puskesmas Talagabodas Kota Bandung',
    instansiPemilikInovasi: 'Pemerintah Kota Bandung',
    uppPemilikInovasi: 'Dinas Kesehatan - RSUD Blambangan',
    penghargaanInovasi: 'Top 99/2015',
    kontakReplikator: '089123812312',
    instansiReplikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    uppPeminat: 'Biro Komunikasi dan Pelayanan Publik',
    verifikasi: 'V',
    keterangan: 'Verified',
    keteranganTambahan: ''
  },
  {
    no: 5,
    namaReplikator: 'Pemerintah Kabupaten Situbondo',
    emailReplikator: '',
    statusReplikator: '',
    kodeNRI: '',
    judulInovasiDiminati: 'GERPAS (Gerai Pengurusan Dokumen Dasar Nelayan)',
    instansiPemilikInovasi: 'Pemerintah Kabupaten situbondo',
    uppPemilikInovasi: 'DINAS PETERNAKAN DAN PERIKANAN',
    penghargaanInovasi: 'INNOVATIVE GOVERNMENT AWARD 2022',
    kontakReplikator: '',
    instansiReplikator: 'Pemerintah Kabupaten situbondo',
    uppPeminat: '',
    verifikasi: ' ',
    keterangan: 'Belum diverifikasi',
    keteranganTambahan: ''
  }
])

// Methods
const getVerificationColor = (verifikasi) => {
  switch (verifikasi) {
    case 'V':
      return 'success'
    case 'X':
      return 'error'
    default:
      return 'warning'
  }
}

const openVerificationModal = (item) => {
  verificationForm.value = {
    id: item.no,
    verify: '',
    verifKet: ''
  }
  showVerificationModal.value = true
}

const submitVerification = () => {
  // Handle verification submission
  console.log('Submitting verification:', verificationForm.value)
  showVerificationModal.value = false
  resetVerificationForm()
}

const resetVerificationForm = () => {
  verificationForm.value = {
    id: '',
    verify: '',
    verifKet: ''
  }
}

const exportData = (format) => {
  // Handle export functionality
  console.log('Exporting data as:', format)
  // Implement export logic here
}

const compareData = ref([])

onMounted(() => {
  // Initialize component
})
</script>

<style scoped>
/* Custom styles for the rekap minat page */
.d-flex {
  display: flex;
}

.gap-2 > * + * {
  margin-left: 0.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.text-red-600 {
  color: #dc3545;
}

.font-bold {
  font-weight: bold;
}
</style>