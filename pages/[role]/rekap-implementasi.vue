<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Implementasi Replikasi Inovasi</h1>

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
          :items-per-page="10"
          class="elevation-1"
        >

          <template v-slot:item.sertifikat="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                size="small"
                color="error"
                variant="outlined"
                @click="openCertificate(item.sertifikat_url)"
              >
                <v-icon>mdi-printer</v-icon>
                Sertifikat
              </v-btn>
              <v-btn
                size="small"
                color="error"
                variant="outlined"
                @click="openCommitment(item.komitmen_url)"
              >
                <v-icon>mdi-file-signature</v-icon>
                Komitmen
              </v-btn>
            </div>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn
              color="error"
              variant="outlined"
              @click="openFinishModal(item)"
            >
              <v-icon>mdi-check</v-icon>
              Selesai
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Finish Confirmation Modal -->
    <v-dialog v-model="finishDialog" max-width="600px">
      <v-card>
        <v-card-title>Konfirmasi Selesai</v-card-title>
        <v-card-text>
          <p>Apa kamu yakin ingin menandai implementasi ini sebagai selesai?</p>
          <v-text-field
            v-model="finishReason"
            label="Alasan (opsional)"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="finishDialog = false">Batal</v-btn>
          <v-btn color="primary" @click="confirmFinish">Ya, Selesai</v-btn>
        </v-card-actions>
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

const headers = [
  { title: 'No', key: 'no', width: '18px' },
  { title: 'Kode NRI', key: 'kode_nri', width: '38px' },
  { title: 'Judul Inovasi Repliksasi', key: 'judul', width: '127px' },
  { title: 'Instansi Pemilik Inovasi', key: 'instansi_pemilik', width: '112px' },
  { title: 'UPP Pemilik Inovasi', key: 'upp_pemilik', width: '128px' },
  { title: 'Instansi Replikator Inovasi', key: 'instansi_replikator', width: '100px' },
  { title: 'UPP Replikator Inovasi', key: 'upp_replikator', width: '100px' },
  { title: 'Tanggal Implementasi', key: 'tanggal_implementasi', width: '98px' },
  { title: 'Sertifikat', key: 'sertifikat', width: '113px' },
  { title: 'Action', key: 'action', width: '66px' }
]

const items = ref([
  {
    no: 1,
    kode_nri: '312169',
    judul: 'Inovasi Pelayanan Prima Bandara',
    instansi_pemilik: 'PT Angkasa Pura I (Persero)',
    upp_pemilik: 'Bandara Internasional I Gusti Ngurah Rai',
    instansi_replikator: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi',
    upp_replikator: 'Biro Komunikasi dan Pelayanan Publik',
    tanggal_implementasi: '2025-06-04',
    sertifikat_url: 'https://jippnas.menpan.go.id/sertif/23',
    komitmen_url: 'https://jippnas.menpan.go.id/komit/23'
  },
  {
    no: 2,
    kode_nri: '',
    judul: 'SIGoblic (Sistem ISBN Go Public) Menghadang Pandemi',
    instansi_pemilik: 'Perpustakaan Nasional Republik Indonesia',
    upp_pemilik: 'Pusat Bibliografi dan Pengolahan Bahan Perpustakaan',
    instansi_replikator: 'Pemerintah Kota Padang Panjang',
    upp_replikator: 'admin ptsp',
    tanggal_implementasi: '',
    sertifikat_url: 'https://jippnas.menpan.go.id/sertif/3',
    komitmen_url: 'https://jippnas.menpan.go.id/komit/3'
  }
])

const finishDialog = ref(false)
const comparisonDialog = ref(false)
const logDialog = ref(false)
const profileDialog = ref(false)
const selectedItem = ref({})
const finishReason = ref('')

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

const openCertificate = (url) => {
  window.open(url, '_blank')
}

const openCommitment = (url) => {
  window.open(url, '_blank')
}

const openFinishModal = (item) => {
  selectedItem.value = item
  finishDialog.value = true
}

const confirmFinish = () => {
  // Handle finish confirmation logic here
  console.log('Marking as finished:', selectedItem.value, finishReason.value)
  finishDialog.value = false
  finishReason.value = ''
}
</script>

<style scoped>
.gap-2 > * + * {
  margin-left: 0.5rem;
}

.d-flex {
  display: flex;
}
</style>
