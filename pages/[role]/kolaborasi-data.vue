<template>
  <div class="pa-6">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-primary mb-2">Kolaborasi Data</h1>
      <p class="text-body-1 text-grey-darken-1">
        Kelola data kolaborasi dari berbagai platform
      </p>
    </div>

    <v-card>
      <v-tabs v-model="activeTab" color="primary" align-tabs="start">
        <v-tab value="inoland">Inoland</v-tab>
        <v-tab value="tuxedovation">Tuxedovation</v-tab>
        <v-tab value="inovasi-proper">Inovasi Proper Peserta</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeTab">
          <!-- Tab Inoland -->
          <v-window-item value="inoland">
            <div class="py-4">
              <div class="d-flex justify-space-between align-center mb-4">
                <h2 class="text-h6">Data Inoland</h2>
                <div class="d-flex ga-2">
                  <v-btn 
                    v-if="selectedInoland.length > 0"
                    color="success" 
                    variant="flat"
                    @click="uploadInolandToDatabase"
                    :loading="uploadingInoland"
                    prepend-icon="mdi-cloud-upload"
                  >
                    Upload {{ selectedInoland.length }} Data
                  </v-btn>
                  <v-btn 
                    color="primary" 
                    variant="flat"
                    @click="fetchInolandData"
                    :loading="loadingInoland"
                    prepend-icon="mdi-refresh"
                  >
                    Refresh Data
                  </v-btn>
                </div>
              </div>

              <v-alert v-if="errorInoland" type="error" variant="tonal" class="mb-4" closable @click:close="errorInoland = null">
                {{ errorInoland }}
              </v-alert>

              <v-alert v-if="!loadingInoland && inolandData.length === 0 && !errorInoland" type="info" variant="tonal" class="mb-4">
                Total data: {{ inolandData.length }}
              </v-alert>

              <v-data-table
                :headers="inolandHeaders"
                :items="inolandData"
                :loading="loadingInoland"
                class="elevation-1"
                :items-per-page="10"
                :search="searchInoland"
                v-model="selectedInoland"
                show-select
                item-value="id"
              >
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-text-field
                      v-model="searchInoland"
                      prepend-inner-icon="mdi-magnify"
                      label="Cari data..."
                      single-line
                      hide-details
                      clearable
                      variant="outlined"
                      density="compact"
                      class="mb-2"
                    ></v-text-field>
                  </v-toolbar>
                </template>

                <template v-slot:item.sdgs="{ item }">
                  <v-chip v-if="item.sdgs" color="primary" size="small">
                    {{ item.sdgs }}
                  </v-chip>
                  <span v-else class="text-grey">-</span>
                </template>

                <template v-slot:item.deskripsi="{ item }">
                  <div class="text-truncate" style="max-width: 300px;">
                    {{ item.deskripsi || '-' }}
                  </div>
                </template>

                <template v-slot:loading>
                  <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>

                <template v-slot:no-data>
                  <div class="text-center py-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-database-off</v-icon>
                    <p class="text-body-1 text-grey mt-4">Tidak ada data tersedia</p>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-window-item>

          <!-- Tab Tuxedovation -->
          <v-window-item value="tuxedovation">
            <div class="py-4">
              <h2 class="text-h6 mb-4">Data Tuxedovation</h2>
              <p class="text-body-2 text-grey-darken-1 mb-4">
                Konten untuk kolaborasi data Tuxedovation akan ditampilkan di sini
              </p>
              
              <!-- Placeholder untuk konten Tuxedovation -->
              <v-alert type="info" variant="tonal" class="mb-4">
                Fitur sedang dalam pengembangan
              </v-alert>
            </div>
          </v-window-item>

          <!-- Tab Inovasi Proper Peserta -->
          <v-window-item value="inovasi-proper">
            <div class="py-4">
              <div class="d-flex justify-space-between align-center mb-4">
                <h2 class="text-h6">Data Inovasi Proper Peserta</h2>
                <div class="d-flex ga-2">
                  <v-btn 
                    v-if="selectedInovasiProper.length > 0"
                    color="success" 
                    variant="flat"
                    @click="uploadInovasiProperToDatabase"
                    :loading="uploadingInovasiProper"
                    prepend-icon="mdi-cloud-upload"
                  >
                    Upload {{ selectedInovasiProper.length }} Data
                  </v-btn>
                  <v-btn 
                    color="primary" 
                    variant="flat"
                    @click="fetchInovasiProperData"
                    :loading="loadingInovasiProper"
                    prepend-icon="mdi-refresh"
                  >
                    Refresh Data
                  </v-btn>
                </div>
              </div>

              <v-alert v-if="errorInovasiProper" type="error" variant="tonal" class="mb-4" closable @click:close="errorInovasiProper = null">
                {{ errorInovasiProper }}
              </v-alert>

              <v-alert v-if="!loadingInovasiProper && inovasiProperData.length === 0 && !errorInovasiProper" type="info" variant="tonal" class="mb-4">
                Total data: {{ inovasiProperData.length }}
              </v-alert>

              <v-data-table
                :headers="inovasiProperHeaders"
                :items="inovasiProperData"
                :loading="loadingInovasiProper"
                class="elevation-1"
                :items-per-page="10"
                :search="searchInovasiProper"
                v-model="selectedInovasiProper"
                show-select
                item-value="id"
              >
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-text-field
                      v-model="searchInovasiProper"
                      prepend-inner-icon="mdi-magnify"
                      label="Cari data..."
                      single-line
                      hide-details
                      clearable
                      variant="outlined"
                      density="compact"
                      class="mb-2"
                    ></v-text-field>
                  </v-toolbar>
                </template>

                <template v-slot:item.kategori="{ item }">
                  <v-chip v-if="item.kategori" color="primary" size="small">
                    {{ item.kategori }}
                  </v-chip>
                  <span v-else class="text-grey">-</span>
                </template>

                <template v-slot:item.deskripsi="{ item }">
                  <div class="text-truncate" style="max-width: 300px;">
                    {{ item.deskripsi || '-' }}
                  </div>
                </template>

                <template v-slot:loading>
                  <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>

                <template v-slot:no-data>
                  <div class="text-center py-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-database-off</v-icon>
                    <p class="text-body-1 text-grey mt-4">Tidak ada data tersedia</p>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'sidebar',
  middleware: ['auth']
})

const activeTab = ref('inoland')

// Inoland Data
const inolandData = ref([])
const loadingInoland = ref(false)
const errorInoland = ref(null)
const searchInoland = ref('')
const selectedInoland = ref([])
const uploadingInoland = ref(false)

// Inovasi Proper Peserta Data
const inovasiProperData = ref([])
const loadingInovasiProper = ref(false)
const errorInovasiProper = ref(null)
const searchInovasiProper = ref('')
const selectedInovasiProper = ref([])
const uploadingInovasiProper = ref(false)

const inolandHeaders = [
  { title: 'Judul Inovasi', key: 'judul_inovasi', sortable: true },
  { title: 'SDGS', key: 'sdgs', sortable: true },
  { title: 'Tahun', key: 'tahun', sortable: true },
  { title: 'Instansi', key: 'instansi', sortable: true },
  { title: 'Innovator', key: 'inovator', sortable: true },
  { title: 'Unit Kerja', key: 'unit_kerja', sortable: true },
  { title: 'Deskripsi', key: 'deskripsi', sortable: false }
]

const inovasiProperHeaders = [
  { title: 'Judul', key: 'judul', sortable: true },
  { title: 'Kategori', key: 'kategori', sortable: true },
  { title: 'Tahun', key: 'tahun', sortable: true },
  { title: 'Angkatan', key: 'angkatan', sortable: true },
  { title: 'Instansi', key: 'instansi', sortable: true },
  { title: 'Nama', key: 'nama', sortable: true },
  { title: 'Deskripsi', key: 'deskripsi', sortable: false }
]

const fetchInolandData = async () => {
  loadingInoland.value = true
  errorInoland.value = null
  
  try {
    console.log('Fetching Inoland data...')
    
    // Menggunakan API proxy internal untuk menghindari CORS
    const data = await $fetch('/api/inoland')
    console.log('Response received:', data)
    
    if (data.success && data.data) {
      inolandData.value = data.data.map(item => ({
        id: item.id,
        judul_inovasi: item.judul_inovasi,
        sdgs: item.sdgs?.nama || null,
        tahun: item.tahun,
        instansi: item.instansi?.agency_name || '-',
        inovator: item.inovator,
        unit_kerja: item.inovator_detail?.inovator || item.kld || '-',
        deskripsi: item.deskripsi,
        raw_data: item // Simpan data lengkap untuk detail
      }))
      console.log('Data mapped:', inolandData.value.length, 'items')
    } else {
      throw new Error('Format data tidak sesuai')
    }
  } catch (error) {
    console.error('Error fetching Inoland data:', error)
    errorInoland.value = `Gagal mengambil data: ${error.message}`
  } finally {
    loadingInoland.value = false
  }
}

const fetchInovasiProperData = async () => {
  loadingInovasiProper.value = true
  errorInovasiProper.value = null
  
  try {
    console.log('Fetching Inovasi Proper Peserta data...')
    
    // Menggunakan API proxy internal untuk menghindari CORS
    const response = await $fetch('/api/inovasi-proper', {
      params: {
        perPage: 100,
        page: 1
      }
    })
    console.log('Response received:', response)
    
    if (response.status && response.data && response.data.data) {
      inovasiProperData.value = response.data.data.map(item => ({
        id: item.id_proper,
        judul: item.judul,
        kategori: item.ref_proper_kategori?.nama || null,
        tahun: item.tahun,
        angkatan: item.angkatan,
        instansi: item.md_instansi?.nama || '-',
        nama: item.nama,
        deskripsi: item.deskripsi_singkat?.replace(/(<([^>]+)>)/gi, '') || item.deskripsi_lengkap?.replace(/(<([^>]+)>)/gi, '') || '-',
        raw_data: item // Simpan data lengkap untuk detail
      }))
      console.log('Data mapped:', inovasiProperData.value.length, 'items')
    } else {
      throw new Error('Format data tidak sesuai')
    }
  } catch (error) {
    console.error('Error fetching Inovasi Proper Peserta data:', error)
    errorInovasiProper.value = `Gagal mengambil data: ${error.message}`
  } finally {
    loadingInovasiProper.value = false
  }
}

const uploadInolandToDatabase = async () => {
  if (selectedInoland.value.length === 0) return
  
  uploadingInoland.value = true
  
  try {
    // Get full data for selected items
    const itemsToUpload = inolandData.value
      .filter(item => selectedInoland.value.includes(item.id))
      .map(item => ({
        external_id: item.raw_data.id,
        judul_inovasi: item.raw_data.judul_inovasi,
        tahun: item.raw_data.tahun,
        inovator: item.raw_data.inovator,
        unit_kerja: item.raw_data.inovator_detail?.inovator || item.raw_data.kld,
        deskripsi: item.raw_data.deskripsi,
        id_kabkot: item.raw_data.id_kabkot,
        id_sdgs: item.raw_data.id_sdgs,
        sdgs_nama: item.raw_data.sdgs?.nama,
        agency_id_panrb: item.raw_data.agency_id_panrb,
        instansi_nama: item.raw_data.instansi?.agency_name,
        provinsi_nama: item.raw_data.wilayah?.nama_provinsi,
        kabkot_nama: item.raw_data.wilayah?.nama_kabkot,
        raw_data: item.raw_data
      }))
    
    const response = await $fetch('/api/kolaborasi/inoland', {
      method: 'POST',
      body: { items: itemsToUpload }
    })
    
    if (response.success) {
      // Show success message (you can use toast notification here)
      alert(`Berhasil menyimpan ${response.data.length} data ke database`)
      selectedInoland.value = []
    }
  } catch (error) {
    console.error('Error uploading Inoland data:', error)
    alert('Gagal menyimpan data ke database')
  } finally {
    uploadingInoland.value = false
  }
}

const uploadInovasiProperToDatabase = async () => {
  if (selectedInovasiProper.value.length === 0) return
  
  uploadingInovasiProper.value = true
  
  try {
    // Get full data for selected items
    const itemsToUpload = inovasiProperData.value
      .filter(item => selectedInovasiProper.value.includes(item.id))
      .map(item => ({
        external_id: item.raw_data.id_proper,
        judul: item.raw_data.judul,
        tahun: item.raw_data.tahun,
        angkatan: item.raw_data.angkatan,
        nama: item.raw_data.nama,
        instansi_nama: item.raw_data.md_instansi?.nama,
        kategori_nama: item.raw_data.ref_proper_kategori?.nama,
        deskripsi_singkat: item.raw_data.deskripsi_singkat,
        deskripsi_lengkap: item.raw_data.deskripsi_lengkap,
        link_youtube: item.raw_data.link_youtube,
        raw_data: item.raw_data
      }))
    
    const response = await $fetch('/api/kolaborasi/inovasi-proper', {
      method: 'POST',
      body: { items: itemsToUpload }
    })
    
    if (response.success) {
      // Show success message (you can use toast notification here)
      alert(`Berhasil menyimpan ${response.data.length} data ke database`)
      selectedInovasiProper.value = []
    }
  } catch (error) {
    console.error('Error uploading Inovasi Proper data:', error)
    alert('Gagal menyimpan data ke database')
  } finally {
    uploadingInovasiProper.value = false
  }
}

// Load data on mount
onMounted(() => {
  fetchInolandData()
  fetchInovasiProperData()
})
</script>

<style scoped>
.v-tab {
  text-transform: none;
  font-weight: 500;
}
</style>
