<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Daftar Kesepakatan Replikasi Inovasi</h1>

    <v-card>
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Cari Judul"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
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
          :search="search"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.bukti_kesepakatan="{ item }">
            <v-btn icon color="primary" size="small" @click="printAgreement(item)">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Print Dialog -->
    <v-dialog v-model="printDialog" max-width="900px" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center bg-primary text-white">
          <span>Surat Kesepakatan Replikasi Inovasi</span>
          <v-btn icon variant="text" @click="printDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6">
          <div id="printableArea" class="print-content">
            <!-- Header Surat -->
            <div class="text-center mb-8">
              <img src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png" 
                   alt="Logo" 
                   style="height: 80px; margin-bottom: 16px;">
              <h2 class="text-h5 font-weight-bold mb-2">SURAT KESEPAKATAN REPLIKASI INOVASI</h2>
              <p class="text-subtitle-2">Nomor: {{ generateDocNumber() }}</p>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Informasi Inovasi -->
            <div class="mb-6">
              <h3 class="text-h6 font-weight-bold mb-4 text-primary">INFORMASI INOVASI</h3>
              <v-table density="compact">
                <tbody>
                  <tr>
                    <td width="200" class="font-weight-bold">Kode NRI</td>
                    <td>: {{ selectedAgreement.kode_nri || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Judul Inovasi</td>
                    <td>: {{ selectedAgreement.judul }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Instansi Pemilik</td>
                    <td>: {{ selectedAgreement.instansi_pemilik }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">UPP Pemilik</td>
                    <td>: {{ selectedAgreement.upp_pemilik }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Pihak yang Bersepakat -->
            <div class="mb-6">
              <h3 class="text-h6 font-weight-bold mb-4 text-primary">PARA PIHAK</h3>
              
              <div class="mb-4">
                <p class="font-weight-bold mb-2">PIHAK PERTAMA (Pemilik Inovasi):</p>
                <v-table density="compact">
                  <tbody>
                    <tr>
                      <td width="200" class="font-weight-bold">Nama Instansi</td>
                      <td>: {{ selectedAgreement.instansi_pemilik }}</td>
                    </tr>
                    <tr>
                      <td class="font-weight-bold">Unit Kerja</td>
                      <td>: {{ selectedAgreement.upp_pemilik }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>

              <div>
                <p class="font-weight-bold mb-2">PIHAK KEDUA (Replikator):</p>
                <v-table density="compact">
                  <tbody>
                    <tr>
                      <td width="200" class="font-weight-bold">Nama Instansi</td>
                      <td>: {{ selectedAgreement.instansi_replikator }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Isi Kesepakatan -->
            <div class="mb-6">
              <h3 class="text-h6 font-weight-bold mb-4 text-primary">ISI KESEPAKATAN</h3>
              <div class="text-justify" style="line-height: 1.8;">
                <p class="mb-3">
                  Pada hari ini, <strong>{{ currentDate }}</strong>, yang bertanda tangan di bawah ini:
                </p>
                
                <p class="mb-3">
                  <strong>PIHAK PERTAMA</strong> dan <strong>PIHAK KEDUA</strong> sepakat untuk melakukan 
                  replikasi inovasi dengan ketentuan sebagai berikut:
                </p>

                <ol class="ml-6 mb-4">
                  <li class="mb-2">
                    PIHAK PERTAMA bersedia memberikan bimbingan teknis dan asistensi dalam proses 
                    replikasi inovasi <strong>"{{ selectedAgreement.judul }}"</strong> kepada PIHAK KEDUA.
                  </li>
                  <li class="mb-2">
                    PIHAK KEDUA berkomitmen untuk melaksanakan replikasi inovasi sesuai dengan 
                    pedoman dan standar yang telah ditetapkan oleh PIHAK PERTAMA.
                  </li>
                  <li class="mb-2">
                    Kedua belah pihak sepakat untuk saling berkoordinasi dan berkomunikasi secara 
                    berkala terkait perkembangan proses replikasi inovasi.
                  </li>
                  <li class="mb-2">
                    PIHAK KEDUA wajib melaporkan hasil implementasi replikasi inovasi kepada 
                    PIHAK PERTAMA dan Kementerian PAN-RB melalui platform JIPPNAS.
                  </li>
                  <li class="mb-2">
                    Kesepakatan ini berlaku sejak tanggal ditandatangani dan dapat diperpanjang 
                    atas persetujuan kedua belah pihak.
                  </li>
                </ol>

                <p class="mb-3">
                  Demikian surat kesepakatan ini dibuat dengan sebenarnya untuk dipergunakan 
                  sebagaimana mestinya.
                </p>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Tanda Tangan -->
            <div class="signature-section">
              <v-row>
                <v-col cols="6">
                  <div class="text-center">
                    <p class="font-weight-bold mb-12">PIHAK PERTAMA</p>
                    <p class="mb-1">_____________________</p>
                    <p class="text-caption">{{ selectedAgreement.instansi_pemilik }}</p>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center">
                    <p class="font-weight-bold mb-12">PIHAK KEDUA</p>
                    <p class="mb-1">_____________________</p>
                    <p class="text-caption">{{ selectedAgreement.instansi_replikator }}</p>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- Footer -->
            <div class="text-center mt-8 pt-4" style="border-top: 1px solid #ddd;">
              <p class="text-caption text-grey">
                Dokumen ini dibuat melalui sistem JIPPNAS - Jaringan Inovasi Pelayanan Publik Nasional<br>
                Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi<br>
                Dicetak pada: {{ new Date().toLocaleString('id-ID') }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn color="grey" variant="outlined" @click="printDialog = false">
            <v-icon start>mdi-close</v-icon>
            Tutup
          </v-btn>
          <v-btn color="primary" @click="doPrint">
            <v-icon start>mdi-printer</v-icon>
            Cetak Surat
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'sidebar' })
import { ref, computed } from 'vue'

const search = ref('')
const printDialog = ref(false)
const selectedAgreement = ref({})

const headers = [
  { title: 'No', key: 'no', width: '60px' },
  { title: 'Kode NRI', key: 'kode_nri', width: '100px' },
  { title: 'Judul Pemilik Inovasi', key: 'judul' },
  { title: 'Instansi Pemilik Inovasi', key: 'instansi_pemilik' },
  { title: 'Upp Pemilik Inovasi', key: 'upp_pemilik' },
  { title: 'Instansi Replikator Inovasi', key: 'instansi_replikator' },
  { title: 'Cetak', key: 'bukti_kesepakatan', width: '80px', sortable: false }
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

const currentDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('id-ID', options)
})

const generateDocNumber = () => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${random}/JIPPNAS/${month}/${year}`
}

const printAgreement = (item) => {
  selectedAgreement.value = { ...item }
  printDialog.value = true
}

const doPrint = () => {
  const printContents = document.getElementById('printableArea').innerHTML
  const originalContents = document.body.innerHTML
  
  document.body.innerHTML = `
    <html>
      <head>
        <title>Surat Kesepakatan Replikasi Inovasi</title>
        <style>
          @media print {
            body { 
              font-family: 'Times New Roman', serif;
              padding: 20px;
              line-height: 1.6;
            }
            .signature-section {
              margin-top: 50px;
            }
            @page {
              margin: 2cm;
            }
          }
          body {
            font-family: 'Times New Roman', serif;
            padding: 20px;
            line-height: 1.6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            padding: 8px;
          }
          .text-justify {
            text-align: justify;
          }
          .text-center {
            text-center;
          }
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-3 { margin-bottom: 12px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }
          .mb-12 { margin-bottom: 80px; }
          .mt-4 { margin-top: 16px; }
          .mt-8 { margin-top: 32px; }
          .my-6 { margin-top: 24px; margin-bottom: 24px; }
          .pt-4 { padding-top: 16px; }
          .ml-6 { margin-left: 24px; }
          .font-weight-bold { font-weight: bold; }
          .text-caption { font-size: 12px; color: #666; }
          .text-grey { color: #999; }
          hr { border: none; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `
  
  window.print()
  document.body.innerHTML = originalContents
  window.location.reload()
}
</script>

<style scoped>
.print-content {
  background: white;
  padding: 20px;
}

@media print {
  .print-content {
    padding: 0;
  }
  
  .signature-section {
    page-break-inside: avoid;
  }
}

.text-justify {
  text-align: justify;
}
</style>
