<template>
  <v-container fluid>
    <!-- Header with Back Button -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-btn icon size="small" @click="$router.back()" class="mr-3" color="primary">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h1 class="text-h4 font-weight-bold text-primary">
            Detail Inovasi - {{ innovation?.judul || 'Loading...' }}
          </h1>
        </div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-card v-if="loading" class="mb-6">
      <v-card-text class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">Memuat data inovasi...</p>
      </v-card-text>
    </v-card>

    <!-- Content -->
    <div v-else-if="innovation">
      <!-- Breadcrumb -->
      <v-breadcrumbs class="px-0 mb-4">
        <v-breadcrumbs-item>
          <a href="#" class="text-primary">Beranda</a>
        </v-breadcrumbs-item>
        <v-breadcrumbs-divider></v-breadcrumbs-divider>
        <v-breadcrumbs-item>
          <a href="#" class="text-primary">Etalase Inovasi</a>
        </v-breadcrumbs-item>
        <v-breadcrumbs-divider></v-breadcrumbs-divider>
        <v-breadcrumbs-item>
          <a href="#" class="text-primary">Direktori Inovasi</a>
        </v-breadcrumbs-item>
        <v-breadcrumbs-divider></v-breadcrumbs-divider>
        <v-breadcrumbs-item disabled>
          {{ innovation.judul }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>

      <v-row>
        <!-- Main Content -->
        <v-col cols="12" md="8">
          <!-- Image -->
          <v-card class="mb-6 elevation-3">
            <v-img
              :src="innovation.image || 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png'"
              height="400"
              cover
            ></v-img>
          </v-card>

          <!-- Title and Basic Info -->
          <v-card class="mb-6 elevation-3">
            <v-card-text>
              <h2 class="text-h4 font-weight-bold mb-4 text-primary">{{ innovation.judul }}</h2>
              
              <v-chip color="success" variant="elevated" class="mb-4">
                <v-icon start>mdi-check-circle</v-icon>
                {{ innovation.status }}
              </v-chip>

              <v-list lines="one" class="bg-transparent">
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-tag</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ innovation.jenis }}</v-list-item-title>
                  <v-list-item-subtitle>Jenis Inovasi</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-account</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ innovation.namaInnovator }}</v-list-item-title>
                  <v-list-item-subtitle>Inovator</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-earth</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ innovation.sdgs }}</v-list-item-title>
                  <v-list-item-subtitle>SDG's</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="innovation.oecd" class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-certificate-outline</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ innovation.oecd }}</v-list-item-title>
                  <v-list-item-subtitle>OECD</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="innovation.rbTematik" class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-certificate-outline</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ innovation.rbTematik }}</v-list-item-title>
                  <v-list-item-subtitle>RB Tematik</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="amber">mdi-trophy</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ innovation.penghargaan }}</v-list-item-title>
                  <v-list-item-subtitle>Penghargaan</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="innovation.kompetisi" class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="amber">mdi-trophy-variant</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ innovation.kompetisi }}</v-list-item-title>
                  <v-list-item-subtitle>Kompetisi</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Kurasi Ringkasan -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-file-document-outline</v-icon>
              Kurasi Ringkasan
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.kurasiRingkasan" class="text-justify content-text"></div>
            </v-card-text>
          </v-card>

          <!-- Video -->
          <v-card class="mb-6 elevation-3" v-if="innovation.video">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-video</v-icon>
              Video
            </v-card-title>
            <v-card-text>
              <div class="video-container">
                <iframe 
                  width="100%" 
                  height="400" 
                  :src="innovation.video" 
                  title="video player" 
                  frameborder="0" 
                  allowfullscreen
                  class="rounded"
                ></iframe>
              </div>
            </v-card-text>
          </v-card>

          <!-- Latar Belakang -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-information</v-icon>
              Latar Belakang
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.latarBelakang" class="text-justify content-text"></div>
            </v-card-text>
          </v-card>

          <!-- Tujuan -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-target</v-icon>
              Tujuan
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.tujuan" class="text-justify content-text"></div>
            </v-card-text>
          </v-card>

          <!-- Kebaharuan -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-lightbulb-on</v-icon>
              Kebaharuan
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.kebaharuan" class="text-justify content-text"></div>
            </v-card-text>
          </v-card>

          <!-- Evaluasi dan Dampak -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-indigo-lighten-5 text-indigo-darken-2">
              <v-icon start color="indigo-darken-2">mdi-chart-line</v-icon>
              Evaluasi dan Dampak
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.evaluasiDampak" class="text-justify content-text"></div>
            </v-card-text>
          </v-card>

          <!-- Adaptasi/Replikasi -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-indigo-lighten-5 text-indigo-darken-2">
              <v-icon start color="indigo-darken-2">mdi-reload</v-icon>
              Adaptasi/Replikasi/Scaling Up
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.adaptasiReplikasi" class="text-justify content-text"></div>
              <v-alert type="info" class="mt-4" variant="tonal">
                <v-icon start>mdi-information</v-icon>
                {{ innovation.jumlahReplikasi }} replikasi atas Scaling Up
              </v-alert>
            </v-card-text>
          </v-card>

          <!-- Sumber Daya -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-briefcase</v-icon>
              Sumber Daya Pendukung
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.sumberDaya" class="text-justify content-text"></div>
            </v-card-text>
          </v-card>

          <!-- Kondisi Keberlanjutan -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-check-all</v-icon>
              Kondisi Keberlanjutan Inovasi
            </v-card-title>
            <v-card-text>
              <div v-html="innovation.kondisiKeberlanjutan" class="text-justify content-text"></div>
            </v-card-text>
          </v-card>

          <!-- Diskusi -->
          <v-card class="mb-6 elevation-3">
            <v-card-title class="bg-blue-lighten-5 text-primary">
              <v-icon start>mdi-comment-multiple</v-icon>
              Diskusi
            </v-card-title>
            <v-card-text>
              <v-textarea
                label="Tulis komentar Anda"
                rows="4"
                variant="outlined"
                color="primary"
              ></v-textarea>
              <v-btn color="primary" class="mt-2" variant="elevated">
                <v-icon start>mdi-send</v-icon>
                Kirim
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" md="4">
          <div class="sticky-sidebar">
            <!-- Action Buttons -->
            <v-card class="mb-4 elevation-3">
              <v-card-text>
                <v-btn color="primary" block class="mb-3" variant="elevated" size="large">
                  <v-icon start>mdi-content-copy</v-icon>
                  Replikasi
                </v-btn>
                
                <v-btn color="primary" variant="outlined" block class="mb-3" size="large">
                  <v-icon start>mdi-bookmark</v-icon>
                  Tandai Inovasi
                </v-btn>

                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn color="primary" variant="outlined" block v-bind="props" size="large">
                      <v-icon start>mdi-download</v-icon>
                      Link Unduhan
                      <v-icon end>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item link>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-download</v-icon>
                      </template>
                      <v-list-item-title>Unduh Inovasi</v-list-item-title>
                    </v-list-item>
                    <v-list-item link>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-file-pdf-box</v-icon>
                      </template>
                      <v-list-item-title>Lihat PDF</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-text>
            </v-card>

            <!-- Info Card -->
            <v-card class="mb-4 elevation-3 bg-blue-lighten-5">
              <v-card-text>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Publikasi</v-list-item-title>
                    <v-list-item-subtitle>{{ innovation.publikasi }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-map-marker</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Provinsi</v-list-item-title>
                    <v-list-item-subtitle>{{ innovation.provinsi || '-' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-earth</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">SDG's</v-list-item-title>
                    <v-list-item-subtitle class="text-wrap">{{ innovation.sdgs }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Engagement Stats -->
            <v-card class="mb-4 elevation-3 bg-cyan-lighten-5">
              <v-card-text>
                <v-row>
                  <v-col cols="6" class="text-center">
                    <div class="text-h4 text-primary font-weight-bold">{{ innovation.likes }}</div>
                    <div class="text-caption text-grey-darken-1">
                      <v-icon size="small" color="pink">mdi-heart</v-icon>
                      Likes
                    </div>
                  </v-col>
                  <v-col cols="6" class="text-center">
                    <div class="text-h4 text-primary font-weight-bold">{{ innovation.comments }}</div>
                    <div class="text-caption text-grey-darken-1">
                      <v-icon size="small" color="blue">mdi-comment</v-icon>
                      Comments
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Statistics -->
            <v-card class="mb-4 elevation-3 bg-indigo-lighten-5">
              <v-card-title class="text-indigo-darken-2 text-subtitle-1">
                <v-icon start>mdi-chart-bar</v-icon>
                Statistik
              </v-card-title>
              <v-card-text>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="indigo-darken-1">mdi-eye</v-icon>
                    </template>
                    <v-list-item-title>Dilihat</v-list-item-title>
                    <template v-slot:append>
                      <v-chip color="indigo" size="small" variant="elevated">
                        {{ innovation.dilihat }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="indigo-darken-1">mdi-star</v-icon>
                    </template>
                    <v-list-item-title>Minat</v-list-item-title>
                    <template v-slot:append>
                      <v-chip color="indigo" size="small" variant="elevated">
                        {{ innovation.minat }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="indigo-darken-1">mdi-handshake</v-icon>
                    </template>
                    <v-list-item-title>Kesepakatan</v-list-item-title>
                    <template v-slot:append>
                      <v-chip color="indigo" size="small" variant="elevated">
                        {{ innovation.kesepakatan }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="indigo-darken-1">mdi-content-copy</v-icon>
                    </template>
                    <v-list-item-title>Replikasi</v-list-item-title>
                    <template v-slot:append>
                      <v-chip color="indigo" size="small" variant="elevated">
                        {{ innovation.replikasi }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Instansi Info -->
            <v-card class="elevation-3 bg-blue-lighten-5">
              <v-card-title class="text-primary text-subtitle-1">
                <v-icon start>mdi-office-building</v-icon>
                Instansi
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-4">
                  <v-avatar size="60" class="mr-3 elevation-3">
                    <v-img :src="innovation.instansiLogo"></v-img>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold text-primary">{{ innovation.instansi }}</div>
                    <div class="text-body-2 text-grey-darken-1">{{ innovation.wilayah }}</div>
                    <div class="text-caption text-grey">{{ innovation.upp }}</div>
                  </div>
                </div>
                <v-btn 
                  color="primary" 
                  block
                  variant="elevated"
                  :href="'https://jippnas.menpan.go.id/instansi/' + innovation.instansiId"
                  target="_blank"
                >
                  <v-icon start>mdi-open-in-new</v-icon>
                  Kunjungi Profile
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Not Found -->
    <v-card v-else class="elevation-3">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
        <p class="mt-4 text-grey">Inovasi tidak ditemukan</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'sidebar'
})

const route = useRoute()
const innovationId = route.params.id

// State
const innovation = ref(null)
const loading = ref(true)

// Fetch innovation detail
const fetchInnovation = async () => {
  if (!innovationId) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await $fetch(`/api/master-inovasi/${innovationId}`)
    // if (response.success) {
    //   innovation.value = response.data
    // }

    // For now, simulate with sample data
    innovation.value = {
      id: innovationId,
      no: 1,
      tahun: '2023',
      noRegistrasi: '609805',
      judul: 'FastDuk (Solusi Cepat Layanan Adminduk)',
      jenis: 'Sistem Informasi',
      institusi: 'Pemerintah Aceh',
      upp: 'Direktorat Pelayanan Publik',
      wilayah: 'Aceh',
      sdgs: 'Tanpa Kemiskinan, Kehidupan Sehat dan Sejahtera, Berkurangnya Kesenjangan',
      penghargaan: '28 OAPSI/2025',
      tahunImplementasi: '2023',
      namaInnovator: 'Drs. Teuku Syarbaini, M.Si, dkk',
      namaPemangku: 'Kementerian Dalam Negeri',
      video: 'https://www.youtube.com/embed/20FfkCAUZlU',
      jumlahReplikasi: 23,
      alasanKeberlanjutan: 'Efisien',
      keberlanjutan: 'Ya',
      status: 'Berlanjut dengan pengembangan',
      lastUpdate: '2023-12-01',
      kurasiRingkasan: '<p>Seiring meningkatnya jumlah penduduk Aceh dalam empat tahun terakhir, kebutuhan layanan administrasi kependudukan (Adminduk) juga semakin tinggi. Untuk menjangkau masyarakat, khususnya di wilayah terpencil dan 3T, DRKA meluncurkan inovasi <strong>FastDuk</strong> sejak Februari 2022. Inovasi ini memudahkan masyarakat memperoleh dokumen Adminduk secara langsung, cepat, dan efisien. Hingga kini FastDuk telah diterapkan di 23 kabupaten/kota di Aceh dan mencetak 52.832 dokumen, terutama di Aceh Timur, Aceh Utara, Aceh Tenggara, dan Simeulue.</p>',
      latarBelakang: '<p>Jumlah penduduk Aceh terus meningkat, namun akses masyarakat ke layanan administrasi kependudukan (Adminduk) di wilayah terpencil dan 3T masih terbatas. Untuk mempermudah dan mempercepat masyarakat memperoleh dokumen kependudukan, DRKA meluncurkan inovasi Fastduk sejak Februari 2022 yang kini diterapkan di 23 kabupaten/kota di Aceh</p>',
      tujuan: '<p>FastDuk bertujuan meningkatkan kecepatan, efisiensi, dan aksesibilitas layanan adminduk, memastikan data kependudukan akurat, memperluas jangkauan hingga wilayah terpencil dan kelompok rentan, meningkatkan kepuasan masyarakat, serta mengurangi praktik pungli melalui layanan langsung di lapangan</p>',
      kebaharuan: '<p>FastDuk menghadirkan layanan adminduk cepat, mudah, transparan, dan inklusif dengan pemanfaatan teknologi digital dan mobile service. Inovasi ini menyederhanakan birokrasi, memperluas akses hingga wilayah terpencil dan kelompok rentan, mencegah pungli, serta mendukung data kependudukan akurat untuk kebijakan publik</p>',
      evaluasiDampak: '<p>FastDuk mempercepat layanan dokumen adminduk dari 3–7 hari menjadi ≤1 hari, meningkatkan cakupan hingga 85% gampong, menurunkan pengaduan, dan meningkatkan kepemilikan dokumen lengkap dari 70% menjadi 99%. Inovasi ini memperluas akses layanan untuk seluruh masyarakat, mendukung pendidikan, kesehatan, kesetaraan gender, dan penguatan SDM inklusif, khususnya di wilayah terpencil.</p>',
      adaptasiReplikasi: '<p>FastDuk memiliki potensi replikasi tinggi secara nasional karena konsep layanan cepat, jemput bola, dan digitalisasi dapat disesuaikan dengan daerah perkotaan maupun terpencil. Secara teknis memanfaatkan SIAK terpusat, SOP satu hari kerja, dan infrastruktur sederhana. Secara manajerial didukung kolaborasi lintas instansi, komitmen pemimpin daerah, dan monitoring rutin</p>',
      sumberDaya: '<p>FastDuk memanfaatkan sarana dan prasarana seperti laptop, perangkat mobile, kendaraan operasional, serta koneksi internet untuk layanan jemput bola ke wilayah 3T. Sumber daya informasi berupa database kependudukan, data penduduk rentan, dan peta titik layanan mendukung perencanaan dan pelaksanaan. Sumber daya manusia dikelola adaptif dan kolaboratif, berkompetensi teknis serta komunikatif untuk memastikan layanan cepat, akurat, dan inklusif. Anggaran berasal dari APBA Pemerintah Aceh dan digunakan secara efektif untuk operasional, digitalisasi, dan penyediaan layanan langsung ke masyarakat.</p>',
      kondisiKeberlanjutan: '<p>FastDuk berjalan aktif di 23 kabupaten/kota Aceh, menghadirkan layanan adminduk cepat dan jemput bola dengan dukungan teknologi digital, SOP satu hari kerja, serta SDM kompeten dan kolaboratif. Layanan menjangkau wilayah terpencil dan kelompok rentan, sambil terus dikembangkan melalui literasi masyarakat, perluasan cakupan, dan transfer pengetahuan untuk replikasi.</p>',
      oecd: '',
      rbTematik: '',
      kompetisi: '',
      publikasi: '08 Jan 2026',
      provinsi: 'Aceh',
      likes: 0,
      comments: 0,
      dilihat: 2,
      minat: 0,
      kesepakatan: 0,
      replikasi: 23,
      instansiLogo: 'https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png',
      instansiId: 'PMD11',
      image: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png'
    }
  } catch (error) {
    console.error('Error fetching innovation:', error)
    innovation.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInnovation()
})
</script>

<style scoped>
.sticky-sidebar {
  position: sticky;
  top: 80px;
}

.text-justify {
  text-align: justify;
}

.content-text {
  line-height: 1.8;
  color: #424242;
}

.content-text :deep(p) {
  margin-bottom: 1rem;
}

.content-text :deep(strong) {
  color: #1976D2;
  font-weight: 600;
}

.video-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}
</style>