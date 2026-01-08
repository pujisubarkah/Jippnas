<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Implementasi Replikasi Inovasi</h1>

    <v-card>
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" class="text-right">
            <v-btn color="primary" class="mr-2" size="small">
              <v-icon start>mdi-content-copy</v-icon>
              Copy
            </v-btn>
            <v-btn color="primary" class="mr-2" size="small">
              <v-icon start>mdi-file-delimited</v-icon>
              CSV
            </v-btn>
            <v-btn color="primary" class="mr-2" size="small">
              <v-icon start>mdi-microsoft-excel</v-icon>
              Excel
            </v-btn>
            <v-btn color="primary" class="mr-2" size="small">
              <v-icon start>mdi-file-pdf-box</v-icon>
              PDF
            </v-btn>
            <v-btn color="primary" size="small">
              <v-icon start>mdi-printer</v-icon>
              Print
            </v-btn>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.sertifikat="{ item }">
            <div class="d-flex gap-2">
              <v-tooltip text="Cetak Sertifikat" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    size="small"
                    color="primary"
                    variant="tonal"
                    @click="openCertificate(item)"
                  >
                    <v-icon>mdi-certificate</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              
              <v-tooltip text="Cetak Komitmen" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    size="small"
                    color="indigo"
                    variant="tonal"
                    @click="openCommitment(item)"
                  >
                    <v-icon>mdi-file-document-edit</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>

          <template v-slot:item.action="{ item }">
            <v-tooltip text="Tandai Selesai" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  color="success"
                  variant="tonal"
                  @click="openFinishModal(item)"
                >
                  <v-icon>mdi-check-circle</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Certificate Modal -->
    <v-dialog v-model="certificateDialog" max-width="1000px" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center bg-primary text-white">
          <span>
            <v-icon start>mdi-certificate</v-icon>
            Sertifikat Implementasi Inovasi
          </span>
          <v-btn icon variant="text" @click="certificateDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6">
          <div id="certificateContent" class="certificate-container">
            <!-- Certificate Header -->
            <div class="certificate-header text-center mb-8">
              <img 
                src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png" 
                alt="Logo JIPPNAS" 
                class="certificate-logo mb-4"
              >
              <h1 class="certificate-title text-h4 font-weight-bold text-primary mb-2">
                SERTIFIKAT
              </h1>
              <h2 class="certificate-subtitle text-h6 font-weight-medium text-grey-darken-1">
                Implementasi Replikasi Inovasi
              </h2>
              <p class="certificate-number text-subtitle-2 text-grey-darken-2">
                Nomor: {{ generateCertificateNumber(selectedCertificate) }}
              </p>
            </div>

            <!-- Certificate Body -->
            <div class="certificate-body text-center mb-8">
              <p class="certificate-intro text-body-1 mb-6">
                Diberikan kepada:
              </p>
              
              <h3 class="recipient-name text-h5 font-weight-bold text-primary mb-4">
                {{ selectedCertificate.instansi_replikator }}
              </h3>
              
              <div class="certificate-content text-justify mb-6" style="line-height: 1.8;">
                <p class="mb-4">
                  Atas partisipasi dan keberhasilan dalam mengimplementasikan replikasi inovasi 
                  <strong>"{{ selectedCertificate.judul }}"</strong> yang berasal dari 
                  <strong>{{ selectedCertificate.instansi_pemilik }}</strong>.
                </p>
                
                <p class="mb-4">
                  Telah mengikuti forum pembelajaran inovasi dan diverifikasi oleh Tim Verifikasi 
                  JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional.
                </p>
                
                <p class="mb-4">
                  Implementasi inovasi ini telah memenuhi standar dan kriteria yang ditetapkan 
                  serta memberikan manfaat bagi peningkatan kualitas pelayanan publik.
                </p>
              </div>
              
              <div class="certificate-details mb-6">
                <v-row class="justify-center">
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey-darken-1 mb-1">Tanggal Implementasi</div>
                      <div class="font-weight-medium">{{ formatDate(selectedCertificate.tanggal_implementasi) }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey-darken-1 mb-1">Kode NRI</div>
                      <div class="font-weight-medium">{{ selectedCertificate.kode_nri || '-' }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey-darken-1 mb-1">Tanggal Sertifikat</div>
                      <div class="font-weight-medium">{{ currentDate }}</div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>

            <!-- Certificate Signatures -->
            <div class="certificate-signatures mb-8">
              <v-row class="justify-space-around">
                <v-col cols="12" md="4" class="text-center">
                  <div class="signature-line mb-8"></div>
                  <div class="font-weight-bold">Pemilik Inovasi</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCertificate.instansi_pemilik }}</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCertificate.upp_pemilik }}</div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <div class="signature-line mb-8"></div>
                  <div class="font-weight-bold">Replikator Inovasi</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCertificate.instansi_replikator }}</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCertificate.upp_replikator }}</div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <div class="signature-line mb-8"></div>
                  <div class="font-weight-bold">Tim Verifikasi JIPPNAS</div>
                  <div class="text-caption text-grey-darken-1">Kementerian PAN-RB</div>
                  <div class="text-caption text-grey-darken-1">Direktorat Pelayanan Publik</div>
                </v-col>
              </v-row>
            </div>

            <!-- Certificate Footer -->
            <div class="certificate-footer text-center">
              <v-divider class="my-4"></v-divider>
              <p class="text-caption text-grey-darken-1 mb-2">
                Dokumen ini dikeluarkan oleh JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional
              </p>
              <p class="text-caption text-grey-darken-1 mb-2">
                Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi
              </p>
              <p class="text-caption text-grey-darken-1">
                Dicetak pada: {{ new Date().toLocaleString('id-ID') }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn variant="outlined" @click="certificateDialog = false">
            <v-icon start>mdi-close</v-icon>
            Tutup
          </v-btn>
          <v-btn color="primary" @click="printCertificate">
            <v-icon start>mdi-printer</v-icon>
            Cetak Sertifikat
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Commitment Modal -->
    <v-dialog v-model="commitmentDialog" max-width="1000px" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center bg-indigo text-white">
          <span>
            <v-icon start>mdi-file-document-edit</v-icon>
            Surat Komitmen Replikasi Inovasi
          </span>
          <v-btn icon variant="text" @click="commitmentDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6">
          <div id="commitmentContent" class="commitment-container">
            <!-- Commitment Header -->
            <div class="commitment-header text-center mb-8">
              <img 
                src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png" 
                alt="Logo JIPPNAS" 
                class="commitment-logo mb-4"
              >
              <h1 class="commitment-title text-h4 font-weight-bold text-indigo-darken-2 mb-2">
                KOMITMEN
              </h1>
              <h2 class="commitment-subtitle text-h6 font-weight-medium text-grey-darken-1">
                Replikasi Inovasi Pelayanan Publik
              </h2>
              <p class="commitment-number text-subtitle-2 text-grey-darken-2">
                Nomor: {{ generateCommitmentNumber(selectedCommitment) }}
              </p>
            </div>

            <!-- Commitment Body -->
            <div class="commitment-body text-center mb-8">
              <p class="commitment-intro text-body-1 mb-6">
                Diberikan kepada:
              </p>
              
              <h3 class="recipient-name text-h5 font-weight-bold text-indigo-darken-2 mb-4">
                {{ selectedCommitment.instansi_replikator }}
              </h3>
              
              <div class="commitment-content text-justify mb-6" style="line-height: 1.8;">
                <p class="mb-4">
                  Sertifikat ini diberikan sebagai bentuk komitmen dalam pelaksanaan replikasi inovasi 
                  pelayanan publik dari <strong>{{ selectedCommitment.instansi_pemilik }}</strong> kepada 
                  <strong>{{ selectedCommitment.instansi_replikator }}</strong>.
                </p>
                
                <p class="mb-4">
                  Sebagai wujud dedikasi dalam memperluas penerapan inovasi untuk peningkatan kualitas 
                  pelayanan publik melalui replikasi inovasi <strong>"{{ selectedCommitment.judul }}"</strong>.
                </p>
                
                <p class="mb-4">
                  Komitmen ini mencakup kesungguhan dalam mengimplementasikan inovasi, berbagi pengetahuan 
                  dan pengalaman, serta berkontribusi terhadap kemajuan pelayanan publik nasional.
                </p>
              </div>
              
              <div class="commitment-details mb-6">
                <v-row class="justify-center">
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey-darken-1 mb-1">Tanggal Komitmen</div>
                      <div class="font-weight-medium">{{ currentDate }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey-darken-1 mb-1">Kode NRI</div>
                      <div class="font-weight-medium">{{ selectedCommitment.kode_nri || '-' }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="pa-3">
                      <div class="text-caption text-grey-darken-1 mb-1">Berlaku Sejak</div>
                      <div class="font-weight-medium">{{ formatDate(selectedCommitment.tanggal_implementasi) || currentDate }}</div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>

            <!-- Commitment Signatures -->
            <div class="commitment-signatures mb-8">
              <v-row class="justify-space-around">
                <v-col cols="12" md="4" class="text-center">
                  <div class="signature-line mb-8"></div>
                  <div class="font-weight-bold">Pemberi Komitmen</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCommitment.instansi_pemilik }}</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCommitment.upp_pemilik }}</div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <div class="signature-line mb-8"></div>
                  <div class="font-weight-bold">Penerima Komitmen</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCommitment.instansi_replikator }}</div>
                  <div class="text-caption text-grey-darken-1">{{ selectedCommitment.upp_replikator }}</div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <div class="signature-line mb-8"></div>
                  <div class="font-weight-bold">Tim Fasilitator JIPPNAS</div>
                  <div class="text-caption text-grey-darken-1">Kementerian PAN-RB</div>
                  <div class="text-caption text-grey-darken-1">Direktorat Pelayanan Publik</div>
                </v-col>
              </v-row>
            </div>

            <!-- Commitment Footer -->
            <div class="commitment-footer text-center">
              <v-divider class="my-4"></v-divider>
              <p class="text-caption text-grey-darken-1 mb-2">
                Dokumen komitmen ini dikeluarkan oleh JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional
              </p>
              <p class="text-caption text-grey-darken-1 mb-2">
                Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi
              </p>
              <p class="text-caption text-grey-darken-1">
                Dikeluarkan pada: {{ new Date().toLocaleString('id-ID') }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn variant="outlined" @click="commitmentDialog = false">
            <v-icon start>mdi-close</v-icon>
            Tutup
          </v-btn>
          <v-btn color="indigo" @click="printCommitment">
            <v-icon start>mdi-printer</v-icon>
            Cetak Komitmen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Finish Confirmation Modal -->
    <v-dialog v-model="finishDialog" max-width="600px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon start>mdi-check-circle</v-icon>
          Konfirmasi Selesai
        </v-card-title>
        <v-card-text class="pt-4">
          <v-alert type="info" variant="tonal" class="mb-4">
            <div class="d-flex align-center">
              <v-icon start>mdi-information</v-icon>
              <div>
                <strong>{{ selectedItem.judul }}</strong>
                <div class="text-caption">{{ selectedItem.instansi_replikator }}</div>
              </div>
            </div>
          </v-alert>
          
          <p class="mb-4">Apakah Anda yakin ingin menandai implementasi ini sebagai selesai?</p>
          
          <v-textarea
            v-model="finishReason"
            label="Catatan/Keterangan (opsional)"
            variant="outlined"
            rows="3"
            placeholder="Tambahkan catatan terkait penyelesaian implementasi..."
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="finishDialog = false">
            <v-icon start>mdi-close</v-icon>
            Batal
          </v-btn>
          <v-btn color="success" @click="confirmFinish">
            <v-icon start>mdi-check</v-icon>
            Ya, Selesai
          </v-btn>
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
import { ref, computed } from 'vue'

const headers = [
  { title: 'No', key: 'no', width: '60px' },
  { title: 'Kode NRI', key: 'kode_nri', width: '100px' },
  { title: 'Judul Inovasi Replikasi', key: 'judul' },
  { title: 'Instansi Pemilik Inovasi', key: 'instansi_pemilik' },
  { title: 'UPP Pemilik Inovasi', key: 'upp_pemilik' },
  { title: 'Instansi Replikator Inovasi', key: 'instansi_replikator' },
  { title: 'UPP Replikator Inovasi', key: 'upp_replikator' },
  { title: 'Tanggal Implementasi', key: 'tanggal_implementasi', width: '150px' },
  { title: 'Aksi', key: 'sertifikat', width: '120px', sortable: false },
  { title: 'Status', key: 'action', width: '80px', sortable: false }
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

const certificateDialog = ref(false)
const commitmentDialog = ref(false)
const finishDialog = ref(false)
const comparisonDialog = ref(false)
const logDialog = ref(false)
const profileDialog = ref(false)
const selectedItem = ref({})
const selectedCertificate = ref({})
const selectedCommitment = ref({})
const finishReason = ref('')

const currentDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('id-ID', options)
})

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

const generateCertificateNumber = (item) => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `SERTIF/${item.no}/${month}/${year}/${random}`
}

const generateCommitmentNumber = (item) => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `KOMIT/${item.no}/${month}/${year}/${random}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openCertificate = (item) => {
  selectedCertificate.value = { ...item }
  certificateDialog.value = true
}

const openCommitment = (item) => {
  selectedCommitment.value = { ...item }
  commitmentDialog.value = true
}

const openFinishModal = (item) => {
  selectedItem.value = item
  finishDialog.value = true
}

const printCertificate = () => {
  const printContents = document.getElementById('certificateContent').innerHTML
  const originalContents = document.body.innerHTML
  
  document.body.innerHTML = `
    <html>
      <head>
        <title>Sertifikat Implementasi Inovasi</title>
        <style>
          @media print {
            body { 
              font-family: 'Times New Roman', serif;
              padding: 20px;
              line-height: 1.6;
              background: white;
            }
            .certificate-container {
              max-width: 100%;
              margin: 0 auto;
            }
            .certificate-logo {
              height: 80px !important;
              margin-bottom: 20px !important;
            }
            .certificate-title {
              font-size: 36px !important;
              margin-bottom: 8px !important;
            }
            .certificate-subtitle {
              font-size: 24px !important;
              margin-bottom: 16px !important;
            }
            .recipient-name {
              font-size: 28px !important;
              margin: 20px 0 !important;
            }
            .signature-line {
              border-bottom: 2px solid #000;
              width: 200px;
              margin: 0 auto 16px auto;
            }
            @page {
              margin: 2cm;
              size: A4 landscape;
            }
          }
          body {
            font-family: 'Times New Roman', serif;
            padding: 20px;
            line-height: 1.6;
            background: white;
          }
          .certificate-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            border: 2px solid #1976D2;
            border-radius: 10px;
          }
          .certificate-logo {
            height: 80px;
            margin-bottom: 16px;
          }
          .certificate-title {
            color: #1976D2;
            margin-bottom: 8px;
          }
          .certificate-subtitle {
            color: #424242;
            margin-bottom: 16px;
          }
          .recipient-name {
            color: #1976D2;
            margin: 16px 0;
          }
          .signature-line {
            border-bottom: 2px solid #000;
            width: 200px;
            margin: 0 auto 16px auto;
          }
          .text-center { text-align: center; }
          .text-justify { text-align: justify; }
          .text-caption { font-size: 12px; }
          .text-grey-darken-1 { color: #616161; }
          .text-grey-darken-2 { color: #757575; }
          .text-primary { color: #1976D2; }
          .font-weight-bold { font-weight: bold; }
          .font-weight-medium { font-weight: 500; }
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }
          .mt-4 { margin-top: 16px; }
          .my-4 { margin-top: 16px; margin-bottom: 16px; }
          .pa-3 { padding: 12px; }
          .justify-center { justify-content: center; }
          .justify-space-around { justify-content: space-around; }
          .d-flex { display: flex; }
          .align-center { align-items: center; }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          ${printContents}
        </div>
      </body>
    </html>
  `
  
  window.print()
  document.body.innerHTML = originalContents
  window.location.reload()
}

const printCommitment = () => {
  const printContents = document.getElementById('commitmentContent').innerHTML
  const originalContents = document.body.innerHTML
  
  document.body.innerHTML = `
    <html>
      <head>
        <title>Surat Komitmen Replikasi Inovasi</title>
        <style>
          @media print {
            body { 
              font-family: 'Times New Roman', serif;
              padding: 20px;
              line-height: 1.6;
              background: white;
            }
            .commitment-container {
              max-width: 100%;
              margin: 0 auto;
            }
            .commitment-logo {
              height: 80px !important;
              margin-bottom: 20px !important;
            }
            .commitment-title {
              font-size: 36px !important;
              margin-bottom: 8px !important;
            }
            .commitment-subtitle {
              font-size: 24px !important;
              margin-bottom: 16px !important;
            }
            .recipient-name {
              font-size: 28px !important;
              margin: 20px 0 !important;
            }
            .signature-line {
              border-bottom: 2px solid #000;
              width: 200px;
              margin: 0 auto 16px auto;
            }
            @page {
              margin: 2cm;
              size: A4 landscape;
            }
          }
          body {
            font-family: 'Times New Roman', serif;
            padding: 20px;
            line-height: 1.6;
            background: white;
          }
          .commitment-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            border: 2px solid #5C6BC0;
            border-radius: 10px;
          }
          .commitment-logo {
            height: 80px;
            margin-bottom: 16px;
          }
          .commitment-title {
            color: #5C6BC0;
            margin-bottom: 8px;
          }
          .commitment-subtitle {
            color: #424242;
            margin-bottom: 16px;
          }
          .recipient-name {
            color: #5C6BC0;
            margin: 16px 0;
          }
          .signature-line {
            border-bottom: 2px solid #000;
            width: 200px;
            margin: 0 auto 16px auto;
          }
          .text-center { text-align: center; }
          .text-justify { text-align: justify; }
          .text-caption { font-size: 12px; }
          .text-grey-darken-1 { color: #616161; }
          .text-grey-darken-2 { color: #757575; }
          .text-indigo-darken-2 { color: #5C6BC0; }
          .font-weight-bold { font-weight: bold; }
          .font-weight-medium { font-weight: 500; }
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }
          .mt-4 { margin-top: 16px; }
          .my-4 { margin-top: 16px; margin-bottom: 16px; }
          .pa-3 { padding: 12px; }
          .justify-center { justify-content: center; }
          .justify-space-around { justify-content: space-around; }
          .d-flex { display: flex; }
          .align-center { align-items: center; }
        </style>
      </head>
      <body>
        <div class="commitment-container">
          ${printContents}
        </div>
      </body>
    </html>
  `
  
  window.print()
  document.body.innerHTML = originalContents
  window.location.reload()
}

const confirmFinish = () => {
  // Handle finish confirmation logic here
  console.log('Marking as finished:', selectedItem.value, finishReason.value)
  
  // Show success message (you can implement toast notification here)
  finishDialog.value = false
  finishReason.value = ''
  selectedItem.value = {}
}
</script>

<style scoped>
.d-flex {
  display: flex;
  align-items: center;
}

.gap-2 {
  gap: 8px;
}

.certificate-container {
  background: white;
  border: 2px solid #1976D2;
  border-radius: 10px;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.commitment-container {
  background: white;
  border: 2px solid #5C6BC0;
  border-radius: 10px;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.certificate-logo,
.commitment-logo {
  height: 80px;
  margin-bottom: 16px;
}

.certificate-title,
.commitment-title {
  margin-bottom: 8px;
}

.certificate-subtitle,
.commitment-subtitle {
  color: #424242;
  margin-bottom: 16px;
}

.recipient-name {
  margin: 16px 0;
}

.signature-line {
  border-bottom: 2px solid #000;
  width: 200px;
  margin: 0 auto 16px auto;
}

@media print {
  .certificate-container,
  .commitment-container {
    border: none !important;
    padding: 20px !important;
  }
}
</style>
