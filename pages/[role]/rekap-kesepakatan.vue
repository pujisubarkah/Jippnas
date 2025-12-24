<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Kesepakatan Replikasi Inovasi</h1>

    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mr-2">Copy</v-btn>
        <v-btn color="primary" class="mr-2">CSV</v-btn>
        <v-btn color="primary" class="mr-2">Excel</v-btn>
        <v-btn color="primary" class="mr-2">PDF</v-btn>
        <v-btn color="primary" class="mr-2">Print</v-btn>
        <v-btn color="primary">Download Data Belum Lengkap Keseluruhan</v-btn>
      </v-card-header>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Cari Judul"
              class="mx-4"
            ></v-text-field>
          </template>

          <template v-slot:item.bukti_kesepakatan="{ item }">
            <v-btn icon color="red" @click="openDocument(item.bukti_kesepakatan)">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Info Modal -->
    <v-dialog v-model="infoDialog" max-width="1200px">
      <v-card>
        <v-card-title class="text-red font-bold">
          {{ selectedItem.judul }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Institusi" :value="selectedItem.institusi" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Instansi" :value="selectedItem.instansi" readonly></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="UPP" :value="selectedItem.upp" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Wilayah" :value="selectedItem.wilayah" readonly></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Penghargaan" :value="selectedItem.penghargaan" readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Tahun Implementasi" :value="selectedItem.tahun" readonly></v-text-field>
            </v-col>
          </v-row>
          <v-text-field label="Kategori SDG's" :value="selectedItem.sdgs" readonly></v-text-field>
          <v-textarea label="Ringkasan" :value="selectedItem.ringkasan" readonly rows="10"></v-textarea>
          <v-text-field label="Inovator" :value="selectedItem.inovator" readonly></v-text-field>
          <v-text-field label="Tag" :value="selectedItem.tag" readonly></v-text-field>
          <v-text-field label="Video" :value="selectedItem.video" readonly></v-text-field>
          <v-text-field label="Pemangku Inovasi" :value="selectedItem.pemangku" readonly></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Comparison Modal -->
    <v-dialog v-model="comparisonDialog" max-width="1200px">
      <v-card>
        <v-card-title>Perbandingan Inovasi</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="comparisonHeaders"
            :items="comparisonItems"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Log Modal -->
    <v-dialog v-model="logDialog" max-width="1200px">
      <v-card>
        <v-card-title>Daftar Log Terakhir</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="logHeaders"
            :items="logItems"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Profile Modal -->
    <v-dialog v-model="profileDialog" max-width="1200px">
      <v-card>
        <v-card-text>
          <!-- Profile content would go here -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'sidebar' })
import { ref } from 'vue'

const search = ref('')

const headers = [
  { title: 'No', key: 'no', width: '18px' },
  { title: 'Kode NRI', key: 'kode_nri', width: '53px' },
  { title: 'Judul Pemilik Inovasi', key: 'judul', width: '266px' },
  { title: 'Instansi Pemilik Inovasi', key: 'instansi_pemilik', width: '359px' },
  { title: 'Upp Pemilik Inovasi', key: 'upp_pemilik', width: '100px' },
  { title: 'Instansi Replikator Inovasi', key: 'instansi_replikator', width: '100px' },
  { title: 'Bukti Kesepakatan', key: 'bukti_kesepakatan', width: '110px' }
]

const items = ref([
  {
    no: 1,
    kode_nri: '312169',
    judul: 'Inovasi Pelayanan Prima Bandara',
    instansi_pemilik: 'PT Angkasa Pura I (Persero)',
    upp_pemilik: 'Bandara Internasional I Gusti Ngurah Rai',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/23/gkq3L8FDI3XFs3cYnhKr424PTdVVPCQRszzZzjO4.pdf'
  },
  {
    no: 2,
    kode_nri: '',
    judul: 'GERPAS (Gerai Pengurusan Dokumen Dasar Nelayan)',
    instansi_pemilik: 'Pemerintah Kabupaten situbondo',
    upp_pemilik: 'DINAS PETERNAKAN DAN PERIKANAN',
    instansi_replikator: 'Pemerintah Kabupaten situbondo',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/11/wDWbLBXFGkEdkxHgvjX2Xok47UBlXx6pqLlTTVwB.pdf'
  },
  {
    no: 3,
    kode_nri: '',
    judul: 'Pembuatan Sistem Informasi JIPPNAS',
    instansi_pemilik: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_pemilik: 'Deputi Bidang Pelayanan Publik (ASDEP Praktik Terbaik)',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/18/fFnAqn6M75DEGPEmK9iahNEghyGp1MrzpgWKD2LA.pdf'
  },
  {
    no: 4,
    kode_nri: '',
    judul: 'Pembuatan Sistem Informasi JIPPNAS',
    instansi_pemilik: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_pemilik: 'Deputi Bidang Pelayanan Publik (ASDEP Praktik Terbaik)',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/17/Dl1yYOQye2C7BCRVJxqTI60CvzkFAp5hQPI64p3K.pdf'
  },
  {
    no: 5,
    kode_nri: '',
    judul: 'Pembuatan Sistem Informasi JIPPNAS',
    instansi_pemilik: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_pemilik: 'Deputi Bidang Pelayanan Publik (ASDEP Praktik Terbaik)',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/16/bPWzsR65RWLlUoB3alp18T0PF25N0CDx0zxzytfE.pdf'
  },
  {
    no: 6,
    kode_nri: '',
    judul: 'Pembuatan Sistem Informasi JIPPNAS',
    instansi_pemilik: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_pemilik: 'Deputi Bidang Pelayanan Publik (ASDEP Praktik Terbaik)',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/15/947JoAjDJoGZ6HkVCQAybYhrBRzP1piDY0KscjX3.pdf'
  },
  {
    no: 7,
    kode_nri: '',
    judul: 'Pembuatan Sistem Informasi JIPPNAS',
    instansi_pemilik: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_pemilik: 'Deputi Bidang Pelayanan Publik (ASDEP Praktik Terbaik)',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/14/9pLiOEWXoIl5BKxcMKKe785orljn842H9w3MJdJy.pdf'
  },
  {
    no: 8,
    kode_nri: '',
    judul: 'Pembuatan Sistem Informasi JIPPNAS',
    instansi_pemilik: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_pemilik: 'Deputi Bidang Pelayanan Publik (ASDEP Praktik Terbaik)',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/13/feEIiXkuBdLSxojZxPt7yLFPxWswCl7KRJ2uxs3W.pdf'
  },
  {
    no: 9,
    kode_nri: '',
    judul: 'Pembuatan Sistem Informasi JIPPNAS',
    instansi_pemilik: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_pemilik: 'Deputi Bidang Pelayanan Publik (ASDEP Praktik Terbaik)',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/12/Htt5ci9R94nIvNYIqqO9I8KgSjzjpIkwDyld0noN.pdf'
  },
  {
    no: 10,
    kode_nri: '',
    judul: 'PERKAKAS (Perekaman KTP-EL Siswa di Sekolah)',
    instansi_pemilik: 'Pemerintah Kabupaten tojo una una',
    upp_pemilik: 'Dinas Kependudukan dan Pencatatan Sipil',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    bukti_kesepakatan: 'https://jippnas.menpan.go.id/storage/pdf/replikasi/kesepakatan/10/OJozRyatuhPNQVgYap8O0Q9AjOESPwYvN85uN1Kr.pdf'
  }
])

const infoDialog = ref(false)
const comparisonDialog = ref(false)
const logDialog = ref(false)
const profileDialog = ref(false)
const selectedItem = ref({})

const comparisonHeaders = [
  { title: 'Kode NRI', key: 'kode_nri', width: '150px' },
  { title: 'Judul', key: 'judul' }
]

const comparisonItems = ref([])

const logHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Judul', key: 'judul' },
  { title: 'Keterangan', key: 'keterangan' },
  { title: 'Tanggal', key: 'tanggal' },
  { title: 'Jam', key: 'jam' }
]

const logItems = ref([])

const openDocument = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.text-red {
  color: #dc3545;
}

.font-bold {
  font-weight: bold;
}
</style>
