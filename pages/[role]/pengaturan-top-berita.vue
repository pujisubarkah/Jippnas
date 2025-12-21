<template>
  <div class="pengaturan-top-berita-page">
    <v-card class="pa-6">
      <v-card-title class="text-h4 mb-4">
        <v-icon start>mdi-star</v-icon>
        Pengaturan Top Berita
      </v-card-title>

      <v-card-text>
        <v-alert type="info" class="mb-4">
          Atur berita mana yang akan ditampilkan sebagai top berita di halaman utama.
        </v-alert>

        <!-- Current Top News -->
        <v-card class="mb-6" outlined>
          <v-card-title class="text-h6 bg-primary text-white">
            <v-icon start>mdi-star</v-icon>
            Top Berita Saat Ini
          </v-card-title>
          <v-card-text>
            <v-row v-if="currentTopBerita">
              <v-col cols="12" md="8">
                <h3 class="text-h6 mb-2">{{ currentTopBerita.judul }}</h3>
                <p class="text-body-2 text-grey-darken-1 mb-2">{{ currentTopBerita.ringkasan }}</p>
                <div class="d-flex align-center text-caption text-grey-darken-2">
                  <v-icon size="small" class="mr-1">mdi-account</v-icon>
                  {{ currentTopBerita.penulis }}
                  <v-divider vertical class="mx-2" />
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(currentTopBerita.created_at) }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <v-img
                  :src="currentTopBerita.gambar || '/placeholder-news.jpg'"
                  height="120"
                  cover
                  class="rounded"
                />
              </v-col>
            </v-row>
            <v-alert v-else type="warning" class="mb-0">
              Belum ada top berita yang dipilih.
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Available News for Top -->
        <v-card outlined>
          <v-card-title>
            <v-icon start>mdi-newspaper</v-icon>
            Pilih Top Berita Baru
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Cari berita..."
              prepend-icon="mdi-magnify"
              clearable
              class="mb-4"
            />

            <v-data-table
              :headers="headers"
              :items="filteredBerita"
              :loading="loading"
              class="elevation-1"
              show-select
              v-model="selectedBerita"
              single-select
              item-value="id"
            >
              <template v-slot:item.gambar="{ item }">
                <v-avatar size="40">
                  <v-img :src="item.gambar || '/placeholder-news.jpg'" />
                </v-avatar>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.top_berita="{ item }">
                <v-icon
                  :color="item.top_berita ? 'warning' : 'grey'"
                  size="small"
                >
                  {{ item.top_berita ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="previewBerita(item)"
                />
              </template>
            </v-data-table>

            <v-card-actions class="justify-end mt-4">
              <v-btn
                color="primary"
                :disabled="!selectedBerita.length"
                @click="setAsTopBerita"
              >
                <v-icon start>mdi-star</v-icon>
                Jadikan Top Berita
              </v-btn>
              <v-btn
                v-if="currentTopBerita"
                color="error"
                variant="outlined"
                @click="removeTopBerita"
              >
                <v-icon start>mdi-star-off</v-icon>
                Hapus Top Berita
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Preview Dialog -->
    <v-dialog v-model="showPreviewDialog" max-width="800">
      <v-card v-if="previewBeritaData">
        <v-card-title>
          <v-icon start>mdi-eye</v-icon>
          Preview Berita
        </v-card-title>
        <v-card-text>
          <v-img
            :src="previewBeritaData.gambar || '/placeholder-news.jpg'"
            height="200"
            cover
            class="mb-4 rounded"
          />
          <h2 class="text-h5 mb-3">{{ previewBeritaData.judul }}</h2>
          <p class="text-body-1 mb-4">{{ previewBeritaData.ringkasan }}</p>
          <div class="text-body-2 mb-4" v-html="previewBeritaData.isi"></div>
          <div class="d-flex align-center text-caption text-grey-darken-2">
            <v-icon size="small" class="mr-1">mdi-account</v-icon>
            {{ previewBeritaData.penulis }}
            <v-divider vertical class="mx-2" />
            <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
            {{ formatDate(previewBeritaData.created_at) }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showPreviewDialog = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'sidebar'
})

// Reactive data
const search = ref('')
const loading = ref(false)
const selectedBerita = ref([])
const showPreviewDialog = ref(false)
const previewBeritaData = ref(null)

// Mock data - replace with API calls
const beritaList = ref([
  {
    id: 1,
    judul: 'Inovasi Teknologi Terbaru di Indonesia',
    ringkasan: 'Berita tentang inovasi teknologi terbaru yang dikembangkan di Indonesia...',
    isi: '<p>Isi lengkap berita tentang inovasi teknologi...</p>',
    kategori: 'Teknologi',
    penulis: 'Admin JIPPNAS',
    gambar: '/placeholder-news.jpg',
    status: 'Published',
    top_berita: true,
    dibaca: 250,
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: 2,
    judul: 'Peluncuran Program Inovasi Baru',
    ringkasan: 'JIPPNAS meluncurkan program inovasi baru untuk mendorong kreativitas...',
    isi: '<p>Isi lengkap berita tentang peluncuran program...</p>',
    kategori: 'Program',
    penulis: 'Tim Inovasi',
    gambar: '/placeholder-news.jpg',
    status: 'Published',
    top_berita: false,
    dibaca: 180,
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: 3,
    judul: 'Workshop Inovasi Digital',
    ringkasan: 'Workshop inovasi digital berhasil dilaksanakan dengan antusiasme tinggi...',
    isi: '<p>Isi lengkap berita tentang workshop...</p>',
    kategori: 'Event',
    penulis: 'Tim Event',
    gambar: '/placeholder-news.jpg',
    status: 'Published',
    top_berita: false,
    dibaca: 95,
    created_at: '2024-01-08',
    updated_at: '2024-01-08'
  }
])

// Table headers
const headers = [
  { title: 'Gambar', key: 'gambar', sortable: false },
  { title: 'Judul', key: 'judul' },
  { title: 'Kategori', key: 'kategori' },
  { title: 'Status', key: 'status' },
  { title: 'Top Berita', key: 'top_berita', sortable: false },
  { title: 'Dibaca', key: 'dibaca' },
  { title: 'Aksi', key: 'actions', sortable: false }
]

// Computed
const filteredBerita = computed(() => {
  let filtered = beritaList.value.filter(item => item.status === 'Published')

  if (search.value) {
    filtered = filtered.filter(item =>
      item.judul.toLowerCase().includes(search.value.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  return filtered
})

const currentTopBerita = computed(() => {
  return beritaList.value.find(item => item.top_berita) || null
})

// Methods
const previewBerita = (item) => {
  previewBeritaData.value = item
  showPreviewDialog.value = true
}

const setAsTopBerita = async () => {
  if (selectedBerita.value.length === 0) return

  const selectedId = selectedBerita.value[0]

  // Remove current top berita
  beritaList.value.forEach(item => {
    item.top_berita = false
  })

  // Set new top berita
  const selectedItem = beritaList.value.find(item => item.id === selectedId)
  if (selectedItem) {
    selectedItem.top_berita = true
  }

  selectedBerita.value = []

  // Show success message
  console.log('Top berita berhasil diubah')
}

const removeTopBerita = async () => {
  if (currentTopBerita.value) {
    currentTopBerita.value.top_berita = false
  }

  // Show success message
  console.log('Top berita berhasil dihapus')
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Published': return 'success'
    case 'Draft': return 'warning'
    case 'Archived': return 'grey'
    default: return 'grey'
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  // Load data from API if needed
})
</script>

<style scoped>
.pengaturan-top-berita-page {
  min-height: 100vh;
}
</style>